import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";

interface FloatProps {
  children: React.ReactNode;
  Icon: IconType;
  buttonClassName: string;
  containerClassName: string;
}

const Float = ({
  children,
  Icon,
  buttonClassName,
  containerClassName,
}: FloatProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        divRef.current &&
        !divRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className={buttonClassName}
      >
        <Icon className="w-6 h-6" />
      </button>

      {open && (
        <div ref={divRef} className={containerClassName}>
          {children}
        </div>
      )}
    </>
  );
};

export default Float;
