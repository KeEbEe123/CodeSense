import { Koulen } from "next/font/google";
import Navbar from "../components/Navbar";

const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
});

import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={koulen.className}>
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
}
