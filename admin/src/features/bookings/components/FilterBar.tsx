import { Staff } from "../../staff/hooks/useStaff";
import { Filters } from "../booking.types";
import styles from "./FilterBar.module.css";

interface FilterBarProps {
  filters: Filters;
  staff: Staff[];
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const FilterBar = ({ filters, staff, onFilterChange }: FilterBarProps) => {
  return (
    <section className={styles.container}>
      <label className={styles.label} htmlFor="dateFilter">
        Date
      </label>
      <input
        id="dateFilter"
        className={styles.datePicker}
        type="date"
        value={filters.date}
        onChange={(e) => onFilterChange("date", e.target.value)}
      ></input>

      <label className={styles.label} htmlFor="staffFilter">
        Staff
      </label>
      <select
        id="staffFilter"
        className={styles.dropdown}
        value={filters.staffId}
        onChange={(e) => onFilterChange("staffId", e.target.value)}
      >
        <option className={styles.option} value="">
          All Staff
        </option>
        {staff.map((s) => (
          <option className={styles.option} key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <label className={styles.label} htmlFor="statusFilter">
        Status
      </label>
      <select
        id="statusFilter"
        className={styles.dropdown}
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
      >
        <option className={styles.option} value="">
          All
        </option>
        <option className={styles.option} value="BOOKED">
          Booked
        </option>
        <option className={styles.option} value="CANCELLED">
          Cancelled
        </option>
      </select>
    </section>
  );
};

export default FilterBar;
