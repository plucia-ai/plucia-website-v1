"use client";

import React from "react";

function NvidiaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 46 30" fill="none" className={className} aria-hidden>
      <path
        fill="#76B900"
        d="M16.889 8.985v-2.705c.262-.02.528-.033.798-.042 7.4-.232 12.255 6.359 12.255 6.359s-5.244 7.282-10.866 7.282c-.743.003-1.482-.115-2.187-.35v-8.204c2.88.348 3.46 1.62 5.192 4.508l3.852-3.248s-2.812-3.688-7.552-3.688c-.515 0-1.008.036-1.492.088ZM16.889.047v4.043c.265-.021.531-.038.798-.048 10.29-.346 16.995 8.44 16.995 8.44s-7.7 9.364-15.723 9.364c-.735 0-1.424-.068-2.07-.183v2.498c.553.07 1.126.112 1.724.112 7.465 0 12.864-3.812 18.092-8.325.867.694 4.416 2.383 5.145 3.123C36.879 23.231 25.295 26.586 18.727 26.586c-.614-.002-1.227-.034-1.838-.096V30h28.375V.047H16.889Zm0 19.482v2.133C9.984 20.432 8.067 13.254 8.067 13.254s3.316-3.674 8.822-4.269v2.34l-.011-.001c-2.89-.347-5.147 2.353-5.147 2.353s1.265 4.544 5.158 5.852ZM4.625 12.943s4.092-6.04 12.264-6.663V4.088C7.838 4.815 0 12.48 0 12.48s4.439 12.833 16.889 14.008v-2.328C7.753 23.011 4.625 12.943 4.625 12.943Z"
      />
    </svg>
  );
}

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AwsLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 304 182" fill="none" className={className} aria-hidden>
      <path
        fill="#232F3E"
        d="M86.4 66.4c0 3.7.4 6.7 1.1 8.9.8 2.2 1.8 4.6 3.2 7.2.5.8.7 1.6.7 2.3 0 1-.6 2-1.9 3l-6.3 4.2c-.9.6-1.8.9-2.6.9-1 0-2-.5-3-1.4-1.4-1.5-2.6-3.1-3.6-4.7-1-1.7-2-3.6-3.1-5.9-7.8 9.2-17.6 13.8-29.4 13.8-8.4 0-15.1-2.4-20-7.2-4.9-4.8-7.4-11.2-7.4-19.2 0-8.5 3-15.4 9.1-20.6 6.1-5.2 14.2-7.8 24.5-7.8 3.4 0 6.9.3 10.6.8 3.7.5 7.5 1.3 11.5 2.2v-7.3c0-7.6-1.6-12.9-4.7-16-3.2-3.1-8.6-4.6-16.3-4.6-3.5 0-7.1.4-10.8 1.3-3.7.9-7.3 2-10.8 3.4-1.6.7-2.8 1.1-3.5 1.3-.7.2-1.2.3-1.6.3-1.4 0-2.1-1-2.1-3.1v-4.9c0-1.6.2-2.8.7-3.5.5-.7 1.4-1.4 2.8-2.1 3.5-1.8 7.7-3.3 12.6-4.5 4.9-1.3 10.1-1.9 15.6-1.9 11.9 0 20.6 2.7 26.2 8.1 5.5 5.4 8.3 13.6 8.3 24.6v21.8zm-40.6 15.2c3.3 0 6.7-.6 10.3-1.8 3.6-1.2 6.8-3.4 9.5-6.4 1.6-1.9 2.8-4 3.4-6.4.6-2.4 1-5.3 1-8.7v-4.2c-2.9-.7-6-1.3-9.2-1.7-3.2-.4-6.3-.6-9.4-.6-6.7 0-11.6 1.3-14.9 4-3.3 2.7-4.9 6.5-4.9 11.5 0 4.7 1.2 8.2 3.7 10.6 2.4 2.4 5.9 3.6 10.5 3.6zm80.3 10.8c-1.8 0-3-.3-3.8-1-.8-.6-1.5-2-2.1-3.9L96.7 10.2c-.6-2-.9-3.3-.9-4 0-1.6.8-2.5 2.4-2.5h9.8c1.9 0 3.2.3 3.9 1 .8.6 1.4 2 2 3.9l16.8 66.2 15.6-66.2c.5-2 1.1-3.3 1.9-3.9.8-.6 2.2-1 4-1h8c1.9 0 3.2.3 4 1 .8.6 1.5 2 1.9 3.9l15.8 67 17.3-67c.6-2 1.3-3.3 2-3.9.8-.6 2.1-1 3.9-1h9.3c1.6 0 2.5.8 2.5 2.5 0 .5-.1 1-.2 1.6-.1.6-.3 1.4-.7 2.5l-24.1 77.3c-.6 2-1.3 3.3-2.1 3.9-.8.6-2.1 1-3.8 1h-8.6c-1.9 0-3.2-.3-4-1-.8-.7-1.5-2-1.9-4L156 23l-15.4 64.4c-.5 2-1.1 3.3-1.9 4-.8.7-2.2 1-4 1h-8.6zm128.5 2.7c-5.2 0-10.4-.6-15.4-1.8-5-1.2-8.9-2.5-11.5-4-1.6-.9-2.7-1.9-3.1-2.8-.4-.9-.6-1.9-.6-2.8v-5.1c0-2.1.8-3.1 2.3-3.1.6 0 1.2.1 1.8.3.6.2 1.5.6 2.5 1 3.4 1.5 7.1 2.7 11 3.5 4 .8 7.9 1.2 11.9 1.2 6.3 0 11.2-1.1 14.6-3.3 3.4-2.2 5.2-5.4 5.2-9.5 0-2.8-.9-5.1-2.7-7-1.8-1.9-5.2-3.6-10.1-5.2L246 52c-7.3-2.3-12.7-5.7-16-10.2-3.3-4.4-5-9.3-5-14.5 0-4.2.9-7.9 2.7-11.1 1.8-3.2 4.2-6 7.2-8.2 3-2.3 6.4-4 10.4-5.2 4-1.2 8.2-1.7 12.6-1.7 2.2 0 4.5.1 6.7.4 2.3.3 4.4.7 6.5 1.1 2 .5 3.9 1 5.7 1.6 1.8.6 3.2 1.2 4.2 1.8 1.4.8 2.4 1.6 3 2.5.6.8.9 1.9.9 3.3v4.7c0 2.1-.8 3.2-2.3 3.2-.8 0-2.1-.4-3.8-1.2-5.7-2.6-12.1-3.9-19.2-3.9-5.7 0-10.2.9-13.3 2.8-3.1 1.9-4.7 4.8-4.7 8.9 0 2.8 1 5.2 3 7.1 2 1.9 5.7 3.8 11 5.5l14.2 4.5c7.2 2.3 12.4 5.5 15.5 9.6 3.1 4.1 4.6 8.8 4.6 14 0 4.3-.9 8.2-2.6 11.6-1.8 3.4-4.2 6.4-7.3 8.8-3.1 2.5-6.8 4.3-11.1 5.6-4.5 1.3-9.2 2-14.3 2z"
      />
      <path
        fill="#FF9900"
        d="M273.5 143.7c-32.9 24.3-80.7 37.2-121.8 37.2-57.6 0-109.5-21.3-148.7-56.7-3.1-2.8-.3-6.6 3.4-4.4 42.4 24.6 94.7 39.5 148.8 39.5 36.5 0 76.6-7.6 113.5-23.2 5.5-2.4 10.2 3.7 4.8 7.6z"
      />
      <path
        fill="#FF9900"
        d="M287.2 128.1c-4.2-5.4-27.8-2.6-38.5-1.3-3.2.4-3.7-2.4-.8-4.5 18.8-13.2 49.7-9.4 53.3-5 3.6 4.5-1 35.4-18.6 50.2-2.7 2.3-5.3 1.1-4.1-1.9 5.5-14.9 14.4-37.2 10.2-42.5z"
      />
    </svg>
  );
}

