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

**Prerequisites:** Node.js, PostgreSQL

1. Clone the repo and install dependencies
```bash
   git clone https://github.com/fayzy123/barberBooking.git
   cd barberBooking
   npm install
```

2. Create a `.env` file inside the `server/` folder using `.env.example` as a reference and fill in your values:

```bash
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=12h
PORT_SERVER=3002
ADMIN_SEED_PASSWORD=your_admin_password
```

3. Run database migrations and seed data
```bash
   cd server
   npx prisma migrate deploy
   npx prisma db seed
```

4. Start the API server
```bash
   npm run dev
```
   Runs on `http://localhost:3002`

5. Open a new terminal and start the admin panel
```bash
   cd admin
   npm run dev
```
   Runs on `http://localhost:5173`

6. Log in with the email and password you set in `ADMIN_SEED_PASSWORD`
