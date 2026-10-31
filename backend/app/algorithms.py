"""
Bit Stuffing and Bit Destuffing Algorithms
==========================================
Standard rule: After every 5 consecutive 1s in the payload, insert a 0.
During destuffing, when 5 consecutive 1s are seen, the next bit (which must
be 0) is the stuffed zero and is removed.
"""

from dataclasses import dataclass, field
from typing import Literal


MAX_INPUT_LENGTH = 10_000


@dataclass
class StuffStep:
    """One step in the bit-stuffing walk-through."""
    step_index: int
    input_bit: str                    # current bit from original stream
    ones_count_before: int            # consecutive-1 counter before processing
    ones_count_after: int             # counter after processing this bit
    output_so_far: str                # accumulated output after this step
    action: Literal["copy", "stuff"]  # what happened
    explanation: str                  # human-readable description


@dataclass
class DestuffStep:
    """One step in the bit-destuffing walk-through."""
    step_index: int
    input_bit: str                           # current bit from stuffed stream
    ones_count_before: int
    ones_count_after: int
    output_so_far: str
    action: Literal["copy", "remove_stuffed"]
    explanation: str


@dataclass
class StuffResult:
    original_bits: str
    stuffed_bits: str
    original_length: int
    stuffed_length: int
    stuffed_zero_count: int
    overhead_percentage: float
    steps: list[StuffStep] = field(default_factory=list)


@dataclass
class DestuffResult:
    stuffed_bits: str
    destuffed_bits: str
    stuffed_length: int
    destuffed_length: int
    removed_zero_count: int
    steps: list[DestuffStep] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Validation helpers
# ---------------------------------------------------------------------------

def validate_bits(bits: str, max_length: int = MAX_INPUT_LENGTH) -> None:
    """Raise ValueError with a descriptive message on invalid input."""
    if not bits:
        raise ValueError("Input must not be empty.")
    if len(bits) > max_length:
        raise ValueError(
            f"Input exceeds the maximum allowed length of {max_length} bits."
        )
    invalid = set(bits) - {"0", "1"}
    if invalid:
        chars = ", ".join(repr(c) for c in sorted(invalid))
        raise ValueError(
            f"Input contains invalid character(s): {chars}. "
            "Only '0' and '1' are allowed."
        )


# ---------------------------------------------------------------------------
# Bit Stuffing
# ---------------------------------------------------------------------------

def bit_stuff(bits: str) -> StuffResult:
    """
    Perform bit stuffing on *bits*.

    Rule: after every 5 consecutive 1s in the data, insert a '0'.
    The counter resets after the stuffed zero is inserted.

    Returns a StuffResult with per-step detail.
    """
    validate_bits(bits)

    output: list[str] = []
    steps: list[StuffStep] = []
    ones_count = 0
    stuffed_zero_count = 0
    step_index = 0

    for bit in bits:
        before = ones_count

        if bit == "1":
            ones_count += 1
            output.append("1")
            action: Literal["copy", "stuff"] = "copy"
            explanation = (
                f"Read '1'. Consecutive-1 counter: {before} → {ones_count}."
            )
            steps.append(
                StuffStep(
                    step_index=step_index,
                    input_bit=bit,
                    ones_count_before=before,
                    ones_count_after=ones_count,
                    output_so_far="".join(output),
                    action=action,
                    explanation=explanation,
                )
            )
            step_index += 1

            # After 5 consecutive 1s → stuff a 0
            if ones_count == 5:
                before_stuff = ones_count
                ones_count = 0
                stuffed_zero_count += 1
                output.append("0")
                steps.append(
                    StuffStep(
                        step_index=step_index,
                        input_bit="",           # no new input bit; synthetic
                        ones_count_before=before_stuff,
                        ones_count_after=ones_count,
                        output_so_far="".join(output),
                        action="stuff",
                        explanation=(
                            f"5 consecutive 1s reached. "
                            f"Inserting stuffed '0'. Counter reset to 0."
                        ),
                    )
                )
                step_index += 1

        else:  # bit == "0"
            before = ones_count
            ones_count = 0
            output.append("0")
            steps.append(
                StuffStep(
                    step_index=step_index,
                    input_bit=bit,
                    ones_count_before=before,
                    ones_count_after=ones_count,
                    output_so_far="".join(output),
                    action="copy",
                    explanation=(
                        f"Read '0'. Consecutive-1 counter reset: {before} → 0."
                    ),
                )
            )
            step_index += 1

    stuffed = "".join(output)
    original_length = len(bits)
    stuffed_length = len(stuffed)
    overhead = (
        round((stuffed_zero_count / original_length) * 100, 2)
        if original_length > 0
        else 0.0
    )

    return StuffResult(
        original_bits=bits,
        stuffed_bits=stuffed,
        original_length=original_length,
        stuffed_length=stuffed_length,
        stuffed_zero_count=stuffed_zero_count,
        overhead_percentage=overhead,
        steps=steps,
    )


