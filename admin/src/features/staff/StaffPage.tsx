import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTopbar } from "../../layout/TopBarContext";
import btnStyles from "../../shared/utils/buttons.module.css";
import Toggle from "./components/Toggle";
import { useStaff } from "./hooks/useStaff";
import { createStaffSchema } from "./staff.schema";
import { createStaff } from "./staff.service";
import styles from "./StaffPage.module.css";
import badgeStyles from "../../shared/utils/badges.module.css";

export const StaffPage = () => {
  const { staff, refetch } = useStaff();
  const [showModal, setShowModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [modalError, setModalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { setTopbar } = useTopbar();
  const navigate = useNavigate();

  useEffect(() => {
    setTopbar({
      title: "Staff Management",
      subtitle: "Manage your staff",
      actions: (
        <button
          className={btnStyles.btnGold}
          onClick={() => setShowModal(true)}
        >
          + New Staff Member
        </button>
      ),
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createStaffSchema.safeParse({
      firstName: newFirstName,
      lastName: newLastName,
      active: newActive,
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

    try {
      await createStaff(newFirstName, newLastName, newActive);
      setShowModal(false);
      setNewFirstName("");
      setNewLastName("");
      setNewActive(true);
      setModalError(null);
      refetch();
    } catch (err) {
      setModalError("Failed to create staff member. Please try again");
    }
  };

  return (
    <>
      <main className={styles.content}>
        <section className={styles.grid}>
          {staff.map((s) => (
            <article
              key={s.id}
              className={styles.card}
              onClick={() => navigate(`/staff/${s.id}`)}
            >
              <div className={styles.avatar}>
                {s.firstName.charAt(0).toUpperCase()}
                {s.lastName.charAt(0).toUpperCase()}
              </div>
              <h3 className={styles.name}>
                {s.firstName}
                {s.lastName}
              </h3>
              <span
                className={
                  s.active ? badgeStyles.badgeActive : badgeStyles.badgeInactive
                }
              >
                {s.active ? "Active" : "Inactive"}
              </span>
            </article>
          ))}
        </section>
      </main>
      {showModal && (
        <dialog open className={styles.overlay}>
          <article className={styles.modal}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h3>Create a new staff member</h3>

              <label htmlFor="firstName">
                Please enter name of staff member
              </label>
              <input
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                placeholder="Enter staff firstname"
                className={styles.input}
              />
              {fieldErrors.firstName && (
                <p className={styles.fieldError}>{fieldErrors.firstName}</p>
              )}

              <label htmlFor="lastName">
                Please enter name of staff member
              </label>
              <input
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                placeholder="Enter staff lastname"
                className={styles.input}
              />
              {fieldErrors.lastName && (
                <p className={styles.fieldError}>{fieldErrors.lastName}</p>
              )}
              <span className={styles.checkBoxRow}>
                <label htmlFor="active">Active: </label>
                <Toggle checked={newActive} onChange={setNewActive} />
              </span>

              {modalError && <p className={styles.modalError}>{modalError}</p>}

              <footer>
                <button
                  className={btnStyles.btnRed}
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setModalError(null);
                    setFieldErrors({});
                  }}
                >
                  Cancel
                </button>
                <button className={btnStyles.btnGold} type="submit">
                  Create
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  );
};

export default StaffPage;
