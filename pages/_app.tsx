import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import Navbar from "../components/Navbar";
import { Koulen } from "next/font/google";

const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
  subsets: ["latin"],
});

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <main className={koulen.className}>
        <Navbar />
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
