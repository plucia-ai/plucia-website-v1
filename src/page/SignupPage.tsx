"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthHeader, DarkButton, TextField } from "@/components/AuthUI";

/**
 * Multi-step signup: email → 6-digit verification code → three onboarding
 * questions (role, company size, sales platforms) → done. Front-end only —
 * there's no auth backend yet, so any complete code "verifies" and answers
 * are stashed in localStorage for later wiring.
 */

type Step = "email" | "code" | "role" | "size" | "platforms" | "done";

const ROLES = ["Designer", "Engineer", "Business Owner", "Startup Founder", "Sales Person", "Marketer", "Other"];
const SIZES = ["Just me", "2–10", "11–50", "51–200", "201–1,000", "1,000+"];
const PLATFORMS = ["LinkedIn", "Instagram", "WhatsApp", "Salesforce", "Slack", "Microsoft Teams", "Google Meet", "Facebook", "Cold Calling"];

const QUESTION_STEPS: Step[] = ["role", "size", "platforms"];

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border border-solid cursor-pointer font-inter px-[16px] py-[13px] rounded-[10px] text-[15px] text-left transition-colors duration-200 ${
        selected
          ? "bg-[#202020] border-[#202020] text-white"
          : "bg-white border-[rgba(0,0,0,0.12)] text-[#202020] hover:border-[#202020]"
      }`}
    >
      {label}
    </button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [resent, setResent] = useState(false);
  const [role, setRole] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  const codeComplete = code.every((c) => c !== "");
  const questionIndex = QUESTION_STEPS.indexOf(step);

  const submitEmail = () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setStep("code");
  };

  const setCodeDigit = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const onCodePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    e.preventDefault();
    const next = Array(6).fill("");
    digits.split("").forEach((d, i) => (next[i] = d));
    setCode(next);
    codeRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  const finish = () => {
    try {
      localStorage.setItem(
        "plucia-onboarding",
        JSON.stringify({ email: email.trim(), role, companySize, platforms, completedAt: new Date().toISOString() })
      );
    } catch {
      // localStorage unavailable (private mode) — answers just aren't persisted
    }
    setStep("done");
  };

  const stepMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, x: 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -28 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <main className="bg-white flex flex-col min-h-screen w-full">
      <AuthHeader prompt="Already have an account?" linkText="Sign in" linkHref="/waitlist" />

      <div className="flex flex-1 items-start sm:items-center justify-center px-[20px] pb-[80px] pt-[48px] sm:pt-0 w-full">
        <div className="w-full max-w-[480px]">
          {/* progress — only over the three questions */}
          {questionIndex >= 0 && (
            <div className="flex flex-col gap-[10px] mb-[32px]">
              <p className="font-inter text-[13px] text-[#606060]">Step {questionIndex + 1} of 3</p>
              <div className="bg-[#ececec] h-[4px] overflow-hidden rounded-full w-full">
                <div
                  className="bg-[#202020] h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{ width: `${((questionIndex + 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div key="email" {...stepMotion}>
                <h1 className="font-manrope font-semibold text-[32px] text-black tracking-[-0.05em]">
                  Create your account
                </h1>
                <p className="font-inter mt-[8px] text-[16px] text-[#606060] tracking-[-0.02em]">
                  Start selling smarter with Plucia.
                </p>
                <form
                  className="flex flex-col gap-[16px] mt-[32px]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitEmail();
                  }}
                >
                  <TextField
                    label="Work email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    autoFocus
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && <p className="font-inter text-[#d03030] text-[13px]">{emailError}</p>}
                  <DarkButton type="submit" className="w-full">Continue</DarkButton>
                </form>
              </motion.div>
            )}

            {step === "code" && (
              <motion.div key="code" {...stepMotion}>
                <h1 className="font-manrope font-semibold text-[32px] text-black tracking-[-0.05em]">
                  Check your inbox
                </h1>
                <p className="font-inter mt-[8px] text-[16px] text-[#606060] tracking-[-0.02em]">
                  We sent a 6-digit code to <span className="font-medium text-[#202020]">{email.trim()}</span>
                </p>
                <form
                  className="flex flex-col gap-[24px] mt-[32px]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (codeComplete) setStep("role");
                  }}
                >
                  <div className="flex gap-[10px] justify-between" onPaste={onCodePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          codeRefs.current[i] = el;
                        }}
                        value={digit}
                        autoFocus={i === 0}
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        aria-label={`Digit ${i + 1}`}
                        onChange={(e) => setCodeDigit(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !code[i] && i > 0) codeRefs.current[i - 1]?.focus();
                        }}
                        className="bg-white border border-[rgba(0,0,0,0.12)] border-solid font-inter font-semibold h-[60px] outline-none rounded-[10px] text-[#202020] text-[22px] text-center focus:border-[#202020] focus:ring-2 focus:ring-[#202020]/10 transition-colors w-full max-w-[64px]"
                      />
                    ))}
                  </div>
                  <DarkButton type="submit" disabled={!codeComplete} className="w-full">Verify</DarkButton>
                </form>
                <div className="flex font-inter items-center justify-between mt-[20px] text-[14px]">
                  <button
                    type="button"
                    className="cursor-pointer text-[#606060] hover:text-[#202020] transition-colors"
                    onClick={() => {
                      setCode(Array(6).fill(""));
                      setStep("email");
                    }}
                  >
                    Use a different email
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer font-medium text-[#202020] underline underline-offset-4"
                    onClick={() => setResent(true)}
                  >
                    {resent ? "Code sent!" : "Resend code"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === "role" && (
              <motion.div key="role" {...stepMotion}>
                <h1 className="font-manrope font-semibold text-[28px] text-black tracking-[-0.05em]">
                  You are a…
                </h1>
                <p className="font-inter mt-[8px] text-[15px] text-[#606060] tracking-[-0.02em]">
                  This helps us tailor Plucia to how you work.
                </p>
                <div className="grid gap-[10px] grid-cols-1 sm:grid-cols-2 mt-[28px]">
                  {ROLES.map((r) => (
                    <OptionButton
                      key={r}
                      label={r}
                      selected={role === r}
                      onClick={() => {
                        setRole(r);
                        setTimeout(() => setStep("size"), 250);
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {step === "size" && (
              <motion.div key="size" {...stepMotion}>
                <h1 className="font-manrope font-semibold text-[28px] text-black tracking-[-0.05em]">
                  How big is your company?
                </h1>
                <p className="font-inter mt-[8px] text-[15px] text-[#606060] tracking-[-0.02em]">
                  Team size, including you.
                </p>
                <div className="grid gap-[10px] grid-cols-2 sm:grid-cols-3 mt-[28px]">
                  {SIZES.map((s) => (
                    <OptionButton
                      key={s}
                      label={s}
                      selected={companySize === s}
                      onClick={() => {
                        setCompanySize(s);
                        setTimeout(() => setStep("platforms"), 250);
                      }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="cursor-pointer font-inter mt-[24px] text-[#606060] text-[14px] hover:text-[#202020] transition-colors"
                  onClick={() => setStep("role")}
                >
                  ← Back
                </button>
              </motion.div>
            )}

            {step === "platforms" && (
              <motion.div key="platforms" {...stepMotion}>
                <h1 className="font-manrope font-semibold text-[28px] text-black tracking-[-0.05em]">
                  Where do you run your sales?
                </h1>
                <p className="font-inter mt-[8px] text-[15px] text-[#606060] tracking-[-0.02em]">
                  Pick all the platforms you use — Plucia connects to them.
                </p>
                <div className="flex flex-wrap gap-[10px] mt-[28px]">
                  {PLATFORMS.map((p) => {
                    const selected = platforms.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          setPlatforms(selected ? platforms.filter((x) => x !== p) : [...platforms, p])
                        }
                        className={`border border-solid cursor-pointer font-inter px-[16px] py-[10px] rounded-full text-[14px] transition-colors duration-200 ${
                          selected
                            ? "bg-[#202020] border-[#202020] text-white"
                            : "bg-white border-[rgba(0,0,0,0.12)] text-[#202020] hover:border-[#202020]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-[32px]">
                  <button
                    type="button"
                    className="cursor-pointer font-inter text-[#606060] text-[14px] hover:text-[#202020] transition-colors"
                    onClick={() => setStep("size")}
                  >
                    ← Back
                  </button>
                  <DarkButton disabled={platforms.length === 0} onClick={finish}>Finish</DarkButton>
                </div>
              </motion.div>
            )}

            {step === "done" && (
              <motion.div key="done" {...stepMotion} className="flex flex-col items-center text-center">
                <div className="bg-[#e7ffe5] border border-[#34a853] border-solid flex items-center justify-center rounded-full size-[64px]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12.5L10 17.5L19 7.5" stroke="#34a853" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h1 className="font-manrope font-semibold mt-[24px] text-[32px] text-black tracking-[-0.05em]">
                  You&apos;re all set!
                </h1>
                <p className="font-inter mt-[8px] text-[16px] text-[#606060] tracking-[-0.02em] max-w-[380px]">
                  Welcome to Plucia. We&apos;ll set up your workspace around how you sell — keep an eye on your inbox.
                </p>
                <DarkButton className="mt-[32px]" onClick={() => router.push("/")}>
                  Back to home
                </DarkButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
