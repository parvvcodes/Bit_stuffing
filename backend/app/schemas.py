"""
Pydantic request / response schemas for the FastAPI endpoints.
"""

from pydantic import BaseModel, field_validator, model_validator
from typing import Literal
from app.algorithms import MAX_INPUT_LENGTH


# ---------------------------------------------------------------------------
# Shared
# ---------------------------------------------------------------------------

class ErrorResponse(BaseModel):
    detail: str


# ---------------------------------------------------------------------------
# Bit Stuffing
# ---------------------------------------------------------------------------

class StuffRequest(BaseModel):
    bits: str

    @field_validator("bits")
    @classmethod
    def validate_bits_field(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Input must not be empty.")
        if len(v) > MAX_INPUT_LENGTH:
            raise ValueError(
                f"Input exceeds the maximum allowed length of {MAX_INPUT_LENGTH} bits."
            )
        invalid = set(v) - {"0", "1"}
        if invalid:
            chars = ", ".join(repr(c) for c in sorted(invalid))
            raise ValueError(
                f"Input contains invalid character(s): {chars}. "
                "Only '0' and '1' are allowed."
            )
        return v


class StuffStepSchema(BaseModel):
    step_index: int
    input_bit: str
    ones_count_before: int
    ones_count_after: int
    output_so_far: str
    action: Literal["copy", "stuff"]
    explanation: str


class StuffResponse(BaseModel):
    original_bits: str
    stuffed_bits: str
    original_length: int
    stuffed_length: int
    stuffed_zero_count: int
    overhead_percentage: float
    steps: list[StuffStepSchema]


# ---------------------------------------------------------------------------
# Bit Destuffing
# ---------------------------------------------------------------------------

class DestuffRequest(BaseModel):
    bits: str

    @field_validator("bits")
    @classmethod
    def validate_bits_field(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Input must not be empty.")
        if len(v) > MAX_INPUT_LENGTH:
            raise ValueError(
                f"Input exceeds the maximum allowed length of {MAX_INPUT_LENGTH} bits."
            )
        invalid = set(v) - {"0", "1"}
        if invalid:
            chars = ", ".join(repr(c) for c in sorted(invalid))
            raise ValueError(
                f"Input contains invalid character(s): {chars}. "
                "Only '0' and '1' are allowed."
            )
        return v


class DestuffStepSchema(BaseModel):
    step_index: int
    input_bit: str
    ones_count_before: int
    ones_count_after: int
    output_so_far: str
    action: Literal["copy", "remove_stuffed"]
    explanation: str


class DestuffResponse(BaseModel):
    stuffed_bits: str
    destuffed_bits: str
    stuffed_length: int
    destuffed_length: int
    removed_zero_count: int
    steps: list[DestuffStepSchema]


# ---------------------------------------------------------------------------
# Examples
# ---------------------------------------------------------------------------

class ExampleItem(BaseModel):
    label: str
    description: str
    original_bits: str
    stuffed_bits: str
    stuffed_zero_count: int


class ExamplesResponse(BaseModel):
    examples: list[ExampleItem]


# ---------------------------------------------------------------------------
# Quiz
# ---------------------------------------------------------------------------

class QuizChoice(BaseModel):
    id: str
    text: str


class QuizQuestion(BaseModel):
    id: str
    difficulty: Literal["easy", "medium", "hard"]
    type: Literal["multiple_choice", "stuff_challenge", "destuff_challenge"]
    question: str
    choices: list[QuizChoice] | None = None
    correct_answer: str
    explanation: str
    input_bits: str | None = None


class QuizResponse(BaseModel):
    questions: list[QuizQuestion]


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------

class HealthResponse(BaseModel):
    status: str
    message: str
