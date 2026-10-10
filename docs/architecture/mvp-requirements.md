# MVP Requirements

## Objective

Deliver a working prototype that compares alternative routes for a configured truck profile.

## Functional requirements

### MVP-01: Truck profile

The user can provide the vehicle characteristics required by the selected routing provider, such as height, width, length, gross weight and axle count.

### MVP-02: Route request

The user can submit an origin and destination.

### MVP-03: Alternative routes

The system can retrieve and compare available route alternatives.

### MVP-04: Cost estimation

The system can estimate operating cost using documented assumptions for distance, fuel consumption and fuel price. Tolls must be marked unavailable or estimated separately when reliable data is missing.

### MVP-05: Route restrictions

The system exposes restriction information when available and labels unknown or unverified information explicitly.

### MVP-06: Results visualization

The frontend displays route alternatives, distance, estimated travel time and available cost estimates.

## Non-functional requirements

- Input validation and structured error responses.
- Automated unit and integration tests.
- Reproducible local development.
- No secrets committed to the repository.
- Clear documentation of data sources and limitations.
- Modular routing-provider integration.

## Initial acceptance criteria

The first prototype should:

1. Accept a valid route request and truck profile.
2. Return at least one route when the selected provider supports the request.
3. Compare alternatives using available metrics.
4. Explain when costs or restrictions cannot be reliably determined.
5. Pass its automated tests.

## Out of scope for the first MVP

- Guaranteed legal compliance across every European country.
- Real-time traffic predictions across all of Europe.
- Complete, verified toll pricing for every vehicle and road.
- Fleet-wide dispatch and multi-vehicle scheduling.
- A production service with a guaranteed availability SLA.
