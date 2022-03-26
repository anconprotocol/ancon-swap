import { useEffect, useState } from "react";

function useDarkMode() {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined"
      ? localStorage.getItem("theme")
      : "light"
  );

  const colorTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === null) {
        localStorage.setItem("theme", "light");
        const root = window.document.documentElement;
        root.classList.remove(colorTheme);
        root.classList.add("light");
        return;
      }
      console.log("setting", theme);
      localStorage.setItem("theme", theme);
    }
    const root = window.document.documentElement;

    root.classList.remove(colorTheme);
    root.classList.add(theme);
  }, [theme]);

  return { colorTheme, setTheme };
}

export default useDarkMode;
