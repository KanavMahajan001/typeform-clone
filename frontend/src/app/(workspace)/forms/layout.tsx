import { PlanBanner } from "@/components/workspace/PlanBanner";
import { SectionTabs } from "@/components/workspace/SectionTabs";
import { TopBar } from "@/components/workspace/TopBar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-admin-text">
      <TopBar />
      <PlanBanner />
      <SectionTabs />
      {children}
    </div>
  );
}
