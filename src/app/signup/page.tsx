import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Get Started — Plucia",
  description: "Create your Plucia account and tell us how you sell.",
};

export default function Page() {
  redirect("/waitlist");
}
