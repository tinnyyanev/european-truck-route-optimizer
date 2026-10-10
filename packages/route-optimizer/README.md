# Route Optimization Engine

## Purpose

This package will contain the core logic for evaluating and comparing candidate routes for heavy goods vehicles.

## Planned Capabilities

- Compare routes by distance and estimated travel time.
- Estimate operating costs using configurable assumptions.
- Support configurable optimization objectives.
- Account for vehicle characteristics when supported by the routing and restriction data.
- Provide transparent explanations of route scores and limitations.

## Planned Technology

- Python
- Google OR-Tools, subject to evaluation of the optimization requirements.

## Design Principles

The optimization logic should remain independent of the web interface and external routing providers.

Unknown or unverified restrictions must never be treated as confirmed safe or legally compliant.

## Development Status

**Status:** Planned.
