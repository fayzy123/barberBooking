import { useState } from "react";
import btnStyles from "../../../shared/utils/buttons.module.css";
import styles from "../components/StaffProfileForm.module.css";
import { createStaffSchema } from "../staff.schema";
import { updateStaff } from "../staff.service";
import { Staff } from "../staff.types";
import Toggle from "./Toggle";

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
  const [name, setName] = useState(staff.name);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStaffSchema.safeParse({
      name: name,
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
      await updateStaff(staff.id, name, active);
      setSuccess(true);
    } catch (err) {
      setError("Staff member could not be updated!");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <p className={styles.title}>Profile</p>
      <label className={styles.label}>Full Name</label>
      <input
        className={styles.input}
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setSuccess(false);
        }}
      ></input>

      {fieldErrors.name && <p className={styles.error}>{fieldErrors.name}</p>}

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
      </footer>
    </form>
  );
};

export default StaffProfileForm;
