import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import { Booking, Filters } from "./booking.types";
import { useBookingStats } from "./hooks/useBookingStats";
import { useBookings } from "./hooks/useBooking";

const BookingsPage = () => {
  const { bookings, loading, error } = useBookings();
  const { totalToday, confirmed, cancelled, nextAppointment } =
    useBookingStats(bookings);
  const { setTopbar } = useTopbar();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<Filters>({
    date: "",
    status: "",
    staffId: "",
  });

  useEffect(() => {
    setTopbar({ title: "Bookings", subtitle: "Today's Appointments" });
  }, []);

  return <div>BookingsPage</div>;
};

export default BookingsPage;
