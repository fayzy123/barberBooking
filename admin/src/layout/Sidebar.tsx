import BrandLogo from "../shared/components/BrandLogo";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <header className={styles.brand}>
        <BrandLogo />
      </header>

      <nav className={styles.nav}>
        <div className={styles.navItem}>Booking</div>
        <div className={styles.navItem}>Staff</div>
        <div className={styles.navItem}>Shop</div>
      </nav>

      <footer className={styles.footer}>
        <button className={styles.signOut}>Sign out</button>
      </footer>
    </aside>
  );
};

export default Sidebar;
