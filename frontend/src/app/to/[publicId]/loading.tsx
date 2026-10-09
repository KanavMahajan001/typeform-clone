import { Loader } from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white">
      <Loader compact />
    </div>
  );
}
