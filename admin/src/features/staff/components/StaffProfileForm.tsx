import { useState } from "react";
import btnStyles from "../../../shared/utils/buttons.module.css";
import styles from "../components/StaffProfileForm.module.css";
import { createStaffSchema } from "../staff.schema";
import { deleteStaff, updateStaff } from "../staff.service";
import { Staff } from "../staff.types";
import Toggle from "./Toggle";
import { useNavigate } from "react-router-dom";

interface StaffProfileFormProps {
  staff: Staff;
  active: boolean;
  onActiveChange?: (active: boolean) => void;
}

const StaffProfileForm = ({
  staff,
  active,
  onActiveChange,
}: StaffProfileFormProps) => {
  const [firstName, setFirstName] = useState(staff.firstName);
  const [lastName, setLastName] = useState(staff.lastName);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStaffSchema.safeParse({
      firstName: firstName,
      lastName: lastName,
      active: active,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      setSuccess(false);
      return;
    }
    setFieldErrors({});

    try {
      await updateStaff(staff.id, firstName, lastName, active);
      setSuccess(true);
    } catch (err) {
      setError("Staff member could not be updated!");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStaff(staff.id);
      navigate("/staff");
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setDeleteError(
        message ??
          "Failed to delete staff member, please ensure all of this staff members bookings are deleted and try again",
      );
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <p className={styles.title}>Profile</p>

        <label className={styles.label}>First Name</label>
        <input
          className={styles.input}
          type="text"
          value={firstName}
          onChange={(e) => {
            setFirstName(e.target.value);
            setSuccess(false);
          }}
        ></input>
        {fieldErrors.firstName && (
          <p className={styles.error}>{fieldErrors.firstName}</p>
        )}

        <label className={styles.label}>Last Name</label>
        <input
          className={styles.input}
          type="text"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setSuccess(false);
          }}
        ></input>
        {fieldErrors.lastName && (
          <p className={styles.error}>{fieldErrors.lastName}</p>
        )}

        <hr className={styles.divider} />

        <label className={styles.toggleRow}>
          Active
          <Toggle
            checked={active}
            onChange={(val) => {
              onActiveChange?.(val);
            }}
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>Changes Saved!</p>}

        <footer className={styles.footer}>
          <button
            className={`${btnStyles.btnGold} ${styles.saveBtn}`}
            type="submit"
          >
            Save Changes
          </button>
          <button
            className={`${btnStyles.btnRed} ${styles.deleteBtn}`}
            type="button"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete Staff Member
          </button>
        </footer>
      </form>
      {showDeleteModal && (
        <dialog open className={styles.overlay}>
          <article className={styles.modal}>
            <h3>Delete Staff</h3>
            <p className={styles.error}>
              Are you sure you want to delete this booking? <br />
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
