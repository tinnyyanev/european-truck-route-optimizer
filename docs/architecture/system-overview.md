# System Architecture Overview

## Goal

Build a modular platform for planning and comparing heavy goods vehicle routes across Europe.

## Main components

### Web application

Provides the user interface for entering origin, destination and truck characteristics, requesting route alternatives and comparing results.

### Backend API

Validates requests, coordinates routing and optimization, calculates estimates and returns structured results.

### Routing adapter

Encapsulates the selected routing provider so that the application can change providers without redesigning the entire backend.

### Route optimization engine

Evaluates candidate routes using configurable objectives such as operating cost, travel time and distance.

### Data layer

PostgreSQL and PostGIS are planned for persistent application data and geospatial operations.

### Infrastructure

Docker will provide a reproducible local environment. GitHub Actions will run automated quality checks. Azure is the target deployment platform.

## Initial request flow

1. The user submits a route request and vehicle profile.
2. The API validates the input.
3. The routing adapter requests candidate routes.
4. The optimization engine evaluates the available candidates.
5. The API returns route alternatives, estimates and data-quality indicators.
6. The frontend displays the results on a map and in a comparison view.

## Restriction data and uncertainty

The system must distinguish between verified restrictions, warnings and unknown information. A routing provider's ordinary car profile must not be assumed to enforce every truck-specific restriction.

Route estimates and restriction coverage must be documented, including data source and freshness where available.

## Initial geographic scope

The first development target is the Spain–France–Germany corridor. Wider European coverage is a later milestone.

## Architectural direction

Prefer modular components, explicit interfaces, automated tests and replaceable external providers. Avoid tightly coupling the optimization logic to a single routing engine.
