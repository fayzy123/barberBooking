import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTopbar } from "../../layout/TopBarContext";
import btnStyles from "../../shared/utils/buttons.module.css";
import styles from "../bookings/CreateBookingPage.module.css";
import { useServices } from "../services/hooks/useServices";
import { useStaff } from "../staff/hooks/useStaff";
import { useAvailableSlots } from "./hooks/useAvailableSlots";
import { createBookingSchema } from "./booking.schema";
import { createBooking } from "./booking.service";

const CreateBookingPage = () => {
  const { setTopbar } = useTopbar();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ["Service", "Staff & Time", "Customer", "Confirm"];
  const { service } = useServices();
  const { staff } = useStaff();

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const { slots, slotsError, loading } = useAvailableSlots(
    selectedStaffId,
    selectedServiceId,
    selectedDate,
  );
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const selectedService = service.find((s) => s.id === selectedServiceId);
  const selectedStaff = staff.find((s) => s.id === selectedStaffId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setTopbar({
      title: "New Booking",
      subtitle: "Create a Booking",
      backButton: (
        <button
          className={btnStyles.btnGhost}
          onClick={() => navigate("/bookings")}
        >
          ← Back
        </button>
      ),
    });
  }, []);

  useEffect(() => {
    if (currentStep === 2 && staff.length > 0 && !selectedStaffId) {
      setSelectedStaffId(staff.filter((s) => s.active)[0].id);
    }
  }, [currentStep, staff]);

  const handleNext = async () => {
    if (currentStep === 1 && !selectedServiceId) return;
    if (
      currentStep === 2 &&
      (!selectedStaffId || !selectedDate || !selectedSlot)
    )
      return;
    if (currentStep === 3) {
      const result = createBookingSchema.safeParse({
        customerFirstName,
        customerLastName,
        customerPhone,
        serviceId: selectedServiceId,
        staffId: selectedStaffId,
        startTime: `${selectedDate}T${selectedSlot}:00.000Z`,
      });

      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          if (err.path[0]) errors[err.path[0] as string] = err.message;
        });
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
    }

    if (currentStep === 4) {
      try {
        await createBooking({
          customerFirstName,
          customerLastName,
          customerPhone,
          serviceId: selectedServiceId,
          staffId: selectedStaffId,
          startTime: `${selectedDate}T${selectedSlot}:00`,
        });
        navigate("/bookings");
      } catch (err: any) {
        const error = err?.response?.data?.error;
        setSubmitError(error ?? "Failed to create booking. Please try again.");
      }
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <main>
      <nav aria-label="Booking steps">
        <ol className={styles.stepList}>
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isActive = currentStep === stepNumber;

            return (
              <li
                key={step}
                className={`${styles.stepItem} ${isActive ? styles.active : ""} `}
              >
                <span
                  className={`${styles.stepCircle} ${isActive ? styles.active : ""} ${isCompleted ? styles.completed : ""}`}
                >
                  {stepNumber}
                </span>
                <span className={styles.stepLabel}>{step}</span>
                {stepNumber < steps.length && (
                  <span className={styles.stepLine} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {currentStep === 1 && (
        <section className={styles.stepContent}>
          <p className={styles.sectionLabel}>SELECT A SERVICE</p>
          <ul className={styles.serviceList}>
            {service
              .filter((s) => s.active)
              .map((s) => (
                <li
                  key={s.id}
                  className={`${styles.listItem} ${selectedServiceId === s.id ? styles.selected : ""}`}
                  onClick={() => setSelectedServiceId(s.id)}
                >
                  <hgroup>
                    <p className={styles.serviceName}>{s.name}</p>
                    <p className={styles.serviceDuration}>
                      {s.durationMinutes} mins
                    </p>
                  </hgroup>
                  {selectedServiceId === s.id && <span>✓</span>}
                </li>
              ))}
          </ul>
        </section>
      )}

      {currentStep === 2 && (
        <section className={styles.stepContent}>
          <article className={styles.step2Layout}>
            <div className={styles.leftCol}>
              <p className={styles.sectionLabel}>DATE</p>
              <input
                type="date"
                className={styles.dateInput}
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot("");
                }}
              ></input>

              <p className={styles.sectionLabel}>STAFF MEMBER</p>
              <ul className={styles.staffList}>
                {staff
                  .filter((s) => s.active)
                  .map((s) => (
                    <li
                      key={s.id}
                      className={`${styles.listItem} ${styles.staffListItem} ${selectedStaffId === s.id ? styles.selected : ""}`}
                      onClick={() => {
                        setSelectedStaffId(s.id);
                        setSelectedSlot("");
                      }}
                    >
                      <span className={styles.avatar}>
                        {s.firstName.charAt(0)}
                        {s.lastName.charAt(0)}
                      </span>
                      <hgroup>
                        <p className={styles.staffName}>
                          {s.firstName} {s.lastName}
                        </p>
                        <p className={styles.staffStatus}>Available</p>
                      </hgroup>
                    </li>
                  ))}
              </ul>
            </div>
            <div className={styles.rightCol}>
              <p className={styles.sectionLabel}>AVAILABLE SLOTS</p>
              {loading && (
                <p className={styles.slotMessage}>Loading Slots...</p>
              )}

              {slotsError && <p className={styles.slotsError}>{slotsError}</p>}
              {!loading &&
                !slotsError &&
                slots.length === 0 &&
                selectedStaffId &&
                selectedDate && (
                  <p className={styles.slotsMessage}>No available slots</p>
                )}

              <ul className={styles.slotsGrid}>
                {slots.map((slot) => (
                  <li
                    key={slot}
                    className={`${styles.slotItem} ${selectedSlot === slot ? styles.selected : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      )}

      {currentStep === 3 && (
        <section className={styles.stepContent}>
          <fieldset className={styles.customerForm}>
            <p className={styles.sectionLabel}>CUSTOMER DETAILS</p>
            <label htmlFor="customerFirstName" className={styles.customerLabel}>
              Customer firstname
            </label>
            <input
              id="customerFirstName"
              className={`${styles.customerInput} ${fieldErrors.customerFirstName ? styles.inputBorderError : ""}`}
              value={customerFirstName}
              onChange={(e) => {
                setCustomerFirstName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, customerFirstName: "" }));
              }}
            ></input>
            {fieldErrors && customerFirstName && (
              <p className={styles.inputError}>
                {fieldErrors.customerFirstName}
              </p>
            )}

            <label htmlFor="customerLastName" className={styles.customerLabel}>
              Customer lastname
            </label>
            <input
              id="customerLastName"
              className={`${styles.customerInput} ${fieldErrors.customerLastName ? styles.inputBorderError : ""}`}
              value={customerLastName}
              onChange={(e) => {
                setCustomerLastName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, customerLastName: "" }));
              }}
            ></input>
            {fieldErrors && customerLastName && (
              <p className={styles.inputError}>
                {fieldErrors.customerLastName}
              </p>
            )}

            <label htmlFor="customerPhone" className={styles.customerLabel}>
              Customer Phone
            </label>
            <input
              id="customerPhone"
              type="tel"
              className={`${styles.customerInput} ${fieldErrors.customerPhone ? styles.inputBorderError : ""}`}
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                setFieldErrors((prev) => ({ ...prev, customerPhone: "" }));
              }}
            ></input>
            {fieldErrors && customerPhone && (
              <p className={styles.inputError}>{fieldErrors.customerPhone}</p>
            )}
          </fieldset>
        </section>
      )}

      {currentStep === 4 && (
        <section className={styles.stepContent}>
          <p className={styles.confirmTitle}>BOOKING SUMMARY</p>
          <dl className={styles.confirmList}>
            <div className={styles.confirmRow}>
              <dt className={styles.confirmLabel}>Service</dt>
              <dd className={styles.confirmValue}>
                {selectedService?.name} · {selectedService?.durationMinutes}{" "}
                mins
              </dd>
            </div>
            <div className={styles.confirmRow}>
              <dt className={styles.confirmLabel}>Staff</dt>
              <dd className={styles.confirmValue}>
                {selectedStaff?.firstName} {selectedStaff?.lastName}
              </dd>
            </div>
            <div className={styles.confirmRow}>
              <dt className={styles.confirmLabel}>Date & Time</dt>
              <dd className={styles.confirmValue}>
                {selectedDate} at {selectedSlot}
              </dd>
            </div>
            <div className={styles.confirmRow}>
              <dt className={styles.confirmLabel}>Customer</dt>
              <dd className={styles.confirmValue}>
                {customerFirstName} {customerLastName}
              </dd>
            </div>
            <div className={styles.confirmRow}>
              <dt className={styles.confirmLabel}>Phone</dt>
              <dd className={styles.confirmValue}>{customerPhone}</dd>
            </div>
          </dl>
        </section>
      )}
      <footer className={styles.wizardFooter}>
        <button
          className={btnStyles.btnGhost}
          type="button"
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 1}
        >
          ← Back
        </button>

        <button
          className={btnStyles.btnGold}
          type="button"
          onClick={handleNext}
          disabled={currentStep === 1 && !selectedServiceId}
        >
          {currentStep === 4 ? "Confirm Booking" : "Next →"}
        </button>
      </footer>
    </main>
  );
};

export default CreateBookingPage;
