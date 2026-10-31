"""
Service layer: bridges algorithm dataclasses → Pydantic response schemas.
"""

from app.algorithms import bit_stuff, bit_destuff, StuffResult, DestuffResult
from app.schemas import (
    StuffResponse,
    StuffStepSchema,
    DestuffResponse,
    DestuffStepSchema,
    ExamplesResponse,
    ExampleItem,
    QuizResponse,
    QuizQuestion,
    QuizChoice,
)


# ---------------------------------------------------------------------------
# Stuff service
# ---------------------------------------------------------------------------

def perform_stuff(bits: str) -> StuffResponse:
    result: StuffResult = bit_stuff(bits)
    steps = [
        StuffStepSchema(
            step_index=s.step_index,
            input_bit=s.input_bit,
            ones_count_before=s.ones_count_before,
            ones_count_after=s.ones_count_after,
            output_so_far=s.output_so_far,
            action=s.action,
            explanation=s.explanation,
        )
        for s in result.steps
    ]
    return StuffResponse(
        original_bits=result.original_bits,
        stuffed_bits=result.stuffed_bits,
        original_length=result.original_length,
        stuffed_length=result.stuffed_length,
        stuffed_zero_count=result.stuffed_zero_count,
        overhead_percentage=result.overhead_percentage,
        steps=steps,
    )


# ---------------------------------------------------------------------------
# Destuff service
# ---------------------------------------------------------------------------

def perform_destuff(bits: str) -> DestuffResponse:
    result: DestuffResult = bit_destuff(bits)
    steps = [
        DestuffStepSchema(
            step_index=s.step_index,
            input_bit=s.input_bit,
            ones_count_before=s.ones_count_before,
            ones_count_after=s.ones_count_after,
            output_so_far=s.output_so_far,
            action=s.action,
            explanation=s.explanation,
        )
        for s in result.steps
    ]
    return DestuffResponse(
        stuffed_bits=result.stuffed_bits,
        destuffed_bits=result.destuffed_bits,
        stuffed_length=result.stuffed_length,
        destuffed_length=result.destuffed_length,
        removed_zero_count=result.removed_zero_count,
        steps=steps,
    )


# ---------------------------------------------------------------------------
# Examples service
# ---------------------------------------------------------------------------

def get_examples() -> ExamplesResponse:
    """
    Return curated examples whose expected results are computed by the actual
    algorithm — never hard-coded independently.
    """
    raw = [
        {
            "label": "Five consecutive 1s",
            "description": "Exactly five 1s → one stuffed zero appended.",
            "original": "11111",
        },
        {
            "label": "Six consecutive 1s",
            "description": "Six 1s → stuffed zero after five, then one more 1.",
            "original": "111111",
        },
        {
            "label": "Ten consecutive 1s",
            "description": "Ten 1s → two runs of five, two stuffed zeros inserted.",
            "original": "1111111111",
        },
        {
            "label": "Mixed data",
            "description": "Realistic mixed bit pattern with a run of five 1s inside.",
            "original": "1011111010",
        },
        {
            "label": "No stuffing needed",
            "description": "Four 1s maximum — no stuffed zeros are inserted.",
            "original": "10111101",
        },
        {
            "label": "All zeros",
            "description": "All-zero input passes through unchanged.",
            "original": "00000000",
        },
        {
            "label": "Complex pattern",
            "description": "Multiple separated runs of five 1s.",
            "original": "11111011111",
        },
    ]

    items: list[ExampleItem] = []
    for entry in raw:
        r = bit_stuff(entry["original"])
        items.append(
            ExampleItem(
                label=entry["label"],
                description=entry["description"],
                original_bits=r.original_bits,
                stuffed_bits=r.stuffed_bits,
                stuffed_zero_count=r.stuffed_zero_count,
            )
        )
    return ExamplesResponse(examples=items)


# ---------------------------------------------------------------------------
# Quiz service
# ---------------------------------------------------------------------------

