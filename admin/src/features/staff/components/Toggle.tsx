import styles from "./Toggle.module.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ checked, onChange, disabled = false }: ToggleProps) => {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.input}
        disabled={disabled}
      />
      <span className={styles.slider} />
    </label>
  );
};

export default Toggle;
