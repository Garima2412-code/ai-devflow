const Logo = ({ size = 26, showWordmark = true, badge, className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-hover text-white shadow-sm ring-1 ring-white/20 shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width={Math.round(size * 0.65)}
          height={Math.round(size * 0.65)}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Git Branch & AI Node Geometry */}
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity="0.3" />
          <circle cx="6" cy="18" r="3" fill="currentColor" />
          <path d="M18 9a9 9 0 0 1-9 9" />
          <circle cx="12" cy="12" r="1.5" fill="white" />
        </svg>
      </div>

      {showWordmark && (
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-semibold tracking-tight text-text-primary text-[15px]">
            AI<span className="text-accent font-bold ml-0.5">DevFlow</span>
          </span>
          {badge && (
            <span className="px-1.5 py-0.5 text-[9.5px] font-mono font-medium rounded-full bg-surface-2 text-text-secondary border border-border">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;