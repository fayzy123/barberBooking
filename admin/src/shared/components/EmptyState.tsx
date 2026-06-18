import styles from "./EmptyState.module.css";
import { Calendar } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = "No Bookings Found",
  message = "There are no bookings found matching your filters",
}: EmptyStateProps) => {
  return (
    <section className={styles.wrapper} aria-label="No results">
      <div className={styles.icon}>
        <Calendar size={15} strokeWidth={1.8} />
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>
    </section>
  );
};

export default EmptyState;
