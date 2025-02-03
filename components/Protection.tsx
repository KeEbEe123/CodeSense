import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Protect({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.onboard) {
      router.push("/onboarding");
    }
  }, [session, status]);

  if (status === "loading") return <div>Loading...</div>;

  return <>{children}</>;
}
