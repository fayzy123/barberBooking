import { FormEvent, useState } from "react";
import styles from "./Login.module.css";
import BrandLogo from "../../shared/components/BrandLogo";
import { useAuth } from "./AuthContext";
import { loginAdmin } from "./auth.service";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    // Clear any previous errors
    setError(null);
    setLoading(true);

    try {
      // 1. Call the API with email and password
      const data = await loginAdmin({ email, password });

      // 2. Store the token and admin info in AuthContext
      login(data);

      // 3. Redirect to the bookings dashboard
      navigate("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid Credentials";
      setError(message);
    } finally {
      // 4. Set loading to false regardless of success/failure
      setLoading(false);
    }
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

        {/* Show error message if login failed */}
        {error && <div className={styles.error}>{error}</div>}

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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Signing you in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
