"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { AuthHeader, DarkButton, TextField } from "@/components/AuthUI";

export default function WaitlistPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "waitlist-page" }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error || "Please try again.");
        return;
      }

      router.push(`/congratulations?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setError("Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-white flex flex-col min-h-screen w-full">
      <AuthHeader prompt="Already joined?" linkText="Back to home" linkHref="/" />

      <div className="flex flex-1 items-start sm:items-center justify-center px-[20px] pb-[80px] pt-[48px] sm:pt-0 w-full">
        <motion.div
          className="w-full max-w-[440px]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-manrope font-semibold text-[32px] text-black tracking-[-0.05em]">
            Join the waitlist
          </h1>
          <p className="font-inter mt-[8px] text-[16px] text-[#606060] tracking-[-0.02em]">
            We&apos;re coming soon. We&apos;ll let you know.
          </p>
          <form className="flex flex-col gap-[16px] mt-[32px]" onSubmit={submit}>
            <TextField
              label="Email"
              type="email"
              placeholder="Your email address"
              value={email}
              autoFocus
              required
              onChange={(event) => {
                setEmail(event.target.value);
                setError("");
              }}
            />
            {error && (
              <p className="font-inter text-[#d03030] text-[13px]">{error}</p>
            )}
            <DarkButton
              type="submit"
              disabled={!email.trim() || submitting}
              className="w-full"
            >
              {submitting ? "Joining…" : "Join Waitlist"}
            </DarkButton>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
