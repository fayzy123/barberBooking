import { use, useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import { Booking, Filters } from "./booking.types";
import api from "../../shared/utils/api";

const BookingsPage = () => {
  const { setTopbar } = useTopbar();

  useEffect(() => {
    setTopbar({ title: "Bookings", subtitle: "Today's Appointments" });
  }, []);

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

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<Filters>({
    date: "",
    status: "",
    staffId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return <div>BookingsPage</div>;
};

export default BookingsPage;
