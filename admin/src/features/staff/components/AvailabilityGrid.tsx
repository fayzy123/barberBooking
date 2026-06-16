import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TimePicker from "../../../shared/components/TimePicker";
import btnStyles from "../../../shared/utils/buttons.module.css";
import { Shift, Staff } from "../staff.types";
import styles from "./AvailabilityGrid.module.css";
import Toggle from "./Toggle";
import { useShop } from "../../shop/hooks/useShop";

interface StaffAvailabilityGrid {
  staff: Staff;
  staffActive: boolean;
  onShiftChange?: () => void;
  onActiveDaysChange?: (hasActiveDays: boolean) => void;
}

export interface AvailabilityGridHandle {
  getShifts: () => Omit<Shift, "id" | "staffId">[];
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

const AvailabilityGrid = forwardRef<
  AvailabilityGridHandle,
  StaffAvailabilityGrid
>(({ staff, staffActive, onShiftChange, onActiveDaysChange }, ref) => {
  const { shop } = useShop();
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

  useImperativeHandle(ref, () => ({
    getShifts: () => shifts,
  }));

  const prevStaffActive = useRef(staffActive);

  useEffect(() => {
    if (!staffActive) {
      setShifts((prev) => prev.map((s) => ({ ...s, active: false })));
    }
  }, [staffActive]);

  useEffect(() => {
    const hasActiveDays = shifts.some((s) => s.active);
    if (hasActiveDays !== prevStaffActive.current) {
      prevStaffActive.current = hasActiveDays;
      onActiveDaysChange?.(hasActiveDays);
    }
  }, [shifts]);

  const updateShifts = (
    updater: (
      prev: Omit<Shift, "id" | "staffId">[],
    ) => Omit<Shift, "id" | "staffId">[],
  ) => {
    onShiftChange?.();
    setShifts(updater);
  };

  return (
    <>
      <section className={styles.wrapper}>
        <table>
          <thead>
            <tr>
              <th>Shift Schedule</th>
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
                <td key={shift.day}>
                  {shift.active ? (
                    <TimePicker
                      value={shift.startTime}
                      onChange={(val) =>
                        updateShifts((prev) =>
                          prev.map((s) =>
                            s.day === shift.day ? { ...s, startTime: val } : s,
                          ),
                        )
                      }
                    />
                  ) : (
                    "-"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>End</td>
              {shifts.map((shift) => (
                <td key={shift.day}>
                  {shift.active ? (
                    <TimePicker
                      value={shift.endTime}
                      onChange={(val) =>
                        updateShifts((prev) =>
                          prev.map((s) =>
                            s.day === shift.day ? { ...s, endTime: val } : s,
                          ),
                        )
                      }
                    />
                  ) : (
                    "-"
                  )}
                </td>
              ))}
            </tr>

            <tr>
              <td className={styles.rowLabel}>Break</td>
              {shifts.map((shift) => (
                <td key={shift.day}>
                  {shift.active ? (
                    shift.breakStart !== null ? (
                      <>
                        <TimePicker
                          value={shift.breakStart}
                          onChange={(val) =>
                            updateShifts((prev) =>
                              prev.map((s) =>
                                s.day === shift.day
                                  ? { ...s, breakStart: val }
                                  : s,
                              ),
                            )
                          }
                        />
                        <button
                          className={btnStyles.btnAddTime}
                          onClick={() =>
                            updateShifts((prev) =>
                              prev.map((s) =>
                                s.day === shift.day
                                  ? { ...s, breakStart: null }
                                  : s,
                              ),
                            )
                          }
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        className={btnStyles.btnAddTime}
                        onClick={() =>
                          updateShifts((prev) =>
                            prev.map((s) =>
                              s.day === shift.day
                                ? { ...s, breakStart: "12:00" }
                                : s,
                            ),
                          )
                        }
                      >
                        + Add
                      </button>
                    )
                  ) : (
                    "-"
                  )}
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
                      updateShifts((prev) =>
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
});

export default AvailabilityGrid;
