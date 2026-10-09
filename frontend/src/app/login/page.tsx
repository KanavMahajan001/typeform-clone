import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/AuthPage";

export const metadata: Metadata = { title: "Log in | Typeform" };

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
