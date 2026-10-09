import { LogoIcon } from "@/components/landing/Logo";

export function Loader({ text }: { text: string }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-10 bg-white text-admin-text">
      <LogoIcon className="loader-logo h-[7.5rem] w-[13.5rem]" />
      <p className="loader-text text-3xl">{text}</p>
    </div>
  );
}
