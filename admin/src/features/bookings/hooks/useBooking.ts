import { useFetch } from "../../../shared/hooks/useFetch";
import { Booking } from "../booking.types";

export function useBookings() {
    const { data, loading, error, refetch } = useFetch<Booking[]>('/bookings', 'Failed to fetch bookings')
    return { bookings: data ?? [], loading, error, refetch }
}