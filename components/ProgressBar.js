export function ProgressBar({ value }) {
  return (
    // TODO: add transition class to animate
    <div className="relative h-1 sm:h-1.5 md:h-2 w-full">
      <div
        style={{ width: `${value}%` }}
        className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary-500 to-primary-accent rounded-r"
      ></div>
    </div>
  );
}
