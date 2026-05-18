import { useNavigate, useParams } from "react-router-dom";
import pageStyles from "./BookingDetailPage.module.css";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useTopbar } from "../../layout/TopBarContext";
import { useEffect, useState } from "react";
import { useBookingById } from "./hooks/useBookingById";
import { useStaff } from "../staff/hooks/useStaff";
import { useServices } from "../services/hooks/useServices";
import { cancelBooking, reassignBooking } from "./booking.service";

// No proper error message for when user tried to reassign
// staff on a cancelled booking.

const BookingsDetailPage = () => {
  const { id } = useParams();
  const isCreateMode = !id;

  const { setTopbar } = useTopbar();
  const { booking, loading, error, refetch } = useBookingById(id ?? "");
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { staff } = useStaff();
  const { service } = useServices();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    serviceId: "",
    staffId: "",
    startTime: "",
  });

  useEffect(() => {
    setTopbar({
      title: isCreateMode ? "Create Booking" : "Booking Detail",
      subtitle: isCreateMode
        ? "Fill in the details below"
        : `Ref: ${booking?.ref ?? id}`,
      actions: (
        <button
          className={btnStyles.btnGhost}
          onClick={() => navigate("/bookings")}
        >
          Back
        </button>
      ),
    });
  }, [id, booking]);

  useEffect(() => {
    if (booking) {
      setFormData({
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        serviceId: booking.serviceId,
        staffId: booking.staffId,
        startTime: booking.startTime.slice(0, 16),
      });
    }
  }, [booking]);

  const handleReassign = async () => {
    try {
      await reassignBooking(id!, formData.staffId);
      refetch();
    } catch (err) {
      setActionError("Failed to reassign booking. Please try again");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelBooking(id!, cancelReason);
      setShowCancelModal(false);
      refetch();
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
        <label className={pageStyles.label} htmlFor="name">
          Customer Name
        </label>
        <input
          id="name"
          type="text"
          className={pageStyles.input}
          value={formData.customerName}
          readOnly={!isCreateMode}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customerName: e.target.value }))
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
          readOnly={!isCreateMode}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
          }
        />

        <label className={pageStyles.label} htmlFor="service">
          Service
        </label>
        <select
          id="service"
          value={formData.serviceId}
          disabled={!isCreateMode}
          className={pageStyles.select}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, serviceId: e.target.value }))
          }
        >
          <option>Select a service</option>
          {service.map((s) => (
            <option key={s.id} value={s.id} className={pageStyles.dropdown}>
              {s.name}
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
          <option> Select a staff member</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label className={pageStyles.label} htmlFor="startTime">
          Start Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          value={formData.startTime}
          readOnly={!isCreateMode}
          className={pageStyles.input}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, startTime: e.target.value }))
          }
        ></input>
        {actionError && <p className={pageStyles.actionError}>{actionError}</p>}
        <footer className={pageStyles.footer}>
          {isCreateMode ? (
            <button className={btnStyles.btnGold} type="submit">
              Create Booking
            </button>
          ) : (
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
          )}
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
