# Backend README

## Bit Stuffing API

FastAPI backend exposing bit stuffing and destuffing algorithms.

### Setup

```powershell
cd backend
pip install -r requirements.txt
```

### Run

```powershell
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

API docs available at: http://127.0.0.1:8000/docs

### Test

```powershell
python -m pytest tests/ -v
```
