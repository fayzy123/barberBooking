import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import { Booking, Filters } from "./booking.types";
import { useBookingStats } from "./hooks/useBookingStats";
import { useBookings } from "./hooks/useBooking";
import StatCards from "./components/StatCards";
import styles from "./BookingsPage.module.css";

const BookingsPage = () => {
  const { bookings, loading, error } = useBookings();
  const {
    todayFormatted,
    totalToday,
    confirmed,
    cancelled,
    nextAppointment,
    nextAppointmentTime,
  } = useBookingStats(bookings);
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

  return (
    <main className={styles.content}>
      <StatCards
        totalToday={totalToday}
        confirmed={confirmed}
        cancelled={cancelled}
        nextAppointment={nextAppointment}
        nextAppointmentTime={nextAppointmentTime}
        today={todayFormatted}
      />
    </main>
  );
};

export default BookingsPage;
