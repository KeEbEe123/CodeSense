"use client";
import { useState, useEffect } from "react";

const PATCH_VERSION = "1.0.3"; // Update this when you release a new patch

export default function PatchNotes() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seenVersion = localStorage.getItem("patchNotesVersion");
    if (seenVersion !== PATCH_VERSION) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("patchNotesVersion", PATCH_VERSION);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Patch Notes - {PATCH_VERSION}
        </h2>
        <p className="font-bold">🚀 New Features:</p>
        <ul className="list-disc ml-5">
          <li>Fixed onboarding issues</li>
          <li>Users can now add their graduation year in their profile page (profile -> edit profile)</li>
        </ul>
        <button
          className="mt-4 bg-pink-600 font-pop text-white px-4 py-2 rounded"
          onClick={handleClose}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
