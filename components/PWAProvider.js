"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PWAContext = createContext(null);

export function PWAProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // ✅ iOS detection (ADD HERE)
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !window.matchMedia("(display-mode: standalone)").matches;

    setIsIOS(ios);

    // ✅ Android / Chrome install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setCanInstall(false);
  };

  return (
    <PWAContext.Provider
      value={{
        canInstall,
        installApp,
        isIOS, // 👈 expose this
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export const usePWA = () => useContext(PWAContext);
