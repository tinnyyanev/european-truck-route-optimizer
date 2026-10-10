from fastapi import FastAPI

app = FastAPI(
    title="European Truck Route Optimizer API",
    description=(
        "API for planning and comparing heavy-truck routes "
        "across Europe."
    ),
    version="0.1.0",
)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Return the health status of the API."""
    return {"status": "ok"}