type CountryShapeProps = {
  path: string;
  label?: string;
  className?: string;
};

const CountryShape = ({ path, label, className = "" }: CountryShapeProps) => (
  <svg
    viewBox="0 0 200 140"
    className={className}
    role={label ? "img" : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    preserveAspectRatio="xMidYMid meet"
  >
    <path
      d={path}
      fill="currentColor"
      fillRule="evenodd"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.5"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export default CountryShape;
