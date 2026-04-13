# Barber Booking System

A full-stack booking platform for barber shops.
Admin dashboard + customer booking website.

## Tech Stack

- **Frontend (Admin)**: React 19, TypeScript, Vite
- **Frontend (Public)**: React 19, TypeScript, Vite
- **Backend**: Node.js, Express, PostgreSQL
- **Database**: PostgreSQL (managed with Postico)

## Project Structure

barber-booking-system/
├── admin/ # Admin dashboard
├── public/ # Customer booking website
├── server/ # REST API backend
└── package.json # Root workspace config

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm 9+

### Installation

1. Clone the repo
2. Install dependencies:

```bash
   npm install
```

3. Create `.env` file (copy from `.env.example`):

```bash
   cp .env.example .env
```

4. Update `.env` with your database credentials

### Running Development

Start all three apps:

```bash
npm run dev
```

This starts:

- Admin: http://localhost:3000
- Public: http://localhost:3001
- Server API: http://localhost:3002

### Database

Managed with Postico. Schema: `server/src/db/schema.sql`

## Version

- **V1**: Simple booking form (no customer panel)
- **V2+**: Add customer profile & authentication
