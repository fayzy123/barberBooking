import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTopbar } from "../../layout/TopBarContext";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useStaff } from "../staff/hooks/useStaff";
import { Filters } from "./booking.types";
import pageStyles from "./BookingsPage.module.css";
import BookingsTable from "./components/BookingsTable";
import FilterBar from "./components/FilterBar";
import StatCards from "./components/StatCards";
import { useBookings } from "./hooks/useBooking";
import { useBookingStats } from "./hooks/useBookingStats";
import { useFilteredBookings } from "./hooks/useFilteredBookings";

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
  const { staff } = useStaff();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [filters, setFilters] = useState<Filters>({
    date: "",
    status: "",
    staffId: "",
  });

  const filteredBookings = useFilteredBookings(bookings, filters);
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / limit));
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * limit,
    page * limit,
  );

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

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
      <BookingsTable
        bookings={paginatedBookings}
        loading={loading}
        error={error}
      />
      <footer className={pageStyles.pagination}>
        <button
          className={btnStyles.btnGhost}
          type="button"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <button
              key={pageNumber}
              type="button"
              className={
                page === pageNumber ? btnStyles.btnGold : btnStyles.btnGhost
              }
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          className={btnStyles.btnGhost}
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </footer>
    </main>
  );
};

export default BookingsPage;
