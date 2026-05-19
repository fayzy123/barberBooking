#  Barber Booking System

A full-stack barber shop booking and admin management system.

## What it does

This is a booking platform for a barber shop. It consists of an admin panel that allows the shop owner to manage bookings, staff and shop settings from a centralised dashboard.

**Admin Panel features:**
- Secure login with JWT authentication
- Bookings dashboard with live stats (today's bookings, confirmed, cancelled, next appointment)
- Filter bookings by date, staff member and status
- View and manage individual bookings
- Create new bookings
- Reassign bookings to different staff members
- Cancel bookings with optional cancellation reason
- Front-end and server-side form validation

## Tech Stack

**Frontend:** React 19, TypeScript, React Router v6, CSS Modules, Zod  
**Backend:** Node.js, Express, TypeScript, Prisma ORM  
**Database:** PostgreSQL (Neon)  
**Auth:** JWT, bcryptjs  
**Deployment:** Vercel (frontend), Render (backend)  
**CI/CD:** GitHub Actions  

## More features coming soon

- Staff management — add, update and manage staff availability
- Shop settings — update shop details and manage services
- Double booking prevention based on staff availability
- Public booking page for customers
- Auto logout on session expiry
- Improved create booking flow with availability-based time slots

## Status

Active development — Phase 3 (Admin Bookings) complete. Phase 4 (Staff Management) in progress.

## Running locally

Clone the repo and run `npm install` from the root. Create a `.env` file inside the `server/` folder using `.env.example` as a reference — you'll need a PostgreSQL connection string, a JWT secret, and an admin seed password. Then `cd server`, run `npx prisma migrate deploy` to set up the database schema, followed by `npx prisma db seed` to populate it with seed data. Start the API with `npm run dev` from the `server/` folder (runs on port 3002), then open a new terminal, `cd admin` and run `npm run dev` to start the admin panel (runs on port 5173). Log in with the email and password you set in your `.env`.
```
