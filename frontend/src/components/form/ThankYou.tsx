import Link from "next/link";
import { THEME } from "./theme";

export function ThankYou({ preview = false }: { preview?: boolean }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <h1 className="text-2xl leading-8" style={{ color: THEME.question }}>
        Thanks for completing this typeform
      </h1>
      <p className="mt-3 text-xl opacity-70" style={{ color: THEME.question }}>
        Now <em>create your own</em> — it&apos;s free, easy, &amp; beautiful
      </p>
      {preview ? (
        <span className="mt-8 flex h-10 items-center rounded px-3.5 text-xl font-bold text-white" style={{ background: THEME.answer }}>
          Create a <em className="ml-1">typeform</em>
        </span>
      ) : (
        <Link href="/" className="mt-8 flex h-10 items-center rounded px-3.5 text-xl font-bold text-white" style={{ background: THEME.answer }}>
          Create a <em className="ml-1">typeform</em>
        </Link>
      )}
    </div>
  );
}
