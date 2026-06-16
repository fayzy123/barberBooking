import { useShop } from "../../features/shop/hooks/useShop";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MINUTES = ["00", "15", "30", "45"];

const TimePicker = ({ value, onChange, disabled = false }: TimePickerProps) => {
  const { shop } = useShop();
  const [hourStr, minuteStr] = value.split(":");
  const minHour = parseInt(shop?.openTime?.split(":")[0] ?? "00");
  const maxHour = parseInt(shop?.closeTime?.split(":")[0] ?? "23");

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
