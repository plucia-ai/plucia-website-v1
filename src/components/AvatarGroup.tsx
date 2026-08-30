"use client";

import { useEffect, useState } from "react";

/** Overlapping waitlist avatars + dynamic count fetched from /api/waitlist. */
export default function AvatarGroup({
  light = false,
  initialCount = 50489,
}: {
  light?: boolean;
  initialCount?: number;
}) {
  const [count, setCount] = useState<number>(initialCount);

  useEffect(() => {
    let mounted = true;
    fetch("/api/waitlist")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch waitlist count");
        return res.json();
      })
      .then((data: { ok?: boolean; total?: number }) => {
        if (mounted && typeof data.total === "number" && data.total > 0) {
          setCount(data.total);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic waitlist count:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-[10px] items-center justify-center relative shrink-0">
      <div className="flex items-center relative shrink-0">
        <div className="border-[1.552px] border-solid border-white mr-[-7px] relative rounded-[77.588px] shrink-0 size-[23.276px]">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[77.588px] size-full" src="/assets/images/avatar-1.png" />
        </div>
        <div className="border-[1.552px] border-solid border-white mr-[-7px] relative rounded-[77.588px] shrink-0 size-[23.276px]">
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[77.588px] overflow-hidden">
            <img alt="" className="absolute max-w-none object-cover rounded-[77.588px] size-full" src="/assets/images/avatar-2.png" />
          </div>
        </div>
        <div className="border-[1.552px] border-solid border-white mr-[-7px] relative rounded-[77.588px] shrink-0 size-[23.276px]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[77.588px]">
            <img alt="" className="absolute h-[155.89%] left-[-67.03%] max-w-none top-[-6.71%] w-[234.06%]" src="/assets/images/avatar-3.png" />
          </div>
        </div>
        <div className="border-[1.552px] border-solid border-white relative rounded-[77.588px] shrink-0 size-[23.276px]">
          <div aria-hidden className="absolute inset-0 pointer-events-none rounded-[77.588px]">
            <div className="absolute bg-white inset-0 rounded-[77.588px]" />
            <div className="absolute inset-0 overflow-hidden rounded-[77.588px]">
              <img alt="" className="absolute h-[280.63%] left-[-70.68%] max-w-none top-[-34.68%] w-[241.36%]" src="/assets/images/avatar-4.png" />
            </div>
          </div>
        </div>
      </div>
      <p className={`font-inter font-normal leading-[0] relative shrink text-[14px] sm:text-[16px] text-center tracking-[-0.05em] ${light ? "text-[#fefefe]" : "text-[#202020]"}`}>
        <span className="font-bold leading-[normal]">{count.toLocaleString()} </span>
        <span className="leading-[normal]">people already joined Plucia&apos;s waitlist</span>
      </p>
    </div>
  );
}
