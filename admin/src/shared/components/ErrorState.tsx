import styles from "./ErrorState.module.css";

interface ErrorStateProps {
  message?: string;
}

const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <section className={styles.wrapper} aria-label="Error">
      <p className={styles.message}>{message}</p>
    </section>
  );
};

export default ErrorState;