export default function HeroBadges() {
  return (
    <div className="flex flex-col items-center gap-[12px] sm:gap-[14px]">
      {/* Subtle hairline framed label */}
      <div className="flex items-center gap-[12px] opacity-80">
        <span className="h-px w-[28px] sm:w-[36px] bg-[#202020]/15" />
        <span className="font-inter font-medium text-[11px] sm:text-[12px] uppercase tracking-[0.14em] text-[#555]">
          Backed by
        </span>
        <span className="h-px w-[28px] sm:w-[36px] bg-[#202020]/15" />
      </div>

      {/* Badges row with refined typography and delicate dividers */}
      <div className="flex flex-wrap items-center justify-center gap-x-[20px] sm:gap-x-[28px] lg:gap-x-[36px] gap-y-[12px]">
        {/* NVIDIA Inception Program */}
        <div className="flex items-center gap-[8px] sm:gap-[9px]">
          <div className="flex h-[20px] sm:h-[22px] items-center">
            <NvidiaLogo className="h-[17px] sm:h-[19px] w-auto shrink-0" />
          </div>
          <span className="font-inter text-[13px] sm:text-[14px] tracking-[-0.015em] text-[#202020] whitespace-nowrap">
            <span className="font-semibold text-black">NVIDIA</span> Inception Program
          </span>
        </div>

        <div className="hidden sm:block h-[14px] w-px bg-[#202020]/15 shrink-0" aria-hidden />

        {/* Google for Startups Cloud Program */}
        <div className="flex items-center gap-[8px] sm:gap-[9px]">
          <div className="flex h-[20px] sm:h-[22px] items-center">
            <GoogleLogo className="size-[17px] sm:size-[19px] shrink-0" />
          </div>
          <span className="font-inter text-[13px] sm:text-[14px] tracking-[-0.015em] text-[#202020] whitespace-nowrap">
            <span className="font-semibold text-black">Google for Startups</span> Cloud Program
          </span>
        </div>

        <div className="hidden sm:block h-[14px] w-px bg-[#202020]/15 shrink-0" aria-hidden />

        {/* AWS Activate */}
        <div className="flex items-center gap-[7px] sm:gap-[8px]">
          <div className="flex h-[20px] sm:h-[22px] items-center pt-[1px]">
            <AwsLogo className="h-[15px] sm:h-[17px] w-auto shrink-0" />
          </div>
          <span className="font-inter text-[13px] sm:text-[14px] tracking-[-0.015em] text-[#202020] whitespace-nowrap font-semibold text-black">
            Activate
          </span>
        </div>
      </div>
    </div>
  );
}
