import React from "react";

const CardHeader = ({ children, className = "" }) => {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
};

export default CardHeader;
