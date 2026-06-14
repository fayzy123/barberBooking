import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTopbar } from "../../layout/TopBarContext";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useStaff } from "../staff/hooks/useStaff";
import { cancelBooking, reassignBooking } from "./booking.service";
import pageStyles from "./BookingDetailPage.module.css";
import { useBookingById } from "./hooks/useBookingById";

const BookingsDetailPage = () => {
  const { id } = useParams();
  const { setTopbar } = useTopbar();
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const { booking, loading, error } = useBookingById(id ?? "");
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { staff } = useStaff();
  const navigate = useNavigate();

  useEffect(() => {
    setTopbar({
      title: "Booking Detail",
      subtitle: `Ref: ${booking?.ref ?? id}`,
      backButton: (
        <button
          className={btnStyles.btnGhost}
          onClick={() => navigate("/bookings")}
        >
          ← Back
        </button>
      ),
    });
  }, [id, booking]);

  const handleReassign = async () => {
    try {
      await reassignBooking(id!, selectedStaffId);
      navigate("/bookings");
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      if (serverMessage === "Booking has already been cancelled.") {
        setActionError(
          "This booking is already cancelled. Please create a new booking instead.",
        );
      } else {
        setActionError("Failed to reassign booking. Please try again.");
      }
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBooking(id!, cancelReason);
      setShowCancelModal(false);
      navigate("/bookings");
    } catch (err) {
      setActionError("Failed to cancel booking. Please try again.");
      setShowCancelModal(false);
    }
  };

  if (loading) return <div>Loading.. </div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <form className={pageStyles.form}>
        <label className={pageStyles.label} htmlFor="customerFirstName">
          Customer First Name
        </label>
        <input
          id="customerFirstName"
          type="text"
          className={pageStyles.input}
          value={booking?.customerFirstName ?? ""}
          readOnly
        />

        <label className={pageStyles.label} htmlFor="customerLastName">
          Customer Last Name
        </label>
        <input
          id="customerLastName"
          type="text"
          className={pageStyles.input}
          value={booking?.customerLastName ?? ""}
          readOnly
        />

        <label className={pageStyles.label} htmlFor="phone">
          Customer phone
        </label>
        <input
          id="phone"
          type="tel"
          className={pageStyles.input}
          value={booking?.customerPhone ?? ""}
          readOnly
        />

        <label className={pageStyles.label} htmlFor="service">
          Service
        </label>
        <input
          id="service"
          type="text"
          className={pageStyles.input}
          value={booking?.Service?.name ?? ""}
          readOnly
        />

        <label className={pageStyles.label} htmlFor="staff">
          Staff
        </label>
        <select
          id="staff"
          value={selectedStaffId}
          className={pageStyles.select}
          onChange={(e) => {
            setActionError(null);
            setSelectedStaffId(e.target.value);
          }}
        >
          <option>Select a staff member</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>

        <label className={pageStyles.label} htmlFor="startTime">
          Start Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          value={booking?.startTime.slice(0, 16) ?? ""}
          className={pageStyles.input}
          readOnly
        />

        {actionError && <p className={pageStyles.actionError}>{actionError}</p>}
        <footer className={pageStyles.footer}>
          <>
            <button
              className={btnStyles.btnBlue}
              type="button"
              onClick={handleReassign}
            >
              Reassign Staff
            </button>
            <button
              className={btnStyles.btnRed}
              type="button"
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Booking
            </button>
          </>
        </footer>
      </form>
      {showCancelModal && (
        <dialog open className={pageStyles.overlay}>
          <article className={pageStyles.modal}>
            <h3>Cancel Booking</h3>
            <p className={pageStyles.dangerText}>
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <label htmlFor="cancelReason">Reason: (optional)</label>
            <textarea
              id="cancelReason"
              value={cancelReason}
              placeholder="Enter Cancellation Reason..."
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <footer>
              <button
                className={btnStyles.btnGhost}
                type="button"
                onClick={() => setShowCancelModal(false)}
              >
                Go Back
              </button>
              <button
                className={btnStyles.btnRed}
                type="button"
                onClick={handleCancel}
              >
                Confirm Cancel
              </button>
            </footer>
          </article>
        </dialog>
      )}
    </>
  );
};

export default BookingsDetailPage;
