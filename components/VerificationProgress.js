const diameter = 180;
const strokeWidth = 8;
const center = diameter / 2;
const pathRadius = center - strokeWidth / 2;

export function VerificationProgress({ label, value = 0, error }) {
  const pathRatio = getPathRatio({ value });

  // Calculate dash coordinates relative to the circle (the actual "progress" bar)
  const { circumference, offset } = getPathDimensions({ pathRadius, pathRatio });

  // Consolidate common circle properties
  const circleProps = {
    cx: center,
    cy: center,
    r: pathRadius,
    strokeWidth: strokeWidth,
    style: { fillOpacity: 0 },
  };

  return (
    <div className="relative" style={{ height: diameter, width: diameter }}>
      <svg
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={label}
        role="progressbar"
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        {/* Background circle */}
        <circle {...circleProps} className="block stroke-current text-neutral-subtle" />
        {/* Progress circle */}
        <circle
          {...circleProps}
          className={`block transition-all duration-500 ${error && 'stroke-current text-critical-bold'}`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="url(#gradient)"
          transform={`rotate(-90 ${center} ${center})`}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-bold)" />
            <stop offset="100%" stopColor="var(--color-primary-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex justify-center items-center">
        {error ? (
          // Icon: exclamation-circle
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-critical-bold"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="text-4xl sm:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-tr from-primary-bold to-primary-accent">
            {value}
            <span>%</span>
          </span>
        )}
      </div>
    </div>
  );
}

// ratio of path length, as a value between 0 and 1
function getPathRatio({ value }) {
  const clamped = Math.min(Math.max(value, 0), 100);
  return (clamped - 0) / (100 - 0);
}

// circumference: pixel value of the circle
// offset: shift backward so the gap appears at the correct distance
function getPathDimensions({ pathRatio, pathRadius }) {
  const circumference = Math.PI * 2 * pathRadius;
  const offset = (1 - pathRatio) * circumference;
  return { circumference, offset };
}
