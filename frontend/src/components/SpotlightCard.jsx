import { useRef, useState, useCallback } from 'react';

const SpotlightCard = ({
  children,
  className = '',
  onClick,
  draggable = false,
  onDragStart,
  ...props
}) => {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
      className={`group relative overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 ${className}`}
      {...props}
    >
      {/* Dynamic Cursor Spotlight Border Glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, var(--spotlight-border, rgba(255, 255, 255, 0.25)), transparent 80%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Dynamic Cursor Spotlight Surface Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(320px circle at ${coords.x}px ${coords.y}px, var(--spotlight-color, rgba(255, 255, 255, 0.06)), transparent 70%)`,
        }}
      />

      {/* Card Contents */}
      {children}
    </div>
  );
};

export default SpotlightCard;
