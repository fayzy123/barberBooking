# Barber Booking System

A full-stack barber shop booking and admin management system.

## What it does

A booking platform for a barber shop, consisting of an admin panel that allows the shop owner to manage bookings, staff and shop settings from a centralised dashboard.

## Admin Panel Features

**Bookings**
- Bookings dashboard with live stats (today's bookings, confirmed, cancelled, next appointment)
- Filter bookings by date, staff member and status
- Paginated bookings table
- View and manage individual bookings
- Create new bookings via a 4-step wizard with availability-based time slots
- Reassign bookings to different staff members
- Cancel bookings with optional cancellation reason
- Full field editing on existing bookings

**Staff Management**
- Add, update and deactivate staff members
- Manage weekly shift schedules with configurable start, end and break times
- Flexible break durations (15–60 minutes)
- Staff deletion with active booking protection

**Shop Settings**
- Update shop name, opening hours and booking rules
- Manage services (add, edit, activate/deactivate)
- Configurable slot interval, lead time and book-ahead limit

**System**
- Secure login with JWT authentication and auto logout on session expiry
- Server-side constraint validation (double booking prevention, break time enforcement, shift boundary checks)
- Front-end and server-side form validation
- Loading, error and empty states throughout
- Icons via lucide-react

## Tech Stack

**Frontend:** React 19, TypeScript, React Router v6, CSS Modules, Zod  
**Backend:** Node.js, Express, TypeScript, Prisma ORM  
**Database:** PostgreSQL (Neon)  
**Auth:** JWT, bcryptjs  
**Deployment:** Vercel (frontend), Render (backend)  
**CI/CD:** GitHub Actions  

## Status

Active development — V2 complete. Public-facing booking page coming in V3.

## Running Locally

**Prerequisites:** Node.js, PostgreSQL

1. Clone the repo and install dependencies
```bash
git clone https://github.com/fayzy123/barberBooking.git
cd barberBooking
npm install
```

2. Create a `.env` file inside the `server/` folder with the following values:
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
