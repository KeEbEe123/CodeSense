"use client";
import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    async function getLoader() {
      const { infinity } = await import("ldrs");
      infinity.register();
    }
    getLoader();
  }, []);
  return (
    // Default values shown
    <l-infinity
      size="150"
      stroke="20"
      stroke-length="0.21"
      bg-opacity="0.1"
      speed="1.3"
      color="#66d9cc"
    ></l-infinity>
  );
}
