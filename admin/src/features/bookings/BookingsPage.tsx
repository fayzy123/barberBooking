import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import { Booking, Filters } from "./booking.types";
import { useBookingStats } from "./hooks/useBookingStats";
import { useBookings } from "./hooks/useBooking";
import StatCards from "./components/StatCards";
import styles from "./BookingsPage.module.css";
import FilterBar from "./components/FilterBar";
import { useStaff } from "../staff/hooks/useStaff";
import { useFilteredBookings } from "./hooks/useFilteredBookings";
import BookingsTable from "./components/BookingsTable";

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
  const { staff } = useStaff();
  const [filters, setFilters] = useState<Filters>({
    date: "",
    status: "",
    staffId: "",
  });

  const filteredBookings = useFilteredBookings(bookings, filters);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
      <FilterBar
        filters={filters}
        staff={staff}
        onFilterChange={handleFilterChange}
      />
      <BookingsTable
        bookings={filteredBookings}
        onSelectBooking={(bookings) => setSelectedBooking(bookings)}
      />
    </main>
  );
};

export default BookingsPage;
