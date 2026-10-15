import os
from pathlib import Path
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, model_validator


# Load services/api/.env regardless of the working directory.
API_DIR = Path(__file__).resolve().parents[1]
load_dotenv(API_DIR / ".env")

ORS_API_KEY = os.getenv("OPENROUTESERVICE_API_KEY")
ORS_BASE_URL = "https://api.openrouteservice.org"

app = FastAPI(
    title="European Truck Route Optimizer API",
    description=(
        "API for planning and comparing truck routes across Europe. "
        "Route calculations use an external routing provider."
    ),
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Location(BaseModel):
    city: str = Field(min_length=1, max_length=100)
    country: str = Field(min_length=1, max_length=100)


class TruckConfiguration(BaseModel):
    vehicle_type: Literal["standard", "refrigerated", "heavy"]
    weight_tonnes: float = Field(gt=0, le=60)
    height_metres: float = Field(gt=0, le=4.5)
    length_metres: float = Field(gt=0, le=25)

    @model_validator(mode="after")
    def validate_standard_truck_weight(self):
        if self.vehicle_type == "standard" and self.weight_tonnes > 40:
            raise ValueError(
                "Standard trucks cannot exceed 40 tonnes in this configuration."
            )
        return self


class RoutePlanningRequest(BaseModel):
    origin: Location
    destination: Location
    truck: TruckConfiguration


async def geocode_location(
    client: httpx.AsyncClient,
    location: Location,
) -> list[float]:
    """Return [longitude, latitude] for a city and country."""

    response = await client.get(
        f"{ORS_BASE_URL}/geocode/search",
        params={
            "api_key": ORS_API_KEY,
            "text": f"{location.city}, {location.country}",
            "size": 1,
        },
        headers={"Accept": "application/json"},
    )

    if response.is_error:
        raise HTTPException(
            status_code=502,
            detail="The geocoding provider could not resolve a location.",
        )

    try:
        features = response.json().get("features", [])
        if not features:
            raise HTTPException(
                status_code=422,
                detail=(
                    f"Could not find coordinates for "
                    f"{location.city}, {location.country}."
                ),
            )

        coordinates = features[0]["geometry"]["coordinates"]
        longitude, latitude = coordinates[0], coordinates[1]

        return [longitude, latitude]

    except (KeyError, IndexError, TypeError, ValueError):
        raise HTTPException(
            status_code=502,
            detail="The geocoding provider returned an invalid response.",
        )


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/routes/plan")
async def plan_route(request: RoutePlanningRequest):
    if not ORS_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "Routing is not configured. Set "
                "OPENROUTESERVICE_API_KEY in services/api/.env."
            ),
        )

    timeout = httpx.Timeout(30.0, connect=10.0)

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            origin_coordinates = await geocode_location(
                client, request.origin
            )
            destination_coordinates = await geocode_location(
                client, request.destination
            )

            route_response = await client.post(
                f"{ORS_BASE_URL}/v2/directions/driving-hgv/geojson",
                headers={
                    "Authorization": ORS_API_KEY,
                    "Content-Type": "application/json",
                    "Accept": "application/geo+json, application/json",
                },
                json={
                    "coordinates": [
                        origin_coordinates,
                        destination_coordinates,
                    ],
                    "instructions": False,
                    "units": "km",
                    "options": {
                        "vehicle_type": "hgv",
                        "profile_params": {
                            "restrictions": {
                                "weight": request.truck.weight_tonnes,
                                "height": request.truck.height_metres,
                                "length": request.truck.length_metres,
                            }
                        },
                    },
                },
            )

            if route_response.is_error:
                # Do not expose the provider response or API key to clients.
                raise HTTPException(
                    status_code=502,
                    detail=(
                        "The routing provider could not calculate this route. "
                        "Check the vehicle parameters or try again later."
                    ),
                )

            data = route_response.json()

    except HTTPException:
        raise
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="The routing provider took too long to respond.",
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=502,
            detail="Could not connect to the routing provider.",
        )
    except ValueError:
        raise HTTPException(
            status_code=502,
            detail="The routing provider returned an invalid response.",
        )

    try:
        features = data.get("features", [])
        if not features:
            raise HTTPException(
                status_code=422,
                detail="No route was found for the requested locations.",
            )

        feature = features[0]
        summary = feature["properties"]["summary"]
        geometry = feature["geometry"]

        return {
            "status": "success",
            "calculation_status": "calculated",
            "provider": "openrouteservice",
            "route": {
                "distance_km": summary["distance"],
                "duration_seconds": summary["duration"],
                "geometry": geometry,
            },
            "request": request.model_dump(),
            "warnings": [
                (
                    "This route is an estimate. Verify local restrictions, "
                    "signage, permits, and truck-specific legal requirements "
                    "before travelling."
                )
            ],
        }

    except HTTPException:
        raise
    except (KeyError, IndexError, TypeError, ValueError):
        raise HTTPException(
            status_code=502,
            detail="The routing provider returned an unexpected route format.",
        )
