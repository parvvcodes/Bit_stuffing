# Implementation of Bit Stuffing Using Python and Full-Stack Web Development

> **College Computer Networks Project** — Interactive full-stack application demonstrating
> bit stuffing and bit destuffing algorithms.

---

## 1. Project Overview

This project implements an interactive educational web application that demonstrates **bit stuffing**
and **bit destuffing** — fundamental techniques used in bit-oriented data link layer protocols such
as HDLC (High-level Data Link Control). The actual algorithms run in Python on a FastAPI backend
and are exposed through REST APIs consumed by a React + Vite frontend.

---

## 2. Problem Statement

In HDLC and similar protocols, frames are delimited by the flag `01111110`. If this pattern appears
in the payload, the receiver incorrectly interprets it as a frame boundary. Bit stuffing prevents this
by inserting a `0` after every five consecutive `1` bits in the payload data. The receiver performs
bit destuffing to recover the original data.

---

## 3. Project Objectives

1. Implement the standard bit stuffing and bit destuffing algorithms in Python.
2. Expose the algorithms through REST API endpoints using FastAPI.
3. Build an interactive React frontend that consumes the real API.
4. Provide step-by-step algorithm visualization driven by backend execution data.
5. Include an educational learning section and practice quiz.
6. Write automated tests verifying correctness.

---

## 4. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend UI | React | 19.x |
| Build tool | Vite | 6.x |
| CSS | Tailwind CSS | 4.x |
| Routing | React Router | 7.x |
| Icons | Lucide React | latest |
| Backend | FastAPI | 0.115.x |
| Language | Python | 3.13 |
| Validation | Pydantic | 2.x |
| ASGI server | Uvicorn | 0.32.x |
| Testing | Pytest | 8.x |

---

## 5. Features

- **Interactive Playground** — enter any binary string, stuff or destuff via real Python API
- **Step-by-Step Visualizer** — walk through algorithm execution step by step
- **Bit Cell Visualization** — color-coded cells for original, stuffed, and removed bits
- **Statistics** — original/output length, stuffed-zero count, overhead percentage
- **Learn Section** — 9-topic educational guide with worked examples and tables
- **Practice Quiz** — multiple-choice and challenge questions with backend-validated answers
- **67 Automated Tests** — algorithms, validation, and all API endpoints

---

## 6. Algorithm

### Bit Stuffing Rule
After every **5 consecutive `1` bits** in the payload, insert a `0`.  
Reset the counter after inserting the stuffed zero.

| Input | Output | Zeros Inserted |
|-------|--------|---------------|
| `11111` | `111110` | 1 |
| `111111` | `1111101` | 1 |
| `1111111111` | `111110111110` | 2 |
| `1011111010` | `10111110010` | 1 |
| `101010` | `101010` | 0 |

### Bit Destuffing Rule
When **5 consecutive `1` bits** have been seen, the immediately following `0` is the stuffed zero → discard it.

---

## 7. System Architecture

```
React Frontend (port 5173)
        ↓  HTTP POST /api/stuff  |  /api/destuff
FastAPI Backend (port 8000)
        ↓  Pydantic validation
Python Algorithms (algorithms.py)
        ↓  JSON response with steps
React — renders bit cells + step visualizer
```

---

## 8. Folder Structure

```
Cn project/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js          # Fetch-based API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── BitDisplay.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Playground.jsx
│   │   │   ├── Visualizer.jsx
│   │   │   ├── Learn.jsx
│   │   │   ├── Practice.jsx
│   │   │   └── About.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI routes
│   │   ├── algorithms.py          # Core bit stuffing logic
│   │   ├── schemas.py             # Pydantic models
│   │   └── services.py            # Service layer
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_stuffing.py
│   │   └── test_destuffing.py
│   ├── requirements.txt
│   └── README.md
├── .gitignore
└── README.md
```

---

## 9. Prerequisites

- **Python 3.10+** (tested on 3.13.7)
- **Node.js 18+** (tested on 24.14.1) + npm
- PowerShell (Windows)

---

## 10. Installation & Setup (Windows PowerShell)

### Step 1 — Clone or open the project

```powershell
cd "C:\Users\<YourName>\OneDrive\Desktop\Cn project"
```

### Step 2 — Backend setup

```powershell
cd backend
pip install -r requirements.txt
```

### Step 3 — Frontend setup

```powershell
cd ..\frontend
npm install
```

### Step 4 — Copy environment file (optional)

```powershell
Copy-Item .env.example .env
```

---

## 11. Running the Application

Open **two PowerShell terminals**.

**Terminal 1 — Backend:**
```powershell
cd "C:\Users\<YourName>\OneDrive\Desktop\Cn project\backend"
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Terminal 2 — Frontend:**
```powershell
cd "C:\Users\<YourName>\OneDrive\Desktop\Cn project\frontend"
npm run dev
```

Then open **http://localhost:5173** in your browser.

API documentation: **http://127.0.0.1:8000/docs**

---

## 12. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/stuff` | Bit stuffing |
| POST | `/api/destuff` | Bit destuffing |
| GET | `/api/examples` | Curated examples |
| GET | `/api/quiz` | Quiz questions |

### POST /api/stuff

Request:
```json
{ "bits": "111111" }
```

Response:
```json
{
  "original_bits": "111111",
  "stuffed_bits": "1111101",
  "original_length": 6,
  "stuffed_length": 7,
  "stuffed_zero_count": 1,
  "overhead_percentage": 16.67,
  "steps": [ ... ]
}
```

### POST /api/destuff

Request:
```json
{ "bits": "1111101" }
```

Response:
```json
{
  "stuffed_bits": "1111101",
  "destuffed_bits": "111111",
  "stuffed_length": 7,
  "destuffed_length": 6,
  "removed_zero_count": 1,
  "steps": [ ... ]
}
```

---

## 13. Running Tests

```powershell
cd "C:\Users\<YourName>\OneDrive\Desktop\Cn project\backend"
python -m pytest tests/ -v
```

Expected result: **67 passed**

---

## 14. Known Limitations

- No user authentication or persistent storage.
- The visualizer animation speed is fixed at 600 ms/step.
- HDLC frame flags are not automatically added to payloads.

## 15. Future Enhancements

- Full HDLC frame encoder/decoder mode.
- Adjustable animation playback speed.
- CRC/FCS calculation.
- Downloadable session PDF report.
- CAN bus / USB bit-stuffing variants.
