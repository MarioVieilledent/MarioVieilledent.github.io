import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2 bg-sky-400 hover:bg-sky-500 cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
