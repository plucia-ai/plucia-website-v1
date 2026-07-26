"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AuthHeader, DarkButton, TextField } from "@/components/AuthUI";

/**
 * Login page. There's no auth backend yet (the product is in early access),
 * so submitting shows an honest invite-only notice that routes people to
 * signup instead of silently failing.
 */
export default function LoginPage() {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState(false);

  const submit = () => {
    if (!email.trim() || !password) return;
    setChecking(true);
    setNotice(false);
    setTimeout(() => {
      setChecking(false);
      setNotice(true);
    }, 700);
  };

  return (
    <main className="bg-white flex flex-col min-h-screen w-full">
      <AuthHeader prompt="New to Plucia?" linkText="Get Started" linkHref="/waitlist" />

      <div className="flex flex-1 items-start sm:items-center justify-center px-[20px] pb-[80px] pt-[48px] sm:pt-0 w-full">
        <motion.div
          className="w-full max-w-[440px]"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-manrope font-semibold text-[32px] text-black tracking-[-0.05em]">
            Welcome back
          </h1>
          <p className="font-inter mt-[8px] text-[16px] text-[#606060] tracking-[-0.02em]">
            Sign in to your Plucia workspace.
          </p>
          <form
            className="flex flex-col gap-[16px] mt-[32px]"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <TextField
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              autoFocus
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {notice && (
              <div className="bg-[#e7ffe5] border border-[#34a853] border-solid font-inter px-[16px] py-[12px] rounded-[10px] text-[#202020] text-[14px]">
                Plucia is in early access and accounts are invite-only for now.{" "}
                <Link href="/waitlist" className="font-semibold underline underline-offset-4">
                  Get Started
                </Link>{" "}
                to join.
              </div>
            )}
            <DarkButton type="submit" disabled={!email.trim() || !password || checking} className="w-full">
              {checking ? "Signing in…" : "Sign In"}
            </DarkButton>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
