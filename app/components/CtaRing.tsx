/**
 * Decorative scroll-triggered ring: a gradient navy line draws around the
 * parent button while a glowing bright head leads the stroke, then fades.
 * Parent must be `relative`; animation is driven externally via GSAP,
 * targeting `.cta-ring` and `.cta-ring-head`.
 */
export default function CtaRing() {
  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cta-ring-navy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="50%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#155E75" />
        </linearGradient>
        <filter id="cta-ring-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Trail: gradient navy line that draws around the perimeter */}
      <rect
        className="cta-ring"
        x="0"
        y="0"
        width="100%"
        height="100%"
        pathLength={1}
        fill="none"
        stroke="url(#cta-ring-navy)"
        strokeWidth={4}
        style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
      />
      {/* Head: short glowing segment leading the draw */}
      <rect
        className="cta-ring-head"
        x="0"
        y="0"
        width="100%"
        height="100%"
        pathLength={1}
        fill="none"
        stroke="#67E8F9"
        strokeWidth={6}
        strokeLinecap="round"
        filter="url(#cta-ring-glow)"
        style={{ strokeDasharray: "0.07 0.93", strokeDashoffset: 1, opacity: 0 }}
      />
    </svg>
  );
}
