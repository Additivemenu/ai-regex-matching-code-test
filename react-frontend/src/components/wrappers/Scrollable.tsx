import React from "react";

interface ScrollableProps {
  children: React.ReactNode;
}

const Scrollable = ({ children }: ScrollableProps) => {
  return <div className="overflow-auto">{children}</div>;
};

export default Scrollable;
