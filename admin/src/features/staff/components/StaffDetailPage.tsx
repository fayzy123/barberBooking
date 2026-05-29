import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTopbar } from "../../../layout/TopBarContext";
import btnStyles from "../../../shared/utils/buttons.module.css";
import styles from "./StaffDetailPage.module.css";
import { useStaffById } from "../hooks/useStaffById";
import StaffProfileForm from "./StaffProfileForm";
import AvailabilityGrid, { AvailabilityGridHandle } from "./AvailabilityGrid";
import { updateShifts } from "../staff.service";

const StaffDetailPage = () => {
  const { id } = useParams();
  const { setTopbar } = useTopbar();
  const { staff, loading, error } = useStaffById(id ?? "");
  const gridRef = useRef<AvailabilityGridHandle>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSave = async () => {
    const shifts = gridRef.current?.getShifts();
    if (!shifts) return;
    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      await updateShifts(staff.id, shifts);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError("Failed to save schedule. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className={styles.content}>
      <section className={styles.layout}>
        <StaffProfileForm staff={staff} />

        <article>
          <AvailabilityGrid
            ref={gridRef}
            staff={staff}
            onShiftChange={() => setSaveSuccess(false)}
          />
          <p className={styles.hint}>
            Break duration is currently fixed at 1 hour from break start time.
            No bookings will be taken from 1 hour of break start time.
          </p>
          {saveError && <p className={styles.saveError}>{saveError}</p>}
          {saveSuccess && <p className={styles.saveSuccess}>Schedule Saved!</p>}
        </article>
      </section>

      <footer className={styles.footer}>
        <button
          className={btnStyles.btnGold}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </footer>
    </main>
  );
};

export default StaffDetailPage;
