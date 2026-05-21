import { useNavigate, useParams } from "react-router-dom";
import pageStyles from "./BookingDetailPage.module.css";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useTopbar } from "../../layout/TopBarContext";
import React, { useEffect, useState } from "react";
import { useBookingById } from "./hooks/useBookingById";
import { useStaff } from "../staff/hooks/useStaff";
import { useServices } from "../services/hooks/useServices";
import {
  cancelBooking,
  createBooking,
  reassignBooking,
} from "./booking.service";
import { createBookingSchema } from "./booking.schema";

const BookingsDetailPage = () => {
  const { id } = useParams();
  const isCreateMode = !id;

  const { setTopbar } = useTopbar();
  const { booking, loading, error } = useBookingById(id ?? "");
  const [actionError, setActionError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createBookingSchema.safeParse({
      ...formData,
      startTime: formData.startTime
        ? new Date(formData.startTime).toISOString()
        : "",
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    try {
      await createBooking({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
      });
      navigate("/bookings");
    } catch (err) {
      setActionError(
        "Failed to create booking, please ensure all fields are filled in correctly",
      );
    }
  };

  if (loading) return <div>Loading.. </div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <form className={pageStyles.form} onSubmit={handleSubmit}>
        <label className={pageStyles.label} htmlFor="name">
          Customer Name
        </label>
        <input
          id="name"
          type="text"
          className={`${pageStyles.input} ${fieldErrors.customerName ? pageStyles.inputError : ""}`}
          value={formData.customerName}
          readOnly={!isCreateMode}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customerName: e.target.value }))
          }
        />
        {fieldErrors.customerName && (
          <p className={pageStyles.fieldError}>{fieldErrors.customerName}</p>
        )}

        <label className={pageStyles.label} htmlFor="phone">
          Customer phone
        </label>
        <input
          id="phone"
          type="tel"
          className={`${pageStyles.input} ${fieldErrors.customerPhone ? pageStyles.inputError : ""}`}
          value={formData.customerPhone}
          readOnly={!isCreateMode}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))
          }
        />
        {fieldErrors.customerPhone && (
          <p className={pageStyles.fieldError}>{fieldErrors.customerPhone}</p>
        )}

        <label className={pageStyles.label} htmlFor="service">
          Service
        </label>
        <select
          id="service"
          value={formData.serviceId}
          disabled={!isCreateMode}
          className={`${pageStyles.input} ${fieldErrors.serviceId ? pageStyles.inputError : ""}`}
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
        {fieldErrors.serviceId && (
          <p className={pageStyles.fieldError}>{fieldErrors.serviceId}</p>
        )}

        <label className={pageStyles.label} htmlFor="staff">
          Staff
        </label>
        <select
          id="staff"
          value={formData.staffId}
          className={`${pageStyles.select} ${fieldErrors.staffId ? pageStyles.inputError : ""}`}
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
        {fieldErrors.staffId && (
          <p className={pageStyles.fieldError}>{fieldErrors.staffId}</p>
        )}

        <label className={pageStyles.label} htmlFor="startTime">
          Start Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          value={formData.startTime}
          readOnly={!isCreateMode}
          className={`${pageStyles.input} ${fieldErrors.startTime ? pageStyles.inputError : ""}`}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, startTime: e.target.value }))
          }
        ></input>
        {fieldErrors.startTime && (
          <p className={pageStyles.fieldError}>{fieldErrors.startTime}</p>
        )}
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
