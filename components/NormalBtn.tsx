import React from "react";
import Link from "next/link";

interface ButtonProps {
  text: string;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ text, href }) => {
  return (
    <Link
      href={href}
      className="text-xl font-koulen hover:border-b-2 hover:bg-gradient-to-l hover:from-primary hover:to-cyan-700 hover:text-transparent hover:bg-clip-text transition-colors duration-300"
    >
      {text}
    </Link>
  );
};

export default Button;
