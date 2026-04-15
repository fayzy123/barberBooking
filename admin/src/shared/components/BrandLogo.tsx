import config from "../utils/config";

const BrandLogo = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "32px",
          height: "32px",
          background: "var(--gold-bg)",
          border: "1px solid var(--gold-lo)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <svg
          width="14"
          height="14"
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
          style={{ fontSize: "15px", fontWeight: 600, color: "var(--gold)" }}
        >
          {config.shopName}
        </div>
        <div style={{ fontSize: "11px", color: "var(--t3)", marginTop: "1px" }}>
          Admin panel
        </div>
      </div>
    </div>
  );
};

export default BrandLogo;
