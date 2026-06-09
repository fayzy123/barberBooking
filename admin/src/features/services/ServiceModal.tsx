import { useEffect, useState } from "react";
import Toggle from "../staff/components/Toggle";
import { Service } from "./service.types";
import btnStyles from "../../shared/utils/buttons.module.css";
import styles from "./ServiceModal.module.css";

interface ServiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
  service?: Service;
}

const ServiceModal = ({ onClose, onSuccess, service }: ServiceModalProps) => {
  const isEditMode = !!service;
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

  return (
    <dialog open className={styles.overlay}>
      <article className={styles.modal}>
        <form className={styles.form}>
          <h3>{isEditMode ? "Edit Service" : "Add Service"}</h3>
          <label htmlFor="name">Service Name</label>
          <input id="name" type="text" className={styles.input}></input>
          <label htmlFor="durationMinutes">Duration</label>
          <input
            id="durationMinutes"
            type="number"
            className={styles.input}
          ></input>
          <label htmlFor="active">Active</label>
          <Toggle
            checked={formData.active}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, active: val }))
            }
          />

          <footer>
            <button
              className={btnStyles.btnRed}
              type="button"
              onClick={onClose}
            >
              Cancel
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
