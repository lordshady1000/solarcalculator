"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "outline-light" | "ghost" | "purple" | "green";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
}

export default function Button({ children, variant = "primary", size = "md", loading, fullWidth, glow, icon, disabled, className = "", ...props }: ButtonProps) {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    loading && "btn--loading",
    fullWidth && "btn--full",
    glow && "glow-btn",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="btn__spinner" />}
      {!loading && icon}
      {children}
    </button>
  );
}
