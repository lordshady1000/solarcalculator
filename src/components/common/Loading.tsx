"use client";

export default function Loading({ text }: { text?: string }) {
  return (
    <div className="loading-box">
      <div className="spinner" />
      {text && <p>{text}</p>}
    </div>
  );
}
