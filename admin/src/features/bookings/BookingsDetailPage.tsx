import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTopbar } from "../../layout/TopBarContext";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useStaff } from "../staff/hooks/useStaff";
import {
  cancelBooking,
  reassignBooking,
  updateBooking,
} from "./booking.service";
import pageStyles from "./BookingDetailPage.module.css";
import { useBookingById } from "./hooks/useBookingById";
import { useServices } from "../services/hooks/useServices";
import { getBookingErrorMessage } from "../../shared/utils/bookingErrors";

const BookingsDetailPage = () => {
  const { id } = useParams();
  const { setTopbar } = useTopbar();
  const { booking, loading, error } = useBookingById(id ?? "");
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { staff } = useStaff();
  const { service } = useServices();
  const [formData, setFormData] = useState({
    customerFirstName: "",
    customerLastName: "",
    customerPhone: "",
    serviceId: "",
    staffId: "",
  });
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

  useEffect(() => {
    if (booking) {
      setFormData({
        customerFirstName: booking.customerFirstName,
        customerLastName: booking.customerLastName,
        customerPhone: booking.customerPhone,
        serviceId: booking.serviceId,
        staffId: booking.staffId,
      });
    }
  }, [booking]);

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

  const handleSave = async () => {
    try {
      if (formData.staffId !== booking?.staffId) {
        await reassignBooking(id!, formData.staffId);
      } // If any other fields changed, update booking
      if (
        formData.customerFirstName !== booking?.customerFirstName ||
        formData.customerLastName !== booking?.customerLastName ||
        formData.customerPhone !== booking?.customerPhone ||
        formData.serviceId !== booking?.serviceId
      ) {
        await updateBooking(id!, {
          customerFirstName: formData.customerFirstName,
          customerLastName: formData.customerLastName,
          customerPhone: formData.customerPhone,
          serviceId: formData.serviceId,
        });
      }

      navigate("/bookings");
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;
      setActionError(getBookingErrorMessage(errorCode));
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
          value={formData.customerFirstName}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              customerFirstName: e.target.value,
            }))
          }
        />

        <label className={pageStyles.label} htmlFor="customerLastName">
          Customer Last Name
        </label>
        <input
          id="customerLastName"
          type="text"
          className={pageStyles.input}
          value={formData.customerLastName}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              customerLastName: e.target.value,
            }))
          }
        />

        <label className={pageStyles.label} htmlFor="phone">
          Customer phone
        </label>
        <input
          id="phone"
          type="tel"
          className={pageStyles.input}
          value={formData.customerPhone}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              customerPhone: e.target.value,
            }))
          }
        />

        <label className={pageStyles.label} htmlFor="service">
          Service
        </label>
        <select
          id="service"
          value={formData.serviceId}
          className={pageStyles.select}
          onChange={(e) => {
            setActionError(null);
            setFormData((prev) => ({ ...prev, serviceId: e.target.value }));
          }}
        >
          <option>Select a service</option>
          {service.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}: {s.durationMinutes} minutes
            </option>
          ))}
        </select>

        <label className={pageStyles.label} htmlFor="staff">
          Staff
        </label>
        <select
          id="staff"
          value={formData.staffId}
          className={pageStyles.select}
          onChange={(e) => {
            setActionError(null);
            setFormData((prev) => ({ ...prev, staffId: e.target.value }));
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
              className={btnStyles.btnGold}
              type="button"
              onClick={handleSave}
            >
              Save Changes
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
