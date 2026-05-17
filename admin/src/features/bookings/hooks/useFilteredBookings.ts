import { Booking, Filters } from "../booking.types";

export function useFilteredBookings(booking: Booking[], filters: Filters) {
    return booking.filter((b) => {
        if (filters.date && b.startTime.split("T")[0] !== filters.date) return false;
        if (filters.status && b.status !== filters.status) return false;
        if (filters.staffId && b.staffId !== filters.staffId) return false;
        return true;
    });
}