import { useState } from "react";
import { Shift, Staff } from "../staff.types";
import styles from "./AvailabilityGrid.module.css";
import btnStyles from "../../../shared/utils/buttons.module.css";
import Toggle from "./Toggle";

interface StaffAvailabilityGrid {
  staff: Staff;
}

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS: Record<string, string> = {
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
  sun: "Sun",
};

const AvailabilityGrid = ({ staff }: StaffAvailabilityGrid) => {
  const [shifts, setShifts] = useState<Omit<Shift, "id" | "staffId">[]>(
    DAYS.map((day) => {
      const existing = staff.shifts?.find((s) => s.day === day);
      return (
        existing ?? {
          day,
          startTime: "09:00",
          endTime: "17:00",
          breakStart: null,
          active: false,
        }
      );
    }),
  );
  return (
    <>
      <section className={styles.wrapper}>
        <table>
          <thead>
            <tr>
              <th></th>
              {DAYS.map((day) => (
                <th key={day} className={styles.dayHeader}>
                  {DAY_LABELS[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={styles.rowLabel}>Start</td>
              {shifts.map((shift) => (
                <td key={shift.day}>{shift.active ? shift.startTime : "-"}</td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>End</td>
              {shifts.map((shift) => (
                <td key={shift.day}>{shift.active ? shift.endTime : "-"}</td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Break</td>
              {shifts.map((shift) => (
                <td key={shift.day}>
                  {shift.active ? (shift.breakStart ?? "-") : "-"}
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Working</td>
              {shifts.map((shift) => (
                <td key={shift.day}>
                  <Toggle
                    checked={shift.active}
                    onChange={(val) => {
                      setShifts((prev) =>
                        prev.map((s) =>
                          s.day === shift.day ? { ...s, active: val } : s,
                        ),
                      );
                    }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
};

export default AvailabilityGrid;
