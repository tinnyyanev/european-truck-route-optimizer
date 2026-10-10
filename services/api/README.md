# European Truck Route Optimizer — API

Backend service for the European Truck Route Optimizer project.

The API will provide endpoints for planning, evaluating and comparing heavy-truck routes across Europe.

## Technology stack

- Python
- FastAPI
- Uvicorn
- Pytest

## Requirements

- Python 3.11 or newer
- pip

## Local setup

From the repository root, create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Activate it on macOS or Linux:

```bash
source .venv/bin/activate
```

Install the API dependencies:

```bash
python -m pip install -r services/api/requirements.txt
```

## Run the API

From the repository root:

```bash
python -m uvicorn app.main:app --app-dir services/api --reload
```

The API will be available at `http://127.0.0.1:8000`.

## API documentation

- Interactive documentation: `http://127.0.0.1:8000/docs`
- OpenAPI schema: `http://127.0.0.1:8000/openapi.json`

## Health check

Send a GET request to `/health`.

Expected response:

```json
{
  "status": "ok"
}
```

## Run tests

From the repository root:

```bash
python -m pytest services/api/tests -q
```

## Current scope

The initial implementation provides a health endpoint and an automated test. Route planning, vehicle restrictions, cost estimation and routing-provider integrations will be implemented in subsequent stages.