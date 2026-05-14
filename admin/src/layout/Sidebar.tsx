import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../shared/components/BrandLogo";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <header className={styles.brand}>
        <BrandLogo />
      </header>

      <nav className={styles.nav}>
        <div
          className={`${styles.navItem} ${location.pathname === "/bookings" ? styles.active : ""}`}
          onClick={() => navigate("/bookings")}
        >
          Booking
        </div>

        <div
          className={`${styles.navItem} ${location.pathname === "/staff" ? styles.active : ""}`}
          onClick={() => navigate("/staff")}
        >
          Staff
        </div>

        <div
          className={`${styles.navItem} ${location.pathname === "/shop" ? styles.active : ""}`}
          onClick={() => navigate("/shop")}
        >
          Shop
        </div>
      </nav>

      <footer className={styles.footer}>
        <button className={styles.signOut}>Sign out</button>
      </footer>
    </aside>
  );
};

export default Sidebar;
