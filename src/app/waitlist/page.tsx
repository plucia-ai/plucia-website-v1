import type { Metadata } from "next";
import WaitlistPage from "@/page/WaitlistPage";

export const metadata: Metadata = {
  title: "Join the Waitlist — Plucia",
  description: "Join the Plucia waitlist and be the first to know when we launch.",
};

export default function Page() {
  return <WaitlistPage />;
}
