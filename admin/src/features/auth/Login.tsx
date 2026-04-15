import { FormEvent, useState } from "react";
import styles from "./Login.module.css";
import BrandLogo from "../../shared/components/BrandLogo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("Submitted");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <BrandLogo />
        </div>

        <div className={styles.title}>Sign in</div>
        <div className={styles.subtitle}>
          Enter your login details to continue
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              className={styles.input}
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              className={styles.input}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
            />
          </div>

          <button className={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
