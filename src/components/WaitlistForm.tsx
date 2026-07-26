"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The email capture from the subscribe banner. Submitting (button or Enter)
 * with a valid email routes to /congratulations?email=… — markup matches the
 * original static field pixel-for-pixel.
 */
export default function WaitlistForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError(true);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "footer" }),
      });

      if (!response.ok) {
        setError(true);
        return;
      }

      router.push(`/congratulations?email=${encodeURIComponent(email.trim())}`);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      className={`bg-[#f4f4f4] border border-[rgba(0,0,0,0.1)] border-solid drop-shadow-[0px_4px_6.5px_rgba(0,0,0,0.15)] flex gap-[4px] h-[62px] items-start p-[6px] relative rounded-[20px] shrink-0 w-full ${error ? "ring-2 ring-[#ff5b5b]" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="bg-[rgba(32,32,32,0.08)] flex flex-[1_0_0] h-full items-center min-w-px overflow-clip p-[12px] relative rounded-bl-[14px] rounded-br-[8px] rounded-tl-[14px] rounded-tr-[8px]">
        <input
          type="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(false);
          }}
          className="bg-transparent font-inter font-medium leading-[1.5] outline-none placeholder:text-[rgba(32,32,32,0.5)] relative text-[16px] text-[#202020] tracking-[-0.8px] w-full"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="group flex gap-[10px] h-full items-center justify-center overflow-clip px-[20px] py-[10px] relative rounded-bl-[8px] rounded-br-[14px] rounded-tl-[8px] rounded-tr-[14px] shrink-0 cursor-pointer transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0px_0px_0px_0.8px_#161616,0px_10px_10px_-3px_rgba(0,0,0,0.22),0px_18px_18px_-3px_rgba(0,0,0,0.2),0px_36px_34px_-4px_rgba(0,0,0,0.12)]"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none rounded-bl-[8px] rounded-br-[14px] rounded-tl-[8px] rounded-tr-[14px]"
          style={{ backgroundImage: "linear-gradient(-5.99027deg, rgb(7, 7, 7) 12.103%, rgb(47, 46, 49) 87.897%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-[45%] -translate-x-[160%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[260%]"
        />
        <div className="relative shrink-0 size-[20px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src="/assets/icons/mail-send-01.svg" />
        </div>
        <p className="font-manrope font-semibold leading-[normal] relative shrink-0 text-[#fefefe] text-[16px] tracking-[-0.8px] whitespace-nowrap">
          {submitting ? "Subscribing…" : "Subscribe"}
        </p>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_4px_7px_0px_rgba(255,255,255,0.2)]" />
      </button>
    </form>
  );
}
