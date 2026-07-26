"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import CtaLink from "@/components/CtaLink";

/**
 * Newsletter subscribe confirmation page. The hero banner video plays inside
 * a rounded card inset from the viewport edges (same framing as the hero),
 * softened by the hero's white overlay, with the submitted email shown in
 * the centered message.
 */
export default function CongratsPage({ email }: { email: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="bg-white min-h-screen overflow-clip relative w-full">
      {/* video card — padded away from the viewport edges like the hero */}
      <div className="absolute inset-[8px] sm:inset-x-[29px] sm:inset-y-[14px] overflow-clip rounded-[24px]">
        <video
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          src="/assets/video/background video.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
        <div aria-hidden className="absolute inset-0 bg-[#fefefe]/60 pointer-events-none" />
      </div>

      {/* logo */}
      <Link href="/" className="absolute flex gap-[7px] items-center left-[28px] sm:left-[52px] top-[32px] sm:top-[38px]">
        <img alt="Plucia logo" className="size-[23px]" src="/assets/icons/plucia-logo.svg" />
        <span className="font-geist font-medium text-[#202020] text-[23px] tracking-[-0.58px]">Plucia</span>
      </Link>

      {/* message */}
      <div className="flex items-center justify-center min-h-screen px-[28px] relative w-full">
        <motion.div
          className="flex flex-col items-center max-w-[640px] text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-[#e7ffe5] border border-[#34a853] border-solid flex items-center justify-center rounded-full size-[72px]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5L10 17.5L19 7.5" stroke="#34a853" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="font-manrope font-semibold mt-[28px] text-[clamp(34px,6vw,52px)] text-black tracking-[-0.05em]">
            You&apos;re on the list.
          </h1>
          <p className="font-inter mt-[12px] text-[17px] sm:text-[19px] text-[#202020] tracking-[-0.02em]">
            We&apos;re coming soon. We&apos;ll let you know.
            {email && (
              <>
                {" "}
                Updates will go to <span className="font-semibold">{email}</span>.
              </>
            )}
          </p>
          <CtaLink href="/" className="mt-[36px]">
            Back to Home
          </CtaLink>

          {/* divider + socials (same badges as the footer) */}
          <div className="flex gap-[14px] items-center mt-[40px] w-full max-w-[420px]">
            <div className="bg-[rgba(32,32,32,0.18)] flex-1 h-px" />
            <p className="font-inter text-[13px] text-[#606060] whitespace-nowrap">
              get live updates on social too
            </p>
            <div className="bg-[rgba(32,32,32,0.18)] flex-1 h-px" />
          </div>
          <div className="flex gap-[12px] items-center mt-[20px]">
            <a href="https://www.linkedin.com/company/plucia/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="bg-[#1b1819] flex items-center justify-center relative rounded-[40px] shrink-0 size-[40px] transition-transform duration-200 hover:-translate-y-0.5">
              <div className="relative shrink-0 size-[16px]">
                <img alt="LinkedIn" className="absolute block inset-0 max-w-none size-full" src="/assets/icons/linkedin-02.svg" />
              </div>
            </a>
            <a href="https://www.instagram.com/_plucia_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="bg-[#1b1819] flex items-center justify-center relative rounded-[40px] shrink-0 size-[40px] transition-transform duration-200 hover:-translate-y-0.5">
              <div className="relative shrink-0 size-[16px]">
                <img alt="Instagram" className="absolute block inset-0 max-w-none size-full" src="/assets/icons/instagram-footer.svg" />
              </div>
            </a>
            <a href="https://x.com/plucia_ai" target="_blank" rel="noopener noreferrer" aria-label="X" className="bg-[#1b1819] flex items-center justify-center relative rounded-[40px] shrink-0 size-[40px] transition-transform duration-200 hover:-translate-y-0.5">
              <div className="relative shrink-0 size-[16px]">
                <img alt="X" className="absolute block inset-0 max-w-none size-full" src="/assets/icons/new-twitter.svg" />
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
