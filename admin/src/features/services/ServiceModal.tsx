import { useEffect, useState } from "react";
import Toggle from "../staff/components/Toggle";
import { Service } from "./service.types";
import btnStyles from "../../shared/utils/buttons.module.css";
import styles from "./ServiceModal.module.css";
import { createServiceSchema, updateServiceSchema } from "./service.schema";
import { createService, updateService } from "./barberService.service";

interface ServiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
  service?: Service;
}

const ServiceModal = ({ onClose, onSuccess, service }: ServiceModalProps) => {
  const isEditMode = !!service;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [modalError, setModalError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    durationMinutes: 0,
    active: false,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        durationMinutes: service.durationMinutes,
        active: service.active,
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const schema = isEditMode ? updateServiceSchema : createServiceSchema;
    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    try {
      if (isEditMode) {
        await updateService(service.id, formData);
      } else {
        await createService(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save service";
      setModalError(message);
    }
  };

  return (
    <dialog open className={styles.overlay}>
      <article className={styles.modal}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <h3>{isEditMode ? "Edit Service" : "Add Service"}</h3>
          <label htmlFor="name">Service Name</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={formData.name}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
            }}
          ></input>
          {fieldErrors.name && (
            <p className={styles.fieldError}>{fieldErrors.name}</p>
          )}
          <label htmlFor="durationMinutes">Duration</label>
          <input
            id="durationMinutes"
            type="number"
            className={styles.input}
            value={
              formData.durationMinutes === 0 ? "" : formData.durationMinutes
            }
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                durationMinutes:
                  e.target.value === "" ? 0 : Number(e.target.value),
              }));
            }}
          ></input>
          {fieldErrors.durationMinutes && (
            <p className={styles.fieldError}>{fieldErrors.durationMinutes}</p>
          )}
          <div className={styles.toggleRow}>
            <label htmlFor="active">Active</label>
            <Toggle
              checked={formData.active}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, active: val }))
              }
            />
          </div>

          {modalError && <p className={styles.fieldError}>{modalError}</p>}

          <footer>
            <button
              className={btnStyles.btnRed}
              type="button"
              onClick={onClose}
            >
              Close
            </button>
            <button className={btnStyles.btnGold} type="submit">
              Save
            </button>
          </footer>
        </form>
      </article>
    </dialog>
  );
};

export default ServiceModal;
