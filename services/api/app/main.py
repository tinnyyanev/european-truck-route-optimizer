from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator


app = FastAPI(
    title="European Truck Route Optimizer API",
    description=(
        "API for planning and comparing heavy-truck routes "
        "across Europe."
    ),
    version="0.2.0",
)


# Development configuration.
# Restrict these origins further before deploying to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class Location(BaseModel):
    city: str = Field(min_length=2, max_length=100)
    country: str = Field(min_length=2, max_length=100)


class TruckConfiguration(BaseModel):
    vehicle_type: Literal[
        "standard",
        "refrigerated",
        "heavy",
    ] = "standard"

    weight_tonnes: float = Field(gt=0, le=60)
    height_metres: float = Field(gt=0, le=4.5)
    length_metres: float = Field(gt=0, le=25)

    @model_validator(mode="after")
    def validate_vehicle_dimensions(self):
        if (
            self.vehicle_type == "standard"
            and self.weight_tonnes > 40
        ):
            raise ValueError(
                "A standard truck cannot exceed 40 tonnes "
                "in this initial configuration."
            )

        return self


class RoutePlanningRequest(BaseModel):
    origin: Location
    destination: Location
    truck: TruckConfiguration


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Return the health status of the API."""
    return {"status": "ok"}


@app.post("/api/routes/plan", tags=["Routes"])
def plan_route(request: RoutePlanningRequest) -> dict:
    """Validate a route request without calculating a real route."""

    return {
        "status": "accepted",
        "calculation_status": "not_implemented",
        "message": (
            "The request has been validated. "
            "A real routing engine is not connected yet."
        ),
        "request": request.model_dump(),
        "route": None,
    }