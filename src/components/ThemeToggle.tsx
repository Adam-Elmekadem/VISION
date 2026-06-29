"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    const next = !html.classList.contains("light");
    html.classList.toggle("light", next);
    localStorage.setItem("vision-theme", next ? "light" : "dark");
    setIsLight(next);
  };

  return (
    <button
      onClick={toggle}
      className="navbar-icon-btn"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      type="button"
    >
      {isLight ? (
        /* Moon — switch to dark */
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <path
            d="M14.5 9.5A6.5 6.5 0 1 1 7.5 2.5a5 5 0 0 0 7 7z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* Sun — switch to light */
        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="3.25" stroke="currentColor" strokeWidth="1.25" />
          <path
            d="M8.5 1v1.5M8.5 14.5V16M1 8.5h1.5M14.5 8.5H16M3.4 3.4l1.06 1.06M12.54 12.54l1.06 1.06M3.4 13.6l1.06-1.06M12.54 4.46l1.06-1.06"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
