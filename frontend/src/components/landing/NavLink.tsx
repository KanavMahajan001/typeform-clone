"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { comingSoon } from "@/lib/links";

interface Props {
  label: string;
  href?: string;
  className?: string;
  children?: ReactNode;
}

export function NavLink({ label, href, className = "", children }: Props) {
  if (!href) {
    return (
      <button type="button" onClick={() => comingSoon(label)} className={`cursor-pointer text-left ${className}`}>
        {children ?? label}
      </button>
    );
  }
  const external = href.startsWith("http");
  return (
    <Link href={href} className={className} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children ?? label}
    </Link>
  );
}
