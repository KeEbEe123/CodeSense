import { Suspense } from "react";
import AuthError from "@/components/AuthError";

export default function ErrorPage() {
  return (
    <Suspense
      fallback={<p className="text-center text-gray-500">Loading...</p>}
    >
      <AuthError />
    </Suspense>
  );
}
