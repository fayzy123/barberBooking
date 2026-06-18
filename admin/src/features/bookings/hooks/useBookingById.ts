import { useFetch } from "../../../shared/hooks/useFetch";
import { Booking } from "../booking.types";

export function useBookingById(id : string) {
    const { data, loading, error, refetch } = useFetch<Booking>(id ? `/bookings/${id}`: '', "Failed to fetch booking")
    return { booking: data, loading, error, refetch }
}