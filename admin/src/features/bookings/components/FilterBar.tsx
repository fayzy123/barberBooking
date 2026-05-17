import { Staff } from "../../staff/hooks/useStaff";
import { Filters } from "../booking.types";

interface FilterBarProps {
  filters: Filters;
  staff: Staff[];
  onFilterChange: (key: keyof Filters, value: string) => void;
}

const FilterBar = ({ filters, staff, onFilterChange }: FilterBarProps) => {
  return (
    <div>
      <input
        type="date"
        value={filters.date}
        onChange={(e) => onFilterChange("date", e.target.value)}
      ></input>
      <select
        value={filters.staffId}
        onChange={(e) => onFilterChange("staffId", e.target.value)}
      >
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <select>
        <option value="">All</option>
        <option value="BOOKED">Booked</option>
        <option value="CANCELLED">Cancelled</option>
      </select>
    </div>
  );
};

export default FilterBar;
