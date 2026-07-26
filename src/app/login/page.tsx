import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In — Plucia",
  description: "Sign in to your Plucia workspace.",
};

export default function Page() {
  redirect("/waitlist");
}
