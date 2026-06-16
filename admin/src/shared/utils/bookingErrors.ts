export function getBookingErrorMessage(error: string, bookAheadDays?: number): string {
    const messages: Record<string, string> = {
        STAFF_INACTIVE: "This staff member is currently unavailable to take any bookings",
        NO_SHIFT: "This staff member is off shift on the date selected, please choose another date or staff member",
        NO_SLOTS: "There are no available slots on this date, please choose another date or staff member",
        PAST_DATE: "You selected a date in the past, please choose a future date",
        OUT_OF_RANGE: `Bookings can only be made up to ${bookAheadDays ?? 30} days in advance, please choose an earlier date`,
        INVALID_REQUEST: "An unknown error occurred, please try again or contact your system administrator",
        SERVICE_INACTIVE: "The selected service is currently unavailable, please choose another service",
        SLOT_TAKEN: "This staff member already has a booking at this time. Please cancel this booking and create a new one"
    }
    return messages[error] ?? "Something went wrong, please try again"
}