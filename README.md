# European Truck Route Optimizer

An open-source European truck route optimization platform focused on cost, travel time, distance and vehicle restrictions.

## Overview

European Truck Route Optimizer aims to help transport operators plan and compare routes for heavy goods vehicles across Europe.

The project will initially focus on the Spain–France–Germany corridor and will progressively expand its capabilities.

## Planned features

- Truck profile configuration, including dimensions, weight and axle count.
- Route planning between European locations.
- Comparison of alternative routes by distance, estimated travel time and operating cost.
- Fuel consumption and toll cost estimation when reliable data is available.
- Visualization of routes and relevant restrictions on an interactive map.
- Explicit distinction between confirmed restrictions, warnings and unknown information.
- Automated testing and continuous integration.
- Secure, containerized deployment with Azure as the target cloud platform.

## Technology stack

| Component | Planned technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Maps | MapLibre GL JS |
| Backend API | Python, FastAPI, Pydantic |
| Optimization | Google OR-Tools |
| Routing | Pluggable routing engine |
| Database | PostgreSQL, PostGIS |
| Testing | Pytest, frontend testing tools |
| CI/CD | GitHub Actions |
| Cloud | Microsoft Azure |

The stack and integrations may evolve during development.

## Project status

**Status:** Early development.

The current stage focuses on architecture, repository structure, requirements and development foundations. Production-ready truck routing and verified restriction data are not yet available.

## Design principles

- Safety and transparency over unsupported assumptions.
- Modular architecture and replaceable routing providers.
- Reproducible tests and documented decisions.
- Secure defaults and minimal exposure of sensitive data.
- Open-source development with clear contribution guidelines.

## Important limitations

Route results will depend on the routing engine, map data and available truck restriction information. An estimated route must not be treated as proof of legal compliance for a specific vehicle.

Unknown or unverified restrictions must be identified explicitly.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development and contribution guidelines.

## Security

Please see [SECURITY.md](SECURITY.md) for instructions on reporting security vulnerabilities.

## License

This project is intended to be released under the MIT License. See [LICENSE](LICENSE) for the applicable terms.
