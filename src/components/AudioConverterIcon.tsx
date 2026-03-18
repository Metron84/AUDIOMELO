export function AudioConverterIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Left: incoming waveform (multiple bars) */}
      <path d="M8 16v16M12 12v24M16 18v12M20 14v20M24 16v16" />
      {/* Arrow */}
      <path d="M28 24h8M32 20v8l4-4" strokeWidth="2" />
      {/* Right: single bar / compressed MP3 feel */}
      <path d="M40 14v20" strokeWidth="2" />
    </svg>
  );
}
