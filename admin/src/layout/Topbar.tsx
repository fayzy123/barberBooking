import { getDatePill } from "../shared/utils/date";
import styles from "./Topbar.module.css";

interface TopbarProp {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const Topbar = ({ title, subtitle, actions }: TopbarProp) => {
  return (
    <header className={styles.topbar}>
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
      </div>
    </header>
  );
};

export default Topbar;
