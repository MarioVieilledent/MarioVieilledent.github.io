import type { ReactNode } from "react";
import { useIsMobile } from "../utils/isMobileHook";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={
        isMobile
          ? "flex flex-col"
          : "flex flex-col max-w-6xl mx-auto gap-8 px-8"
      }
    >
      {children}
    </div>
  );
};

export default PageWrapper;
