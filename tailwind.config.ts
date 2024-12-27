import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/popover.js",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#17161c",
        primary: "#66d9cc",
        foreground: "var(--foreground)",
        offwhite: "#f4ebd1",
      },
      fontFamily: {
        koulen: ["var(--font-koulen)"],
        pop: ["var(--font-poppins)"],
      },
      boxShadow: {
        glow: "0px 0px 50px -5px rgba(0, 0, 0, 0.3)",
        underline: "0px 20px 50px -10px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config;
