# Microsoft Azure Infrastructure

## Purpose

This directory will contain infrastructure configuration and deployment resources for hosting European Truck Route Optimizer on Microsoft Azure.

## Potential Components

- Azure Container Apps or an alternative container hosting service.
- Azure Database for PostgreSQL.
- Azure Key Vault for secret management.
- Azure Monitor and Application Insights.
- Azure Container Registry.
- Infrastructure as Code using Bicep or Terraform.

## Security Principles

- Apply least-privilege access.
- Prefer managed identities where supported.
- Store secrets in an appropriate secret-management service.
- Separate development and production environments.
- Avoid committing credentials or sensitive infrastructure state.

## Development Status

**Status:** Planned.

Cloud services and deployment architecture will be selected after the local prototype is working.
