import config from "../utils/config";

const BrandLogo = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "42px",
          height: "42px",
          background: "var(--gold-bg)",
          border: "1px solid var(--gold-lo)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="1.8"
        >
          <path d="M12 2C8 2 5 5 5 8c0 4 4 8 7 10 3-2 7-6 7-10 0-3-3-6-7-6z" />
          <circle cx="12" cy="8" r="2.5" />
        </svg>
      </div>
      <div>
        <div
          style={{ fontSize: "1rem", fontWeight: 600, color: "var(--gold)" }}
        >
          {config.shopName}
        </div>
        <div
          style={{ fontSize: "0.75rem", color: "var(--t3)", marginTop: "1px" }}
        >
          Admin panel
        </div>
      </div>
    </div>
  );
};

export default BrandLogo;
