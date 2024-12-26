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
      className="px-4 py-2 text-lg font-koulen bg-background text-primary rounded-lg border-primary border-solid border-2 hover:bg-primary hover:text-background hover:rounded-2xl hover:shadow-glow hover:shadow-primary transition-all duration-300"
    >
      {text}
    </Link>
  );
};

export default Button;
