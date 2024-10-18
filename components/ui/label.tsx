import React from 'react';

export const Label = ({ htmlFor, children, className = "" }:any) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium  ${className}`}>
      {children}
    </label>
  );
};
