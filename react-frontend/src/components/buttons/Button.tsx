import React from "react";
import { cn } from "../../libs/util";

interface IButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
}

const Button = ({ children, onClick, className, isLoading }: IButtonProps) => {
  return (
    // TODO: use cn to apply className conditionally
    <button
      className={cn("bg-blue-500 text-white p-2 rounded-sm min-w-16 hover:bg-blue-700", className)}
      onClick={onClick}
    >
      {!isLoading && children}
      {isLoading && "..."}
    </button>
  );
};

export default Button;
