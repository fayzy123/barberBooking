# Barber Booking System – V1 Brief

## Purpose

Simple appointment booking system for one barbershop.

- Customers book online
- Admin manages bookings and staff
- No customer accounts
- No online payments
- Built to allow future extensions

---

## Tech Stack

- React + TypeScript (frontend)
- Node.js + Express (backend)
- PostgreSQL (relational DB)

---

## Core Entities

### Shop

Single shop (future multi-branch ready)

### Staff

Barbers with active status

### Service

Haircut (expandable later)

### AvailabilityRule

Weekly schedule per staff member

### Booking

- Staff
- Service
- Start / End time
- Customer name + phone
- Status (booked / cancelled)
- Booking reference

---

## Customer Features (V1)

1. Choose service
2. Choose staff
3. Select date
4. Select time
5. Enter name + phone
6. Confirm booking

No online cancellation or editing.

---

## Admin Features (V1)

- View bookings (filter by date/staff)
- Cancel booking
- Reassign booking
- Edit booking details
- Add/edit staff
- Set weekly availability
- Add/edit services

---

## Booking Confirmation (V1)

After a successful booking, customers see a confirmation screen containing:

- Booking reference
- Service, staff, date/time
- Shop details
- Instruction to contact the shop to cancel/amend

No customer portal is included in V1.
Customer details are stored only as needed to operate the booking (e.g., name + phone).

---

## Rules

- No overlapping bookings per staff
- Time slots generated from:
  - Staff availability
  - Service duration
  - Existing bookings
- Bookings are never deleted (status-based)

---

## Not Included

- Customer login
- Online payments
- Holiday exceptions
- Notifications
- Loyalty features

---

## Future Extensions

- Customer self-service
- StaffService mapping
- Availability exceptions
- Payment integration
- Multi-branch support