def get_quiz() -> QuizResponse:
    """
    Build quiz questions. Correct answers for stuffing/destuffing challenges
    are computed from the algorithm.
    """

    def stuffed(b: str) -> str:
        return bit_stuff(b).stuffed_bits

    def destuffed(b: str) -> str:
        return bit_destuff(b).destuffed_bits

    questions: list[QuizQuestion] = [
        # ---- Easy ----
        QuizQuestion(
            id="q1",
            difficulty="easy",
            type="multiple_choice",
            question="What is the purpose of bit stuffing in data link layer protocols?",
            choices=[
                QuizChoice(id="a", text="To compress data for faster transmission."),
                QuizChoice(
                    id="b",
                    text="To prevent the flag pattern (01111110) from appearing unintentionally in the payload.",
                ),
                QuizChoice(id="c", text="To encrypt data before transmission."),
                QuizChoice(id="d", text="To detect and correct bit errors."),
            ],
            correct_answer="b",
            explanation=(
                "Bit stuffing prevents the HDLC flag pattern '01111110' from occurring "
                "in the payload by inserting a '0' after every five consecutive '1' bits. "
                "This ensures the receiver can unambiguously identify frame boundaries."
            ),
        ),
        QuizQuestion(
            id="q2",
            difficulty="easy",
            type="multiple_choice",
            question="After how many consecutive 1 bits is a stuffed 0 inserted?",
            choices=[
                QuizChoice(id="a", text="3"),
                QuizChoice(id="b", text="4"),
                QuizChoice(id="c", text="5"),
                QuizChoice(id="d", text="6"),
            ],
            correct_answer="c",
            explanation=(
                "The standard rule is: after every 5 consecutive 1s in the payload, "
                "a '0' is inserted. The counter is then reset."
            ),
        ),
        QuizQuestion(
            id="q3",
            difficulty="easy",
            type="multiple_choice",
            question="What is the HDLC frame delimiter (flag) used in bit-oriented protocols?",
            choices=[
                QuizChoice(id="a", text="11111111"),
                QuizChoice(id="b", text="01010101"),
                QuizChoice(id="c", text="01111110"),
                QuizChoice(id="d", text="00000000"),
            ],
            correct_answer="c",
            explanation=(
                "The HDLC flag is '01111110'. It marks the beginning and end of a frame. "
                "Bit stuffing ensures this exact pattern never appears in the payload data."
            ),
        ),
        # ---- Medium ----
        QuizQuestion(
            id="q4",
            difficulty="medium",
            type="stuff_challenge",
            question="What is the stuffed output for the input '11111'?",
            choices=[
                QuizChoice(id="a", text=stuffed("11111")),
                QuizChoice(id="b", text="111111"),
                QuizChoice(id="c", text="11111"),
                QuizChoice(id="d", text="1111100"),
            ],
            correct_answer="a",
            explanation=(
                f"After 5 consecutive 1s, a '0' is inserted → '{stuffed('11111')}'. "
                "The counter resets to 0 after insertion."
            ),
            input_bits="11111",
        ),
        QuizQuestion(
            id="q5",
            difficulty="medium",
            type="stuff_challenge",
            question="What is the stuffed output for the input '111111' (six 1s)?",
            choices=[
                QuizChoice(id="a", text="111111"),
                QuizChoice(id="b", text=stuffed("111111")),
                QuizChoice(id="c", text="111110111110"),
                QuizChoice(id="d", text="11111100"),
            ],
            correct_answer="b",
            explanation=(
                f"After the 5th '1', a '0' is stuffed, then the 6th '1' follows normally "
                f"→ '{stuffed('111111')}'."
            ),
            input_bits="111111",
        ),
        QuizQuestion(
            id="q6",
            difficulty="medium",
            type="destuff_challenge",
            question=f"Destuff the following bitstream: '{stuffed('1011111010')}'",
            choices=[
                QuizChoice(id="a", text="1011111010"),
                QuizChoice(id="b", text="101111010"),
                QuizChoice(id="c", text=destuffed(stuffed("1011111010"))),
                QuizChoice(id="d", text="10111100010"),
            ],
            correct_answer="a" if destuffed(stuffed("1011111010")) == "1011111010" else "c",
            explanation=(
                f"Stuffed: '{stuffed('1011111010')}'. "
                f"After removing the stuffed zero: '{destuffed(stuffed('1011111010'))}'."
            ),
            input_bits=stuffed("1011111010"),
        ),
        # ---- Hard ----
        QuizQuestion(
            id="q7",
            difficulty="hard",
            type="stuff_challenge",
            question="What is the stuffed output for '1111111111' (ten consecutive 1s)?",
            choices=[
                QuizChoice(id="a", text="1111110111110"),
                QuizChoice(id="b", text=stuffed("1111111111")),
                QuizChoice(id="c", text="11111011111"),
                QuizChoice(id="d", text="111111111100"),
            ],
            correct_answer="b",
            explanation=(
                f"Ten 1s produce two groups of five 1s, each followed by a stuffed '0' "
                f"→ '{stuffed('1111111111')}'."
            ),
            input_bits="1111111111",
        ),
        QuizQuestion(
            id="q8",
            difficulty="hard",
            type="multiple_choice",
            question=(
                "After bit stuffing '11111011111', how many stuffed zeros are inserted "
                "and what is the output?"
            ),
            choices=[
                QuizChoice(
                    id="a",
                    text=f"1 zero → '{stuffed('11111011111')}'",
                ),
                QuizChoice(
                    id="b",
                    text=f"2 zeros → '{stuffed('11111011111')}'",
                ),
                QuizChoice(id="c", text="0 zeros → '11111011111'"),
                QuizChoice(id="d", text="3 zeros → '111110011111000'"),
            ],
            correct_answer="b",
            explanation=(
                f"'11111011111' has two separate runs of five 1s. Each gets a stuffed '0' "
                f"→ '{stuffed('11111011111')}' (2 stuffed zeros)."
            ),
            input_bits="11111011111",
        ),
        QuizQuestion(
            id="q9",
            difficulty="hard",
            type="multiple_choice",
            question=(
                "Does bit stuffing guarantee that the receiver can always determine "
                "whether a given bitstream was stuffed or not, without additional "
                "framing information?"
            ),
            choices=[
                QuizChoice(id="a", text="Yes, because the rule is deterministic."),
                QuizChoice(
                    id="b",
                    text=(
                        "No — without framing flags, a bitstream that was never stuffed "
                        "may look identical to a stuffed one."
                    ),
                ),
                QuizChoice(id="c", text="Yes, because stuffed zeros are always at fixed positions."),
                QuizChoice(id="d", text="No — bit stuffing is inherently lossy."),
            ],
            correct_answer="b",
            explanation=(
                "Bit stuffing relies on framing (e.g., HDLC flags) to tell the receiver "
                "where a frame starts and ends. Without that context, an arbitrary bitstream "
                "cannot be unambiguously identified as stuffed or non-stuffed."
            ),
        ),
    ]

    return QuizResponse(questions=questions)
