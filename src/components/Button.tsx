import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button
      className="px-6 py-3 bg-sky-400 hover:bg-sky-500 cursor-pointer"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
