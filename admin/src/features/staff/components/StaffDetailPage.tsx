import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTopbar } from "../../../layout/TopBarContext";
import btnStyles from "../../../shared/utils/buttons.module.css";
import styles from "./StaffDetailPage.module.css";
import { useStaffById } from "../hooks/useStaffById";
import StaffProfileForm from "./StaffProfileForm";
import AvailabilityGrid, { AvailabilityGridHandle } from "./AvailabilityGrid";
import { updateShifts, updateStaff } from "../staff.service";
import { createStaffSchema } from "../staff.schema";
import LoadingState from "../../../shared/components/LoadingState";
import ErrorState from "../../../shared/components/ErrorState";

const StaffDetailPage = () => {
  const { id } = useParams();
  const { setTopbar } = useTopbar();
  const { staff, loading, error } = useStaffById(id ?? "");
  const gridRef = useRef<AvailabilityGridHandle>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    active: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (staff) {
      setProfileData({
        firstName: staff.firstName,
        lastName: staff.lastName,
        active: staff.active,
      });
    }
  }, [staff]);

  useEffect(() => {
    setTopbar({
      title:
        `${staff?.firstName ?? ""} ${staff?.lastName ?? ""}`.trim() ||
        "Staff Member",
      subtitle: profileData.active ? "Active" : "Inactive",
      backButton: (
        <button
          className={btnStyles.btnGhost}
          onClick={() => navigate("/staff")}
        >
          ← Back
        </button>
      ),
    });
  }, [id, staff, profileData, navigate]);

  const handleSave = async () => {
    const shifts = gridRef.current?.getShifts();
    if (!shifts) return;

    const result = createStaffSchema.safeParse(profileData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setSaveError(Object.values(errors)[0]);
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      await Promise.all([
        updateStaff(
          staff!.id,
          profileData.firstName,
          profileData.lastName,
          profileData.active,
        ),
        updateShifts(staff!.id, shifts),
      ]);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Loading staff member..." />;
  if (error) return <ErrorState message={error} />;
  if (!staff) return <p>Staff member not found</p>;

  return (
    <main className={styles.content}>
      <section className={styles.layout}>
        <StaffProfileForm
          staff={staff}
          profileData={profileData}
          onChange={(field, value) => {
            setProfileData((prev) => ({ ...prev, [field]: value }));
            setSaveSuccess(false);
          }}
        />

        <article>
          <AvailabilityGrid
            ref={gridRef}
            staff={staff}
            staffActive={profileData.active}
            onShiftChange={() => setSaveSuccess(false)}
            onActiveDaysChange={(hasActiveDays) =>
              setProfileData((prev) => ({ ...prev, active: hasActiveDays }))
            }
          />

          {saveError && <p className={styles.saveError}>{saveError}</p>}
          {saveSuccess && <p className={styles.saveSuccess}>Changes Saved!</p>}
        </article>
      </section>

      <footer className={styles.footer}>
        <button
          className={btnStyles.btnGold}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </footer>
    </main>
  );
};

export default StaffDetailPage;
