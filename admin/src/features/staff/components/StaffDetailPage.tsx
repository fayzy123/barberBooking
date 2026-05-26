import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTopbar } from "../../../layout/TopBarContext";
import btnStyles from "../../../shared/utils/buttons.module.css";
import styles from "./StaffDetailPage.module.css";
import { useStaffById } from "../hooks/useStaffById";
import StaffProfileForm from "./StaffProfileForm";
import AvailabilityGrid from "./AvailabilityGrid";

const StaffDetailPage = () => {
  const { id } = useParams();
  const { setTopbar } = useTopbar();
  const { staff, loading, error } = useStaffById(id ?? "");
  const navigate = useNavigate();

  useEffect(() => {
    setTopbar({
      title: staff?.name ?? "Staff Member",
      subtitle: staff?.active ? "Active" : "Inactive",
      actions: (
        <button
          className={btnStyles.btnGhost}
          onClick={() => navigate("/staff")}
        >
          Back
        </button>
      ),
    });
  }, [id, staff]);

  if (loading) return <p>Loading..</p>;
  if (error) return <p>{error}</p>;
  if (!staff) return <p>Staff member not found</p>;

  return (
    <main className={styles.content}>
      <section className={styles.layout}>
        <StaffProfileForm staff={staff} />
        <AvailabilityGrid />
      </section>
    </main>
  );
};

export default StaffDetailPage;
