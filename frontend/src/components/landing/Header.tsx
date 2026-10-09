"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { NAV_MENUS, RESEARCH_FEATURE, type NavColumn } from "./nav-data";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7803 5.88971C13.0732 6.18261 13.0732 6.65748 12.7803 6.95037L8.88387 10.8468C8.39572 11.335 7.60426 11.335 7.11611 10.8468L3.21967 6.95037C2.92678 6.65748 2.92678 6.18261 3.21967 5.88971C3.51256 5.59682 3.98744 5.59682 4.28033 5.88971L7.99999 9.60938L11.7197 5.88971C12.0126 5.59682 12.4874 5.59682 12.7803 5.88971Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FeatureBlock({ column }: { column: NavColumn }) {
  if (!column.feature) return null;
  return (
    <div className="flex flex-col gap-2">
      <img src={column.feature.image} alt="" className="mb-2 w-full max-w-[13rem] rounded-card" />
      <p className="text-base leading-[1.4]">{column.feature.text}</p>
      <NavLink label={column.heading} href={column.feature.href} className="text-sm underline underline-offset-4">
        {column.feature.cta}
      </NavLink>
    </div>
  );
}

function Column({ column, last }: { column: NavColumn; last: boolean }) {
  return (
    <div className={`flex flex-col gap-8 ${last ? "" : "border-r border-ink-800 pr-8"}`}>
      <div className="flex items-center gap-2 text-ink-300">
        <img src={`/icons/${column.icon}.svg`} alt="" className="h-4 w-4" />
        <h3 className="text-sm uppercase leading-none">{column.heading}</h3>
      </div>
      {column.items && (
        <ul className="flex flex-col gap-6">
          {column.items.map((item) => (
            <li key={item.label}>
              <NavLink label={item.label} href={item.href} className="flex flex-col transition-[padding] duration-200 hover:pl-2">
                <span className="flex items-center gap-2 text-base leading-[1.4]">
                  {item.label}
                  {item.isNew && (
                    <span className="tag-new small">
                      <span>New</span>
                    </span>
                  )}
                </span>
                {item.sub && <span className="text-xs leading-[1.3] text-ink-300">{item.sub}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
      {column.more && <NavLink label={column.heading} href={column.more.href} className="text-base underline underline-offset-4">{column.more.label}</NavLink>}
      <FeatureBlock column={column} />
      {column.heading === "Templates" && (
        <>
          <div className="flex items-center gap-2 text-ink-300">
            <img src={`/icons/${RESEARCH_FEATURE.icon}.svg`} alt="" className="h-4 w-4" />
            <h3 className="text-sm uppercase leading-none">{RESEARCH_FEATURE.heading}</h3>
          </div>
          <FeatureBlock column={RESEARCH_FEATURE} />
        </>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-ink text-ink-25" onMouseLeave={() => setOpen(null)}>
      <div className="container-site flex h-[5.5rem] items-center gap-8">
        <Logo />
        <nav className="hidden lg:block">
          <ul className="flex items-center">
            {NAV_MENUS.map((menu) => (
              <li key={menu.label} onMouseEnter={() => setOpen(menu.label)}>
                <button
                  type="button"
                  className={`flex h-[5.5rem] items-center gap-2 px-1.5 text-base ${open === menu.label ? "text-purple-400" : ""}`}
                >
                  {menu.label}
                  <Chevron open={open === menu.label} />
                </button>
              </li>
            ))}
            <li onMouseEnter={() => setOpen(null)}>
              <NavLink label="Pricing" className="flex h-[5.5rem] items-center px-1.5 text-base" />
            </li>
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/forms" className="hidden px-3 text-base sm:block">
            Log in
          </Link>
          <NavLink label="Contact sales" className="btn btn-outline hidden text-base sm:inline-flex" />
          <Link href="/forms" className="btn btn-light min-h-10 min-w-0 px-5 text-base">
            Sign up
          </Link>
        </div>
      </div>
      {NAV_MENUS.map((menu) => (
        <div
          key={menu.label}
          onClick={() => setOpen(null)}
          className={`absolute inset-x-0 top-[5.5rem] border-b border-ink-800 bg-ink py-12 shadow-[0_4px_4px_#0000000a] ${open === menu.label ? "block" : "hidden"}`}
        >
          <div className="mx-auto grid max-w-[62rem] grid-cols-3 gap-8 px-8">
            {menu.columns.map((column, index) => (
              <Column key={column.heading} column={column} last={index === menu.columns.length - 1} />
            ))}
          </div>
        </div>
      ))}
    </header>
  );
}
