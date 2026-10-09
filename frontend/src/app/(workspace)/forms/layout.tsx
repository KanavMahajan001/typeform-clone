import { Sidebar } from "@/components/workspace/Sidebar";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white text-admin-text">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
