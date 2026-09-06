import { useCallback, useEffect, useState } from "react";

export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function usePathname(): {
  pathname: string;
  navigate: (to: string) => void;
} {
  const [pathname, setPathname] = useState(() =>
    normalizePath(window.location.pathname),
  );

  useEffect(() => {
    function onPop() {
      setPathname(normalizePath(window.location.pathname));
    }

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const next = normalizePath(to);
    if (normalizePath(window.location.pathname) === next) {
      return;
    }
    window.history.pushState(null, "", next);
    setPathname(next);
  }, []);

  return { pathname, navigate };
}
