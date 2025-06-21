import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  style?: string;
}

const Section = ({ children, style }: SectionProps) => {
  return (
    <div className={`flex w-full p-4 justify-center ${style}`}>
      <div className="w-full max-w-240 items-center gap-2">{children}</div>
    </div>
  );
};

export default Section;
