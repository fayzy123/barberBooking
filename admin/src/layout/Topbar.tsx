import { LogOut } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";
import { getDatePill } from "../shared/utils/date";
import styles from "./Topbar.module.css";

interface TopbarProp {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backButton?: React.ReactNode;
}

const Topbar = ({ title, subtitle, actions, backButton }: TopbarProp) => {
  const { logout } = useAuth();

  return (
    <header className={styles.topbar}>
      {backButton}
      <span className={styles.title}>{title}</span>
      {subtitle && (
        <>
          <div className={styles.sep} />
          <span className={styles.subtitle}>{subtitle}</span>
        </>
      )}
      <div className={styles.right}>
        {actions}
        <span className={styles.pill}>{getDatePill()}</span>
        <button className={styles.signOut} onClick={logout}>
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
