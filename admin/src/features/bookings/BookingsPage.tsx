import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import { Filters } from "./booking.types";
import { useBookingStats } from "./hooks/useBookingStats";
import { useBookings } from "./hooks/useBooking";
import StatCards from "./components/StatCards";
import pageStyles from "./BookingsPage.module.css";
import btnStyles from "../../shared/utils/buttons.module.css";
import FilterBar from "./components/FilterBar";
import { useStaff } from "../staff/hooks/useStaff";
import { useFilteredBookings } from "./hooks/useFilteredBookings";
import BookingsTable from "./components/BookingsTable";
import { useNavigate } from "react-router-dom";

const BookingsPage = () => {
  const { bookings } = useBookings();
  const {
    todayFormatted,
    totalToday,
    confirmed,
    cancelled,
    nextAppointment,
    nextAppointmentTime,
  } = useBookingStats(bookings);
  const { setTopbar } = useTopbar();
  const { staff } = useStaff();
  const navigate = useNavigate();
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
    setTopbar({
      title: "Bookings",
      subtitle: "Today's Appointments",
      actions: (
        <button
          className={btnStyles.btnGold}
          onClick={() => navigate("/bookings/new")}
        >
          + New Booking
        </button>
      ),
    });
  }, []);

  return (
    <main className={pageStyles.content}>
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
      <BookingsTable bookings={filteredBookings} />
    </main>
  );
};

export default BookingsPage;
