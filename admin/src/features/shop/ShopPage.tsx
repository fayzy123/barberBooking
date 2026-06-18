import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import ErrorState from "../../shared/components/ErrorState";
import LoadingState from "../../shared/components/LoadingState";
import badgeStyles from "../../shared/utils/badges.module.css";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useServices } from "../services/hooks/useServices";
import { Service } from "../services/service.types";
import ServiceModal from "../services/ServiceModal";
import { useShop } from "./hooks/useShop";
import { EditShop, editShopSettingSchema } from "./shop.schema";
import { updateShop } from "./shop.service";
import { useShopContext } from "./ShopContext";
import styles from "./ShopPage.module.css";

const ShopPage = () => {
  const { shop, loading, error, refetch: refetchShop } = useShop();
  const { setShopName } = useShopContext();
  const { service, refetch: refetchServices } = useServices();
  const { setTopbar } = useTopbar();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<EditShop>({
    name: "",
    openTime: "",
    closeTime: "",
    slotInterval: 0,
    leadTime: 0,
    bookAheadDays: 0,
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name,
        openTime: shop.openTime,
        closeTime: shop.closeTime,
        slotInterval: shop.slotInterval,
        leadTime: shop.leadTime,
        bookAheadDays: shop.bookAheadDays,
      });
    }
  }, [shop]);

  useEffect(() => {
    setTopbar({
      title: "Shop Management",
      subtitle: "Manage Shop Settings",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = editShopSettingSchema.safeParse(formData);

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
      await updateShop(formData);
      refetchShop();
      refetchServices();
      setSaveSuccess(true);
      setShopName(formData.name);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save settings";
      setSaveError(message);
    }
  };

  if (loading) return <LoadingState message="Loading shop settings..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <main className={styles.content}>
        <div className={styles.column}>
          <form onSubmit={handleSubmit}>
            <section className={styles.card}>
              <h3>General</h3>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                  Shop Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  className={styles.input}
                  onChange={(e) => {
                    setSaveSuccess(false);
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                  }}
                />
                {fieldErrors.name && (
                  <p className={styles.fieldError}>{fieldErrors.name}</p>
                )}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="timeZone" className={styles.label}>
                  Timezone
                </label>
                <input
                  id="timeZone"
                  type="text"
                  value={shop?.timezone ?? "Europe/London"}
                  readOnly
                  className={styles.input}
                />
              </div>
            </section>

            <section className={styles.card}>
              <h3>Opening Hours</h3>
              <div className={styles.fieldGroup}>
                <label htmlFor="openTime" className={styles.label}>
                  Shop Hours
                </label>
                <div className={styles.timeRow}>
                  <input
                    id="openTime"
                    type="time"
                    value={formData.openTime}
                    className={styles.timeInput}
                    onChange={(e) => {
                      setSaveSuccess(false);
                      setFormData((prev) => ({
                        ...prev,
                        openTime: e.target.value,
                      }));
                    }}
                  />

                  {fieldErrors.openTime && (
                    <p className={styles.fieldError}>{fieldErrors.openTime}</p>
                  )}
                  <span>to</span>
                  <input
                    id="closeTime"
                    type="time"
                    value={formData.closeTime}
                    className={styles.timeInput}
                    onChange={(e) => {
                      setSaveSuccess(false);
                      setFormData((prev) => ({
                        ...prev,
                        closeTime: e.target.value,
                      }));
                    }}
                  />

                  {fieldErrors.closeTime && (
                    <p className={styles.fieldError}>{fieldErrors.closeTime}</p>
                  )}
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <h3>Booking Rules</h3>
              <div className={styles.fieldGroup}>
                <label htmlFor="slotInterval" className={styles.label}>
                  Slot Interval (Minutes)
                </label>
                <input
                  id="slotInterval"
                  type="number"
                  value={
                    formData.slotInterval === 0 ? "" : formData.slotInterval
                  }
                  className={styles.inputSmall}
                  onChange={(e) => {
                    setSaveSuccess(false);
                    setFormData((prev) => ({
                      ...prev,
                      slotInterval: Number(e.target.value),
                    }));
                  }}
                />
                {fieldErrors.slotInterval && (
                  <p className={styles.fieldError}>
                    {fieldErrors.slotInterval}
                  </p>
                )}

                <p className={styles.hint}>How often start times appear</p>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="leadTime" className={styles.label}>
                  Lead Time (Minutes)
                </label>
                <input
                  id="leadTime"
                  type="number"
                  value={formData.leadTime === 0 ? "" : formData.leadTime}
                  className={styles.inputSmall}
                  onChange={(e) => {
                    setSaveSuccess(false);
                    setFormData((prev) => ({
                      ...prev,
                      leadTime: Number(e.target.value),
                    }));
                  }}
                />
                {fieldErrors.leadTime && (
                  <p className={styles.fieldError}>{fieldErrors.leadTime}</p>
                )}

                <p className={styles.hint}>
                  Minimum notice before a customer can book
                </p>
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="bookAheadDays" className={styles.label}>
                  Book Ahead Limit (Days)
                </label>
                <input
                  id="bookAheadDays"
                  type="number"
                  value={
                    formData.bookAheadDays === 0 ? "" : formData.bookAheadDays
                  }
                  className={styles.inputSmall}
                  onChange={(e) => {
                    setSaveSuccess(false);
                    setFormData((prev) => ({
                      ...prev,
                      bookAheadDays: Number(e.target.value),
                    }));
                  }}
                />
                {fieldErrors.bookAheadDays && (
                  <p className={styles.fieldError}>
                    {fieldErrors.bookAheadDays}
                  </p>
                )}

                <p className={styles.hint}>How far ahead customer can book</p>
              </div>
            </section>

            {saveError && <p className={styles.saveError}>{saveError}</p>}
            {saveSuccess && (
              <p className={styles.saveSuccess}>Settings saved successfully!</p>
            )}
            <button className={btnStyles.btnGold} type="submit">
              Save Settings
            </button>
          </form>
        </div>

        <div className={styles.column}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Services</h3>
              <button
                className={btnStyles.btnGold}
                onClick={() => {
                  setSelectedService(null);
                  setShowServiceModal(true);
                }}
              >
                + Add Service
              </button>
            </div>
            <ul className={styles.serviceList}>
              {service.map((s) => (
                <li
                  key={s.id}
                  className={styles.serviceRow}
                  onClick={() => {
                    setSelectedService(s);
                    setShowServiceModal(true);
                  }}
                >
                  <span
                    className={s.active ? styles.dotActive : styles.dotInactive}
                  ></span>
                  <span className={styles.serviceName}>{s.name}</span>
                  <span className={styles.serviceDuration}>
                    {s.durationMinutes} mins
                  </span>
                  <div className={styles.serviceActions}>
                    <span
                      className={
                        s.active
                          ? badgeStyles.badgeActive
                          : badgeStyles.badgeInactive
                      }
                    >
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      {showServiceModal && (
        <ServiceModal
          service={selectedService ?? undefined}
          onClose={() => setShowServiceModal(false)}
          onSuccess={() => {
            refetchServices();
          }}
        />
      )}
    </>
  );
};

export default ShopPage;
