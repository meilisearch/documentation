import { useEffect, useState } from "react";

const isDark = () => document.documentElement.classList.contains("dark");

/** Mirrors Mintlify's `html.dark` class. */
export function useDarkMode(): boolean {
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}
