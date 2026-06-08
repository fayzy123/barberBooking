import { useEffect, useState } from "react";
import { useTopbar } from "../../layout/TopBarContext";
import { useShop } from "./hooks/useShop";
import styles from "./ShopPage.module.css";
import btnStyles from "../../shared/utils/buttons.module.css";
import { useServices } from "../services/hooks/useServices";
import { EditShop } from "./shop.schema";

const ShopPage = () => {
  const { shop } = useShop();
  console.log(shop);
  const { service } = useServices();
  const { setTopbar } = useTopbar();
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

  return (
    <main className={styles.content}>
      <div className={styles.column}>
        <form>
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
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
                  className={styles.inputSmall}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      openTime: e.target.value,
                    }))
                  }
                />
                <span>to</span>
                <input
                  id="closeTime"
                  type="time"
                  value={formData.closeTime}
                  className={styles.inputSmall}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      closeTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <h3>Booking Rules</h3>
            <div className={styles.fieldGroup}>
              <label htmlFor="slotInterval" className={styles.label}>
                Slot Interval
              </label>
              <input
                id="slotInterval"
                type="number"
                value={formData.slotInterval}
                className={styles.inputSmall}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    slotInterval: Number(e.target.value),
                  }))
                }
              />
              <p className={styles.hint}>How often start times appear</p>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="leadTime" className={styles.label}>
                Lead Time
              </label>
              <input
                id="leadTime"
                type="number"
                value={formData.leadTime}
                className={styles.inputSmall}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    leadTime: Number(e.target.value),
                  }))
                }
              />
              <p className={styles.hint}>
                Minimum notice before a customer can book
              </p>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="bookAheadDays" className={styles.label}>
                Book Ahead Limit
              </label>
              <input
                id="bookAheadDays"
                type="number"
                value={formData.bookAheadDays}
                className={styles.inputSmall}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bookAheadDays: Number(e.target.value),
                  }))
                }
              />
              <p className={styles.hint}>How far ahead customer can book</p>
            </div>
          </section>

          <button className={btnStyles.btnGold} type="submit">
            Save Settings
          </button>
        </form>
      </div>

      <div className={styles.column}>
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Services</h3>
            <button className={btnStyles.btnGold}>+ Add Service</button>
          </div>
          <ul className={styles.serviceList}>
            {service.map((s) => (
              <li key={s.id} className={styles.serviceRow}>
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
                      s.active ? styles.badgeActive : styles.badgeInactive
                    }
                  >
                    {s.active ? "Active" : "Inactive"}
                  </span>
                  <button className={btnStyles.btnGhost}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ShopPage;
