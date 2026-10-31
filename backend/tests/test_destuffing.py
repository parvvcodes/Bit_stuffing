"""
Unit tests for the bit_destuff algorithm and API endpoints.

Destuffing is the inverse of stuffing. Every valid stuffed bitstream produced
by bit_stuff must round-trip back to the original payload.

Additionally tests:
  - Standalone destuff cases
  - Step records and removed-zero positions
  - Input validation
  - API health, stuff, destuff endpoints via httpx TestClient
"""

import pytest
from fastapi.testclient import TestClient

from app.algorithms import bit_stuff, bit_destuff, validate_bits, MAX_INPUT_LENGTH
from app.main import app


# ---------------------------------------------------------------------------
# TestClient for API tests
# ---------------------------------------------------------------------------

client = TestClient(app)


# ---------------------------------------------------------------------------
# Round-trip tests (stuff → destuff → original)
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("original", [
    "11111",
    "111111",
    "1111111111",
    "101010",
    "00000",
    "11111011111",
    "1011111010",
    "0",
    "1",
    "1111",
    "0101010101",
    "111110111110",      # already-stuffed looking string treated as payload
    "111111111111111",   # 15 ones
])
def test_round_trip(original: str):
    """bit_destuff(bit_stuff(x)) == x for all valid payloads."""
    stuffed = bit_stuff(original).stuffed_bits
    recovered = bit_destuff(stuffed).destuffed_bits
    assert recovered == original, (
        f"Round-trip failed for '{original}': "
        f"stuffed='{stuffed}', recovered='{recovered}'"
    )


# ---------------------------------------------------------------------------
# Explicit destuff output tests
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("stuffed, expected_destuffed, expected_removed", [
    ("111110",       "11111",       1),
    ("1111101",      "111111",      1),
    ("111110111110", "1111111111",  2),
    ("101010",       "101010",      0),
    ("00000",        "00000",       0),
    ("1111100111110","11111011111", 2),
    ("10111110010",  "1011111010",  1),
])
def test_destuff_output(stuffed: str, expected_destuffed: str, expected_removed: int):
    result = bit_destuff(stuffed)
    assert result.destuffed_bits == expected_destuffed, (
        f"Stuffed '{stuffed}': expected destuffed '{expected_destuffed}', "
        f"got '{result.destuffed_bits}'"
    )
    assert result.removed_zero_count == expected_removed, (
        f"Stuffed '{stuffed}': expected {expected_removed} removed zeros, "
        f"got {result.removed_zero_count}"
    )


# ---------------------------------------------------------------------------
# Length tests
# ---------------------------------------------------------------------------

def test_destuff_lengths():
    result = bit_destuff("1111101")
    assert result.stuffed_length == 7
    assert result.destuffed_length == 6
    assert result.removed_zero_count == 1


# ---------------------------------------------------------------------------
# Step record tests
# ---------------------------------------------------------------------------

def test_destuff_steps_are_generated():
    result = bit_destuff("111110")
    assert len(result.steps) > 0


def test_destuff_remove_stuffed_action():
    """For '111110', the last step should be 'remove_stuffed'."""
    result = bit_destuff("111110")
    remove_steps = [s for s in result.steps if s.action == "remove_stuffed"]
    assert len(remove_steps) == 1


def test_destuff_step_indices_are_sequential():
    result = bit_destuff("1111101")
    indices = [s.step_index for s in result.steps]
    assert indices == list(range(len(indices)))


# ---------------------------------------------------------------------------
# Validation tests
# ---------------------------------------------------------------------------

def test_destuff_empty_input():
    with pytest.raises(ValueError, match="empty"):
        bit_destuff("")


def test_destuff_invalid_character():
    with pytest.raises(ValueError, match="invalid character"):
        bit_destuff("10201")


def test_destuff_max_length_exceeded():
    with pytest.raises(ValueError, match="maximum allowed length"):
        bit_destuff("0" * (MAX_INPUT_LENGTH + 1))


# ---------------------------------------------------------------------------
# validate_bits standalone tests
# ---------------------------------------------------------------------------

def test_validate_bits_valid():
    validate_bits("1010")  # should not raise


def test_validate_bits_empty():
    with pytest.raises(ValueError, match="empty"):
        validate_bits("")


def test_validate_bits_invalid_chars():
    with pytest.raises(ValueError, match="invalid character"):
        validate_bits("1020")


def test_validate_bits_length_limit():
    with pytest.raises(ValueError, match="maximum allowed length"):
        validate_bits("1" * (MAX_INPUT_LENGTH + 1))


# ---------------------------------------------------------------------------
# API tests
# ---------------------------------------------------------------------------

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_api_stuff_success():
    response = client.post("/api/stuff", json={"bits": "111111"})
    assert response.status_code == 200
    data = response.json()
    assert data["stuffed_bits"] == "1111101"
    assert data["original_length"] == 6
    assert data["stuffed_length"] == 7
    assert data["stuffed_zero_count"] == 1
    assert len(data["steps"]) > 0


def test_api_stuff_no_stuffing_needed():
    response = client.post("/api/stuff", json={"bits": "101010"})
    assert response.status_code == 200
    data = response.json()
    assert data["stuffed_bits"] == "101010"
    assert data["stuffed_zero_count"] == 0


def test_api_stuff_invalid_chars():
    response = client.post("/api/stuff", json={"bits": "10201"})
    assert response.status_code == 422


def test_api_stuff_empty():
    response = client.post("/api/stuff", json={"bits": ""})
    assert response.status_code == 422


def test_api_destuff_success():
    response = client.post("/api/destuff", json={"bits": "1111101"})
    assert response.status_code == 200
    data = response.json()
    assert data["destuffed_bits"] == "111111"
    assert data["stuffed_length"] == 7
    assert data["destuffed_length"] == 6
    assert data["removed_zero_count"] == 1
    assert len(data["steps"]) > 0


def test_api_destuff_invalid_chars():
    response = client.post("/api/destuff", json={"bits": "abc"})
    assert response.status_code == 422


def test_api_examples():
    response = client.get("/api/examples")
    assert response.status_code == 200
    data = response.json()
    assert "examples" in data
    assert len(data["examples"]) > 0


def test_api_quiz():
    response = client.get("/api/quiz")
    assert response.status_code == 200
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) > 0


def test_api_stuff_step_content():
    """The 'stuff' action step should have an empty input_bit."""
    response = client.post("/api/stuff", json={"bits": "11111"})
    assert response.status_code == 200
    data = response.json()
    stuff_steps = [s for s in data["steps"] if s["action"] == "stuff"]
    assert len(stuff_steps) == 1
    assert stuff_steps[0]["input_bit"] == ""


def test_api_round_trip_via_http():
    """Stuff via API then destuff via API and confirm original is restored."""
    original = "11111011111"
    stuff_resp = client.post("/api/stuff", json={"bits": original})
    assert stuff_resp.status_code == 200
    stuffed = stuff_resp.json()["stuffed_bits"]

    destuff_resp = client.post("/api/destuff", json={"bits": stuffed})
    assert destuff_resp.status_code == 200
    recovered = destuff_resp.json()["destuffed_bits"]
    assert recovered == original
