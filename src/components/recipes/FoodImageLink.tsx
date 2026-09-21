import type { MouseEvent, ReactNode } from "react";
import { foodImageUrl } from "../../utils/foodImages";

interface FoodImageLinkProps {
  filename: string;
  label: string;
  children: ReactNode;
  className?: string;
}

const FoodImageLink = ({
  filename,
  label,
  children,
  className = "",
}: FoodImageLinkProps) => {
  const stopCardNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return (
    <a
      href={foodImageUrl(filename)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — open full-size image in a new tab`}
      className={`block cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${className}`}
      onClick={stopCardNavigation}
    >
      {children}
    </a>
  );
};

export default FoodImageLink;
