import styles from "./TimePicker.module.css";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const MINUTES = ["00", "15", "30", "45"];

// TODO: Phase 5: fetch min/max from shop settings instead of hardcoded values
const TimePicker = ({
  value,
  onChange,
  min = "09",
  max = "21",
  disabled = false,
}: TimePickerProps) => {
  const [hourStr, minuteStr] = value.split(":");
  const minHour = parseInt(min);
  const maxHour = parseInt(max);

  const hours = Array.from({ length: maxHour - minHour + 1 }, (_, i) =>
    String(minHour + i).padStart(2, "0"),
  );

  const handleHourChange = (h: string) => onChange(`${h}:${minuteStr}`);
  const handleMinuteChange = (m: string) => onChange(`${hourStr}:${m}`);

  return (
    <span className={`${styles.picker} ${disabled ? styles.disabled : ""}`}>
      <select
        value={hourStr}
        onChange={(e) => handleHourChange(e.target.value)}
        disabled={disabled}
        className={styles.select}
      >
        {hours.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className={styles.sep}>:</span>
      <select
        value={minuteStr}
        onChange={(e) => handleMinuteChange(e.target.value)}
        disabled={disabled}
        className={styles.select}
      >
        {MINUTES.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </span>
  );
};

export default TimePicker;
