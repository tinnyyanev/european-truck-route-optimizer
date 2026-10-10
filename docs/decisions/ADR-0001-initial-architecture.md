# ADR-0001: Initial Architecture and Technology Stack

- **Status:** Proposed
- **Date:** 2026-10-10

## Context

The project requires a maintainable platform combining a web interface, an API, route optimization, geospatial data and cloud infrastructure.

## Decision

The initial proposed stack is:

- Next.js, React and TypeScript for the web application.
- Python, FastAPI and Pydantic for the backend.
- Google OR-Tools for optimization experiments.
- A routing-provider adapter to isolate external routing engines.
- PostgreSQL and PostGIS for persistent and geospatial data.
- Docker and GitHub Actions for reproducible development and automated checks.
- Microsoft Azure as the target cloud platform.

## Alternatives considered

- A single-language TypeScript backend.
- A monolithic application without a separate optimization package.
- A routing implementation tightly coupled to one provider.

## Consequences

The proposed architecture separates user experience, API responsibilities and optimization logic.

It introduces multiple tools and languages, so automated checks and clear development documentation will be important.

The routing provider and truck restriction data source remain open decisions. No provider is assumed to offer complete, verified European truck restrictions.

## Review criteria

Revisit this decision after the first working route-planning prototype and an evaluation of routing-provider capabilities, licensing, costs and data quality.
