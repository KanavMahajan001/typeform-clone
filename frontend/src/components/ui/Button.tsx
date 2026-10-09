import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const STYLES: Record<Variant, string> = {
  primary: "bg-admin-text text-white hover:bg-black",
  secondary: "border border-admin-border bg-white text-admin-text hover:bg-admin-hover",
  ghost: "text-admin-text hover:bg-admin-hover",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md";
}

export function Button({ variant = "primary", size = "md", className = "", ...props }: Props) {
  return (
    <button
      type="button"
      className={`inline-flex flex-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${size === "sm" ? "h-8 px-3 text-sm" : "h-10 px-4 text-sm"} ${STYLES[variant]} ${className}`}
      {...props}
    />
  );
}
