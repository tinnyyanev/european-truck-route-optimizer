# European Truck Route Optimizer — Web

Frontend application for the European Truck Route Optimizer project.

The web application will allow users to plan and compare heavy-truck routes across Europe, starting with routes through Spain, France and Germany.

## Technology stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- MapLibre GL JS (planned)

## Requirements

- Node.js LTS
- npm

## Local development

From the repository root, navigate to the web application:

```bash
cd apps/web
```

Install dependencies if they are not already installed:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

- `npm run dev`: start the development server.
- `npm run build`: build the application for production.
- `npm run start`: start the production server after building.
- `npm run lint`: run the configured lint checks, if available.

Check `package.json` for the exact scripts supported by the installed Next.js version.

## Backend integration

The backend API is implemented with FastAPI in `services/api/`.

During local development, the API is expected to run at:

`http://127.0.0.1:8000`

Frontend-to-backend communication will be implemented in a later stage.

## Current scope

The initial frontend setup provides the Next.js application and development environment.

Route planning forms, interactive maps, vehicle configuration, route comparison and API integration will be implemented incrementally.

## Development principles

- Keep frontend and backend responsibilities separate.
- Use TypeScript for application code.
- Keep configuration and secrets out of source control.
- Test changes before committing them.
- Do not present estimated routes, tolls or vehicle restrictions as verified data unless their sources support those claims.