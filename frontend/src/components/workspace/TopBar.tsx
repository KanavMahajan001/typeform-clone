"use client";

import { LogoIcon } from "@/components/landing/Logo";
import { Button } from "@/components/ui/Button";
import { BrushIcon, ChevronDownIcon, HelpIcon, IntegrationsIcon } from "@/components/ui/Icons";
import { comingSoon } from "@/lib/links";

const soon = (feature: string) => () => comingSoon(feature);

export function TopBar() {
  return (
    <header className="flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <LogoIcon className="h-5 w-9" />
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#5c8fd6] text-lg font-medium text-white">K</span>
        <button type="button" onClick={soon("Account switching")} className="flex items-center gap-1 text-base font-medium">
          Kanav Mahajan
          <ChevronDownIcon />
        </button>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" onClick={soon("Integrations")}>
          <IntegrationsIcon width={18} height={18} />
          Integrations
        </Button>
        <Button variant="ghost" onClick={soon("Brand kit")}>
          <BrushIcon width={18} height={18} />
          Brand kit
        </Button>
        <Button variant="ghost" aria-label="Help" onClick={soon("Help center")} className="px-2">
          <HelpIcon width={20} height={20} />
        </Button>
        <span className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#dde8f7] text-sm font-medium text-[#1f4e8c]">
          KM
        </span>
      </div>
    </header>
  );
}