# ---------------------------------------------------------------------------
# Bit Destuffing
# ---------------------------------------------------------------------------

def bit_destuff(bits: str) -> DestuffResult:
    """
    Perform bit destuffing on *bits*.

    Rule: when 5 consecutive 1s have been seen, the immediately following
    bit is a stuffed '0' and is removed (not copied to output).

    If the expected stuffed zero is missing (i.e. the 6th bit is '1'),
    the stream is treated as normal data — the function does NOT raise an
    error because a valid payload could contain six or more 1s after
    stuffing is accounted for.  Only truly malformed characters cause an
    error (validated via validate_bits).
    """
    validate_bits(bits)

    output: list[str] = []
    steps: list[DestuffStep] = []
    ones_count = 0
    removed_zero_count = 0
    step_index = 0

    i = 0
    while i < len(bits):
        bit = bits[i]
        before = ones_count

        if ones_count == 5:
            # The next bit should be the stuffed '0'.
            if bit == "0":
                # Remove it.
                removed_zero_count += 1
                ones_count = 0
                steps.append(
                    DestuffStep(
                        step_index=step_index,
                        input_bit=bit,
                        ones_count_before=before,
                        ones_count_after=0,
                        output_so_far="".join(output),
                        action="remove_stuffed",
                        explanation=(
                            f"After 5 consecutive 1s, found '0' at position {i}. "
                            f"This is a stuffed zero → removed. Counter reset to 0."
                        ),
                    )
                )
                step_index += 1
                i += 1
                continue
            else:
                # 6th bit is '1'; treat it as payload data but reset counter.
                # This can happen with valid payloads if the implementation
                # chose not to stuff (shouldn't occur with standard stuffing,
                # but we handle it gracefully).
                ones_count = 1
                output.append("1")
                steps.append(
                    DestuffStep(
                        step_index=step_index,
                        input_bit=bit,
                        ones_count_before=before,
                        ones_count_after=ones_count,
                        output_so_far="".join(output),
                        action="copy",
                        explanation=(
                            f"After 5 consecutive 1s, expected stuffed '0' but "
                            f"found '1' at position {i}. Copying as payload. "
                            f"(Possibly malformed or non-standard encoding.)"
                        ),
                    )
                )
                step_index += 1
                i += 1
                continue

        if bit == "1":
            ones_count += 1
            output.append("1")
            steps.append(
                DestuffStep(
                    step_index=step_index,
                    input_bit=bit,
                    ones_count_before=before,
                    ones_count_after=ones_count,
                    output_so_far="".join(output),
                    action="copy",
                    explanation=(
                        f"Read '1'. Consecutive-1 counter: {before} → {ones_count}."
                    ),
                )
            )
        else:
            ones_count = 0
            output.append("0")
            steps.append(
                DestuffStep(
                    step_index=step_index,
                    input_bit=bit,
                    ones_count_before=before,
                    ones_count_after=0,
                    output_so_far="".join(output),
                    action="copy",
                    explanation=(
                        f"Read '0'. Consecutive-1 counter reset: {before} → 0."
                    ),
                )
            )

        step_index += 1
        i += 1

    destuffed = "".join(output)
    stuffed_length = len(bits)
    destuffed_length = len(destuffed)

    return DestuffResult(
        stuffed_bits=bits,
        destuffed_bits=destuffed,
        stuffed_length=stuffed_length,
        destuffed_length=destuffed_length,
        removed_zero_count=removed_zero_count,
        steps=steps,
    )
