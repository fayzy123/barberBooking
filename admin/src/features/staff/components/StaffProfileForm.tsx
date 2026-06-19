import { useState } from "react";
import { useNavigate } from "react-router-dom";
import btnStyles from "../../../shared/utils/buttons.module.css";
import styles from "../components/StaffProfileForm.module.css";
import { deleteStaff } from "../staff.service";
import { Staff } from "../staff.types";
import Toggle from "./Toggle";

interface StaffProfileFormProps {
  staff: Staff;
  profileData: { firstName: string; lastName: string; active: boolean };
  onChange: (field: string, value: string | boolean) => void;
}

const StaffProfileForm = ({
  staff,
  profileData,
  onChange,
}: StaffProfileFormProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteStaff(staff.id);
      navigate("/staff");
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setDeleteError(
        message ??
          "Failed to delete staff member, please ensure all of this staff members bookings are cancelled and try again",
      );
    }
  };

  return (
    <>
      <section className={styles.form}>
        <p className={styles.title}>Profile</p>

        <label className={styles.label}>First Name</label>
        <input
          className={styles.input}
          type="text"
          value={profileData.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
        />

        <label className={styles.label}>Last Name</label>
        <input
          className={styles.input}
          type="text"
          value={profileData.lastName}
          onChange={(e) => onChange("lastName", e.target.value)}
        />

        <hr className={styles.divider} />

        <label className={styles.toggleRow}>
          Active
          <Toggle
            checked={profileData.active}
            onChange={(val) => onChange("active", val)}
          />
        </label>

        <footer className={styles.footer}>
          <button
            className={`${btnStyles.btnRed} ${styles.deleteBtn}`}
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Staff Member
          </button>
        </footer>
      </section>

      {showDeleteModal && (
        <dialog open className={styles.overlay}>
          <article className={styles.modal}>
            <h3>Delete Staff</h3>
            <p className={styles.error}>
              Are you sure you want to delete this staff member? <br />
              This action cannot be undone.
            </p>
            {deleteError && <p className={styles.error}>{deleteError}</p>}
            <footer>
              <button
                className={btnStyles.btnGhost}
                type="button"
                onClick={() => setShowDeleteModal(false)}
              >
                Go Back
              </button>
              <button
                className={btnStyles.btnRed}
                type="button"
                onClick={handleDelete}
              >
                Confirm Delete
              </button>
            </footer>
          </article>
        </dialog>
      )}
    </>
  );
};

export default StaffProfileForm;
