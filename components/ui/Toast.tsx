"use client";
import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  /** Duration in ms before the toast auto-dismisses (default: 4000) */
  duration?: number;
}

export default function Toast({
  message,
  visible,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [show, setShow] = useState(false);

  // Animate in/out based on `visible`
  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 400); // wait for exit animation before calling onClose
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: "fixed",
        top: "1.25rem",
        left: "50%",
        transform: `translateX(-50%) translateY(${show ? "0" : "-120%"})`,
        transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
        opacity: show ? 1 : 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        backgroundColor: "#b91c1c", /* red-700 — matches your brand */
        color: "#fef3c7",           /* amber-50 */
        padding: "0.75rem 1.25rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        fontFamily: "var(--font-montserrat, sans-serif)",
        fontSize: "0.9rem",
        fontWeight: 500,
        letterSpacing: "0.02em",
        minWidth: "260px",
        maxWidth: "90vw",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      {/* Checkmark icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <circle cx="10" cy="10" r="9" stroke="#fef3c7" strokeWidth="1.5" />
        <path
          d="M6 10.5l3 3 5-6"
          stroke="#fef3c7"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span style={{ flex: 1 }}>{message}</span>

      {/* Close button */}
      <button
        onClick={() => {
          setShow(false);
          setTimeout(onClose, 400);
        }}
        aria-label="Dismiss notification"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0 0 0 0.5rem",
          color: "#fef3c7",
          opacity: 0.75,
          lineHeight: 1,
          fontSize: "1.1rem",
        }}
      >
        ✕
      </button>
    </div>
  );
}
