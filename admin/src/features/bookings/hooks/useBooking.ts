import { useEffect, useState } from "react";
import { Booking } from "../booking.types";
import api from "../../../shared/utils/api";

export function useBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBookings = async () => {
          try {
            setLoading(true);
            const response = await api.get("/bookings");
            setBookings(response.data);
          } catch (err) {
            setError("Failed to fetch bookings");
          } finally {
            setLoading(false);
          }
        };
        fetchBookings();
      }, []);

      return { bookings, loading, error } 
}