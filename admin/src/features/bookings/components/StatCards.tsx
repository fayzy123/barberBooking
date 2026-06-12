import { Booking } from "../booking.types";
import styles from "./StatCards.module.css";

interface StatCardsProps {
  totalToday: number;
  confirmed: number;
  cancelled: number;
  nextAppointment: Booking | null;
  nextAppointmentTime: string | null;
  today: string;
}

const StatCards = ({
  totalToday,
  confirmed,
  cancelled,
  nextAppointment,
  nextAppointmentTime,
  today,
}: StatCardsProps) => {
  return (
    <section className={styles.grid}>
      <article className={`${styles.card} ${styles.highlight}`}>
        <span className={styles.label}>Today's Booking</span>
        <span className={`${styles.value} ${styles.highlightValue}`}>
          {totalToday}
        </span>
        <span className={styles.label}>{today}</span>
      </article>

      <article className={styles.card}>
        <span className={styles.label}>Confirmed Bookings</span>
        <span className={styles.value}>{confirmed}</span>
        <span className={styles.metaGreen}>Active</span>
      </article>

      <article className={styles.card}>
        <span className={styles.label}>Cancelled Bookings</span>
        <span className={styles.value}>{cancelled}</span>
        <span className={styles.metaRed}>Cancelled</span>
      </article>

      <article className={styles.card}>
        <span className={styles.label}>Next Appointment</span>
        <span className={styles.value}>
          {nextAppointment ? nextAppointmentTime : "None"}
        </span>
        <span className={styles.meta}>
          {nextAppointment ? nextAppointment.Staff.firstName : "None"}
        </span>
      </article>
    </section>
  );
};

export default StatCards;
