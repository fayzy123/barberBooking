import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setPastHero(y > window.innerHeight);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      animate={{ opacity: pastHero ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ pointerEvents: pastHero ? "none" : "all" }}
    >
      <button className={styles.brand} onClick={() => navigate("/")}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          width={22}
          height={22}
          stroke="currentColor"
          strokeWidth={1.4}
          style={{ color: "var(--color-gold)", flexShrink: 0 }}
        >
          <polygon points="12,2 22,9 18,21 6,21 2,9" />
          <polyline points="2,9 12,14 22,9" />
          <line x1="6" y1="21" x2="12" y2="14" />
          <line x1="18" y1="21" x2="12" y2="14" />
          <line x1="2" y1="9" x2="7" y2="2" />
          <line x1="22" y1="9" x2="17" y2="2" />
          <line x1="7" y1="2" x2="12" y2="2" />
          <line x1="12" y1="2" x2="17" y2="2" />
        </svg>
        <span className={styles.brandName}>Brand Name</span>
      </button>

      <div className={styles.actions}>
        <button className={styles.btnBook} onClick={() => navigate("/book")}>
          Book
        </button>
        <button
          className={styles.btnManage}
          onClick={() => navigate("/manage")}
        >
          Manage
        </button>
      </div>
    </motion.nav>
  );
}
