interface GemIconProps {
  size?: number;
  className?: string;
}

export function GemIcon({ size = 24, className }: GemIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Outer silhouette: table top → girdle → culet */}
      <polygon
        points="15,7 33,7 45,19 24,46 3,19"
        stroke="var(--gold)"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="rgba(201,168,76,0.04)"
      />
      {/* Crown facets from table corners to crown centre */}
      <line x1="15" y1="7"  x2="24" y2="17" stroke="var(--gold)" strokeWidth="0.8" opacity="0.55" />
      <line x1="33" y1="7"  x2="24" y2="17" stroke="var(--gold)" strokeWidth="0.8" opacity="0.55" />
      {/* Girdle edges to crown centre */}
      <line x1="3"  y1="19" x2="24" y2="17" stroke="var(--gold)" strokeWidth="0.7" opacity="0.4"  />
      <line x1="45" y1="19" x2="24" y2="17" stroke="var(--gold)" strokeWidth="0.7" opacity="0.4"  />
      {/* Horizontal girdle line */}
      <line x1="3"  y1="19" x2="45" y2="19" stroke="var(--gold)" strokeWidth="0.7" opacity="0.4"  />
      {/* Centre pavilion to culet */}
      <line x1="24" y1="17" x2="24" y2="46" stroke="var(--gold)" strokeWidth="0.7" opacity="0.3"  />
    </svg>
  );
}

export default function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <GemIcon size={24} />
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 13,
          letterSpacing: '3px',
          color: 'var(--t1)',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Fayzy's Cuts
      </span>
    </div>
  );
}
