# Data Dictionary (V1)

---

# Shop

## Purpose

Stores shop-level configuration and operational defaults. Designed to support future multi-branch expansion.

## Fields

- `id` (int, PK)
- `name` (varchar, required)
- `openTime` (time, required) — Daily opening time in `timezone`
- `closeTime` (time, required) — Daily closing time in `timezone`
- `timezone` (varchar, required) — IANA timezone identifier
- `slotIntervalMins` (int, required) — Slot generation granularity
- `bookingLeadTimeMins` (int, required) — Earliest bookable start = now + lead time
- `maxDaysAhead` (int, required) — Latest bookable date = today + N days
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

## Defaults (V1)

- `timezone`: Europe/London
- `slotIntervalMins`: 15
- `bookingLeadTimeMins`: 60
- `maxDaysAhead`: 30
- `openTime`: 09:00
- `closeTime`: 21:00

## Rules / Notes

- `closeTime` must be later than `openTime` (same-day window for V1).
- All booking-time calculations use `timezone`.
- All datetime values are interpreted relative to `timezone`.

---

# Staff

## Purpose

Represents barbers working at a shop.

## Fields

- `id` (int, PK)
- `shopID` (int, FK → shop.id, required)
- `firstName` (varchar, required)
- `lastName` (varchar, required)
- `isActive` (boolean, required) — Inactive staff cannot receive new bookings
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

## Rules / Notes

- Each staff member belongs to exactly one shop in V1.
- Setting `isActive = false` prevents new bookings but does not affect existing bookings.

---

# Service

## Purpose

Represents bookable services and their durations.

## Fields

- `id` (int, PK)
- `shopID` (int, FK → shop.id, required)
- `name` (varchar, required)
- `durationMins` (int, required)
- `isActive` (boolean, required)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

## Rules / Notes

- Service duration determines booking length at creation time.
- Changing `durationMins` does not modify historical bookings.
- Setting `isActive = false` prevents new bookings but does not affect existing bookings.

---

# StaffAvailabilityInterval

## Purpose

Defines recurring weekly working intervals per staff member. Supports split shifts and lunch breaks.

## Fields

- `id` (int, PK)
- `staffID` (int, FK → staff.id, required)
- `dayOfWeek` (smallint, required) — 1 = Monday … 7 = Sunday
- `startTime` (time, required)
- `endTime` (time, required)
- `isActive` (boolean, required)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

## Rules / Notes

- Multiple intervals are allowed per staff per day (split shifts).
- Lunch breaks are represented as gaps between intervals.
- `startTime` must be earlier than `endTime`.
- Intervals for the same staff and day should not overlap (enforced at application/DB level later).

---

# Booking

## Purpose

Stores customer bookings. Bookings are never deleted; cancellation is handled via status.

## Fields

- `id` (int, PK)
- `shopID` (int, FK → shop.id, required)
- `staffID` (int, FK → staff.id, required)
- `serviceID` (int, FK → service.id, required)
- `startAt` (datetime, required) — Stored as timestamp; interpreted in `shop.timezone`
- `endAt` (datetime, required) — Stored as timestamp; interpreted in `shop.timezone`
- `customerName` (varchar, required)
- `customerPhone` (varchar, required) — UK phone number stored as string
- `status` (varchar, required) — Allowed values: `BOOKED`, `CANCELLED`
- `bookingRef` (varchar, required, unique) — 8-character uppercase alphanumeric, generated server-side
- `cancelledAt` (datetime, nullable)
- `cancelReason` (varchar, nullable)
- `createdAt` (datetime, required)
- `updatedAt` (datetime, required)

## Rules / Notes

- Allowed status transition (V1): `BOOKED → CANCELLED` only.
- `cancelledAt` and `cancelReason` must only be set when `status = CANCELLED`.
- No overlapping active (`BOOKED`) bookings per staff (enforced later).
- Existing bookings remain valid even if associated staff or service becomes inactive.
- `endAt` is calculated at booking creation using `service.durationMins` and does not change if the service duration changes later.
