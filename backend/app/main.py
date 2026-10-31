"""
FastAPI application: exposes the bit stuffing / destuffing API.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.schemas import (
    StuffRequest,
    StuffResponse,
    DestuffRequest,
    DestuffResponse,
    ExamplesResponse,
    QuizResponse,
    HealthResponse,
    ErrorResponse,
)
from app.services import (
    perform_stuff,
    perform_destuff,
    get_examples,
    get_quiz,
)

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Bit Stuffing API",
    description=(
        "REST API for the 'Implementation of Bit Stuffing Using Python "
        "and Full-Stack Web Development' project. Exposes bit stuffing, "
        "bit destuffing, worked examples, and quiz endpoints."
    ),
    version="1.0.0",
)

# CORS — allow the local Vite dev server (and any localhost port)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/api/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Return a simple health-check response confirming the API is running."""
    return HealthResponse(
        status="ok",
        message="Bit Stuffing API is running.",
    )


@app.post(
    "/api/stuff",
    response_model=StuffResponse,
    responses={422: {"model": ErrorResponse}},
    tags=["algorithm"],
)
async def stuff_bits(request: StuffRequest):
    """
    Perform bit stuffing on the provided binary string.

    Rule: after every 5 consecutive 1s, insert a stuffed '0'.
    Returns the stuffed bitstream, statistics, and step-by-step records.
    """
    try:
        return perform_stuff(request.bits)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@app.post(
    "/api/destuff",
    response_model=DestuffResponse,
    responses={422: {"model": ErrorResponse}},
    tags=["algorithm"],
)
async def destuff_bits(request: DestuffRequest):
    """
    Perform bit destuffing on the provided stuffed binary string.

    Rule: when 5 consecutive 1s have been encountered, the immediately
    following '0' is the stuffed zero and is removed.
    Returns the destuffed bitstream, statistics, and step-by-step records.
    """
    try:
        return perform_destuff(request.bits)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))


@app.get(
    "/api/examples",
    response_model=ExamplesResponse,
    tags=["reference"],
)
async def examples():
    """
    Return a curated collection of example inputs and their expected stuffed
    outputs, computed dynamically by the Python algorithm.
    """
    return get_examples()


@app.get(
    "/api/quiz",
    response_model=QuizResponse,
    tags=["quiz"],
)
async def quiz():
    """
    Return quiz questions for the practice section.
    Correct answers for stuffing/destuffing challenges are validated against
    the real algorithm.
    """
    return get_quiz()
