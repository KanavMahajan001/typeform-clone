import Link from "next/link";
import { THEME } from "@/components/form/theme";

export default function FormNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-8 text-center">
      <h1 className="text-2xl" style={{ color: THEME.question }}>
        This form isn&apos;t available
      </h1>
      <p className="mt-3 text-xl opacity-70" style={{ color: THEME.question }}>
        It may have been unpublished or the link is incorrect.
      </p>
      <Link href="/" className="mt-8 flex h-10 items-center rounded px-3.5 text-xl font-bold text-white" style={{ background: THEME.answer }}>
        Create a typeform
      </Link>
    </div>
  );
}
