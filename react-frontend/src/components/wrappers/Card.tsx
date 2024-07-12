import React, { Children } from "react";

interface ICardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const Card = ({ children, style, className }: ICardProps) => {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "8px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",

        ...style,
      }}
      className={className}
    >
      {children}
    </div>
  );
};

export default Card;
