import { useEffect, useState } from "react";
import { Booking } from "../booking.types";
import api from "../../../shared/utils/api";

export function useBookingById(id : string) {
    const [booking, setBookings] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!id) return;
        const fetchBookingsById = async() => {
            try {
                setLoading(true);
                const response = await api.get(`/bookings/${id}`)
                setBookings(response.data);
            } catch (err) {
                setError("Failed to fetch bookings")
            } finally {
                setLoading(false);
            }
        };
        fetchBookingsById();
    },[id, trigger]);

    
    return { booking, loading, error, refetch: () => setTrigger((t) => t + 1) };
}