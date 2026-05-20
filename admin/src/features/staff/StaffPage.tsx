import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useNavigate } from "react-router-dom";
import { useStaff } from "./hooks/useStaff";
import styles from "./StaffPage.module.css";

export const StaffPage = () => {
  const { staff } = useStaff();
  const [showModal, setShowModal] = useState(false);
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

  return (
    <main className={styles.content}>
      <section className={styles.grid}>
        {staff.map((s) => (
          <article
            key={s.id}
            className={styles.card}
            onClick={() => navigate(`/staff/${s.id}`)}
          >
            <div className={styles.avatar}>
              {s.name.charAt(0).toUpperCase()}
            </div>
            <h3 className={styles.name}>{s.name}</h3>
            <span
              className={s.active ? styles.badgeActive : styles.badgeInactive}
            >
              {s.active ? "Active" : "Inactive"}
            </span>
          </article>
        ))}
      </section>
    </main>
  );
};

export default StaffPage;
