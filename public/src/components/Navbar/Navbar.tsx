import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import styles from "./Navbar.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null!);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Background tint: runs on every scroll tick (fine for a boolean state)
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hide/show: GSAP ScrollTrigger reliably syncs with Lenis
    const st = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top", // when hero's bottom edge hits viewport top
      onEnter: () => {
        gsap.to(navRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (navRef.current) navRef.current.style.pointerEvents = "none";
          },
        });
      },
      onLeaveBack: () => {
        if (navRef.current) navRef.current.style.pointerEvents = "all";
        gsap.to(navRef.current, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      },
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      st.kill();
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
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
    </nav>
  );
}
