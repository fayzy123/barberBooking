import styles from "./LoadingState.module.css";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => {
  return (
    <section className={styles.wrapper} aria-label="Loading">
      <ul className={styles.dots} aria-hidden="true">
        <li /> <li /> <li />
      </ul>
      <p className={styles.message}>{message}</p>
    </section>
  );
};

export default LoadingState;
