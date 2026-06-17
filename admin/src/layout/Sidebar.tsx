import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../shared/components/BrandLogo";
import styles from "./Sidebar.module.css";
import { Calendar, Store, User } from "lucide-react";

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
          className={`${styles.navItem} ${location.pathname === "/" || location.pathname.startsWith("/bookings") ? styles.active : ""}`}
          onClick={() => navigate("/bookings")}
        >
          <Calendar size={15} />
          Booking
        </div>

        <div
          className={`${styles.navItem} ${location.pathname === "/staff" || location.pathname.startsWith("/staff") ? styles.active : ""}`}
          onClick={() => navigate("/staff")}
        >
          <User size={15} />
          Staff
        </div>

        <div
          className={`${styles.navItem} ${location.pathname === "/shop" || location.pathname.startsWith("/shop") ? styles.active : ""}`}
          onClick={() => navigate("/shop")}
        >
          <Store size={15} />
          Shop
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
