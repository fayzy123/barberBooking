import { useNavigate } from "react-router-dom";
import { Booking } from "../booking.types";
import styles from "./BookingsTable.module.css";

interface BookingsTableProps {
  bookings: Booking[];
}

const BookingsTable = ({ bookings }: BookingsTableProps) => {
  const navigate = useNavigate();

  return (
    <figure className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Time</th>
            <th>Duration</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Staff</th>
            <th>Status</th>
            <th>Ref</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr
              key={b.id}
              onClick={() => {
                if (b.status === "CANCELLED") return;
                navigate(`/bookings/${b.id}`);
              }}
              className={b.status === "CANCELLED" ? styles.cancelledRow : ""}
            >
              <td className={styles.primary}>
                {new Date(b.startTime).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td>{b.Service.durationMinutes} mins</td>
              <td className={styles.primary}>{b.customerName}</td>
              <td>{b.Service.name}</td>
              <td>{b.Staff.name}</td>
              <td>
                <span
                  className={
                    b.status === "BOOKED" ? styles.badgeGreen : styles.badgeRed
                  }
                >
                  {b.status}
                </span>
              </td>
              <td className={styles.ref}>{b.ref}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

export default BookingsTable;
