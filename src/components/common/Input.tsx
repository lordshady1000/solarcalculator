"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: React.ReactNode;
  error?: string;
}

export default function Input({ label, suffix, error, className = "", ...props }: InputProps) {
  return (
    <div className={`input-group ${error ? "input-group--error" : ""} ${className}`}>
      {label && <label className="input-group__label">{label}</label>}
      <div className="input-group__wrap">
        <input className="input-group__field" {...props} />
        {suffix && <span className="input-group__suffix">{suffix}</span>}
      </div>
      {error && <span className="input-group__error">{error}</span>}
    </div>
  );
}
