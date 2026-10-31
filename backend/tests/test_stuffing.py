"""
Unit tests for the bit_stuff algorithm.

Expected outputs were manually verified independently of the implementation:

  Rule: after every 5 consecutive 1s insert a '0'; reset counter.

  11111       → 111110        (5 ones → stuff after 5th)
  111111      → 1111101       (5+stuff + 1 more = 111110 + 1)
  1111111111  → 111110111110  (two groups of 5)
  101010      → 101010        (no run of 5, unchanged)
  00000       → 00000         (no 1s, unchanged)
  11111011111 → 1111100111110 (two separated runs of 5)
  1011111010  → 10111110010   (run of 5 embedded)
"""

import pytest
from app.algorithms import bit_stuff, validate_bits, MAX_INPUT_LENGTH


# ---------------------------------------------------------------------------
# Happy-path output tests
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("original, expected_stuffed, expected_zeros", [
    ("11111",       "111110",       1),
    ("111111",      "1111101",      1),
    ("1111111111",  "111110111110", 2),
    ("101010",      "101010",       0),
    ("00000",       "00000",        0),
    ("11111011111", "1111100111110",2),
    ("1011111010",  "10111110010",  1),
    # Additional cases
    ("0",           "0",            0),
    ("1",           "1",            0),
    ("1111",        "1111",         0),   # 4 ones → no stuff
    ("111110",      "1111100",      1),   # 5 ones → stuffed zero inserted, then payload '0' appended → 1111100
    ("111111111111111", "111110111110111110", 3),  # 15 ones → 3 stuffed zeros
])
def test_stuff_output(original: str, expected_stuffed: str, expected_zeros: int):
    result = bit_stuff(original)
    assert result.stuffed_bits == expected_stuffed, (
        f"Input '{original}': expected stuffed '{expected_stuffed}', "
        f"got '{result.stuffed_bits}'"
    )
    assert result.stuffed_zero_count == expected_zeros, (
        f"Input '{original}': expected {expected_zeros} stuffed zeros, "
        f"got {result.stuffed_zero_count}"
    )


# ---------------------------------------------------------------------------
# Length and overhead tests
# ---------------------------------------------------------------------------

def test_stuff_lengths():
    result = bit_stuff("111111")
    assert result.original_length == 6
    assert result.stuffed_length == 7
    assert result.stuffed_zero_count == 1


def test_overhead_percentage():
    result = bit_stuff("111111")
    # overhead = stuffed_zeros / original_length * 100 = 1/6*100 ≈ 16.67
    assert abs(result.overhead_percentage - 16.67) < 0.01


def test_no_overhead_when_no_stuff():
    result = bit_stuff("101010")
    assert result.overhead_percentage == 0.0
    assert result.stuffed_zero_count == 0


# ---------------------------------------------------------------------------
# Step record tests
# ---------------------------------------------------------------------------

def test_stuff_steps_are_generated():
    result = bit_stuff("11111")
    assert len(result.steps) > 0


def test_stuff_step_actions_for_six_ones():
    """For '111111', steps should include exactly one 'stuff' action."""
    result = bit_stuff("111111")
    stuff_actions = [s for s in result.steps if s.action == "stuff"]
    assert len(stuff_actions) == 1, (
        f"Expected 1 'stuff' action, got {len(stuff_actions)}"
    )


def test_stuff_step_has_empty_input_bit_on_stuff():
    """The synthetic 'stuff' step should have an empty input_bit."""
    result = bit_stuff("11111")
    stuff_steps = [s for s in result.steps if s.action == "stuff"]
    assert stuff_steps[0].input_bit == ""


def test_stuff_inserted_zero_position():
    """In '11111', the stuffed zero appears as the 6th character of the output."""
    result = bit_stuff("11111")
    assert result.stuffed_bits[5] == "0"


# ---------------------------------------------------------------------------
# Validation tests
# ---------------------------------------------------------------------------

def test_stuff_empty_input():
    with pytest.raises(ValueError, match="empty"):
        bit_stuff("")


def test_stuff_invalid_character():
    with pytest.raises(ValueError, match="invalid character"):
        bit_stuff("10201")


def test_stuff_invalid_character_space():
    with pytest.raises(ValueError, match="invalid character"):
        bit_stuff("101 01")


def test_stuff_invalid_character_letter():
    with pytest.raises(ValueError, match="invalid character"):
        bit_stuff("10A01")


def test_stuff_max_length_exceeded():
    with pytest.raises(ValueError, match="maximum allowed length"):
        bit_stuff("1" * (MAX_INPUT_LENGTH + 1))


def test_stuff_max_length_exact():
    """Exactly at the max length should NOT raise."""
    result = bit_stuff("1" * MAX_INPUT_LENGTH)
    assert len(result.stuffed_bits) >= MAX_INPUT_LENGTH
