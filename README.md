# Invoice Builder Monorepo

This project is a monorepo containing a Next.js frontend application (`apps/client`) and an Express.js backend API (`apps/server`). It uses pnpm as the package manager.

## Table of Contents

-   [Project Structure](#project-structure)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Database Setup](#database-setup)
-   [Running the Applications](#running-the-applications)
    -   [Frontend](#frontend)
    -   [Backend](#backend)
    -   [Both (Monorepo)](#both-monorepo)
-   [Linting and Type Checking](#linting-and-type-checking)
-   [API Endpoints](#api-endpoints)
-   [Backend Module Architecture](#backend-module-architecture)

## Project Structure

```
.env.example
.gitignore
package.json
pnpm-workspace.yaml
README.md
apps/
├── client/             # Next.js Frontend Application
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── config/
│   │   └── lib/
│   ├── .eslintrc.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── server/             # Express.js Backend API
    ├── prisma/         # Prisma schema and migrations
    ├── src/
    │   ├── config/
    │   ├── database/
    │   ├── middlewares/
    │   ├── modules/    # Modular business logic (e.g., auth, users)
    │   ├── routes/
    │   └── utils/
    ├── .eslintrc.json
    ├── package.json
    ├── tsconfig.json
    └── .env.example
```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
-   [pnpm](https://pnpm.io/installation) (v8 or higher)
-   [PostgreSQL](https://www.postgresql.org/download/) (for the backend database)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd invoice-builder-monorepo
    ```

2.  **Install dependencies:**

    Navigate to the root of the monorepo and run:

    ```bash
    pnpm install
    ```

    This will install dependencies for both the client and server applications.

### Environment Variables

Create a `.env` file in the root of the project (or separate `.env` files in `apps/client` and `apps/server` if preferred, but root is simpler for shared variables) and copy the contents of `.env.example` into it. Fill in the required values.

**Root `.env` example:**

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Backend
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/invoicedb?schema=public"
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

1.  **Create a PostgreSQL database:**

    Ensure your PostgreSQL server is running. Create a new database, for example, `invoicedb`.

    ```sql
    CREATE DATABASE invoicedb;
    ```

2.  **Update `DATABASE_URL`:**

    Make sure the `DATABASE_URL` in your `.env` file points to your PostgreSQL database.

3.  **Run Prisma migrations:**

    Navigate to the root of the monorepo and run the migration command. This will create the necessary tables in your database based on `apps/server/prisma/schema.prisma`.

    ```bash
    pnpm db:migrate:dev
    ```

    If you only want to push the schema without creating migrations (e.g., for a fresh dev database), use:

    ```bash
    pnpm db:push
    ```

4.  **Open Prisma Studio (optional):**

    To view and manage your database data, you can use Prisma Studio:

    ```bash
    pnpm db:studio
    ```

## Running the Applications

### Frontend

To run the Next.js frontend application independently:

```bash
cd apps/client
pnpm dev
# Or from root:
pnpm --filter client dev
```

The frontend will typically run on `http://localhost:3000`.

### Backend

To run the Express.js backend API independently:

```bash
cd apps/server
pnpm dev
# Or from root:
pnpm --filter server dev
```

The backend will typically run on `http://localhost:5000`.

### Both (Monorepo)

To run both applications concurrently from the monorepo root:

```bash
pnpm dev
```

## Linting and Type Checking

-   **Run linting for all applications:**

    ```bash
    pnpm lint
    ```

-   **Run type checking for all applications:**

    ```bash
    pnpm tsc
    ```

## API Endpoints

-   **Health Check:**
    -   `GET /api/health` - Returns `200 OK` if the backend is running.

## Backend Module Architecture

The backend (`apps/server/src/modules`) follows a modular architecture to organize business logic. Each module (e.g., `auth`, `users`, `invoices`) typically contains:

-   `*.controller.ts`: Handles incoming requests, calls the service layer, and sends responses.
-   `*.service.ts`: Contains the core business logic, orchestrating data access and transformations.
-   `*.repository.ts`: Interacts directly with the database (using Prisma) to perform CRUD operations.
-   `*.validation.ts`: Defines Zod schemas for request payload validation.
-   `*.types.ts`: Defines TypeScript interfaces and types specific to the module.
-   `*.routes.ts`: Defines and registers the API routes for the module.

This structure ensures a clear separation of concerns and maintainability.
