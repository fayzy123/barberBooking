# Admin Panel Behaviour Rules

## Booking Status

- Statuses: BOOKED, CANCELLED
- Admin can cancel a booking at any time
- Cancel button is disabled only when booking status is CANCELLED
- Reassign is allowed only when booking status is BOOKED
- Reassign is disabled when booking status is CANCELLED

## Date Handling

- Date filter is required on bookings list
- “Today” is based on Europe/London local date
- Dates/times are displayed in Europe/London timezone
- Admin can browse historic and future bookings

## List Behaviour

- Filtering is server-side
- Filters: date required, staff optional, status optional
- Default sort: startTime ascending
- Pagination is required
- If no bookings match filters, show: “No bookings found”

## Error Behaviour

- 401: redirect to login and show session/auth error
- 404 booking: show “Booking not found”
- Double cancel: show “Booking already cancelled”
- Invalid staff reassignment: show user-friendly error
