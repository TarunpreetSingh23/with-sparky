"use client";

import { useEffect, useState } from "react";
import { usePWA } from "./PWAProvider";
import { X, Share2 } from "lucide-react";

export default function InstallBanner() {
  const { canInstall, installApp, isIOS } = usePWA();
  const [closed, setClosed] = useState(false);

  /* ✅ Persist close choice */
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed === "true") setClosed(true);
  }, []);

  const handleClose = () => {
    setClosed(true);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (closed) return null;

  /* ================= iOS INSTALL BANNER ================= */
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-black text-white rounded-xl p-4 shadow-xl flex items-start gap-3">
        <Share2 className="mt-1 text-blue-400" size={20} />

        <p className="text-sm flex-1 leading-relaxed">
          Install this app: tap <b>Share</b> and select{" "}
          <b>Add to Home Screen</b>
        </p>

        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Close install banner"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  /* ================= ANDROID / CHROME ================= */
  if (!canInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-black text-white rounded-xl p-4 shadow-xl flex items-center gap-4">
      <p className="text-sm font-semibold flex-1">
        Install this app for faster access
      </p>

      <button
        onClick={installApp}
        className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition"
      >
        Install
      </button>

      <button
        onClick={handleClose}
        className="p-2 rounded-full hover:bg-white/10 transition"
        aria-label="Close install banner"
      >
        <X size={18} />
      </button>
    </div>
  );
}
