import AvatarGroup from "@/components/AvatarGroup";
import DistortText from "@/components/DistortText";
import WaitlistForm from "@/components/WaitlistForm";

/** "Be The Part of the Future Before Everyone" — Figma 2877:22890 */
export default function SubscribeSection() {
  return (
    <section className="bg-[#202020] flex items-center justify-center mt-[120px] lg:mt-[168px] overflow-clip py-[80px] lg:py-0 lg:h-[525px] relative w-full">
      {/* rotated grid panels */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[651.503px] items-center justify-center left-[calc(50%+400.65px)] top-[calc(50%-20.94px)] w-[889.301px]">
        <div className="-rotate-90 flex-none">
          <div className="h-[889.301px] opacity-[0.37] relative w-[651.503px]">
            <div className="absolute bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[889.301px] left-0 top-0 w-[217.168px]" />
            <div className="absolute bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[889.301px] left-[434.34px] top-0 w-[217.168px]" />
            <div className="absolute flex h-[218.253px] items-center justify-center left-[-190.02px] top-[552.69px] w-[1031.546px]">
              <div className="-rotate-90 flex-none">
                <div className="bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[1031.546px] relative w-[218.253px]" />
              </div>
            </div>
            <div className="absolute flex h-[218.253px] items-center justify-center left-[-190.02px] top-[118.36px] w-[1031.546px]">
              <div className="-rotate-90 flex-none">
                <div className="bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[1031.546px] relative w-[218.253px]" />
              </div>
            </div>
          </div>
        </div>work just like an
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex h-[651.503px] items-center justify-center left-[calc(50%-370.29px)] top-[calc(50%-20.94px)] w-[889.301px]">
        <div className="-rotate-90 flex-none">
          <div className="h-[889.301px] opacity-[0.37] relative w-[651.503px]">
            <div className="absolute bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[889.301px] left-0 top-0 w-[217.168px]" />
            <div className="absolute bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[889.301px] left-[434.34px] top-0 w-[217.168px]" />
            <div className="absolute flex h-[218.253px] items-center justify-center left-[-190.02px] top-[552.69px] w-[1031.546px]">
              <div className="-rotate-90 flex-none">
                <div className="bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[1031.546px] relative w-[218.253px]" />
              </div>
            </div>
            <div className="absolute flex h-[218.253px] items-center justify-center left-[-190.02px] top-[118.36px] w-[1031.546px]">
              <div className="-rotate-90 flex-none">
                <div className="bg-[rgba(217,217,217,0.02)] border-[rgba(207,207,207,0)] border-l-[1.086px] border-r-[1.086px] border-solid h-[1031.546px] relative w-[218.253px]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div className="relative flex flex-col gap-[50px] items-center px-[20px] w-full max-w-[601px]">
        <div className="flex flex-col gap-[8px] items-start relative shrink-0 text-[#fefefe] text-center w-full">
          <p className="font-manrope font-semibold leading-[0] relative shrink-0 text-[clamp(30px,7vw,48px)] tracking-[-0.02em] w-full">
            <span className="leading-[normal]"><DistortText text="Be The Part of the Future Before" /> </span>
            <span className="font-msmadi font-normal leading-[normal] not-italic">Everyone</span>
          </p>
          <p className="font-inter font-normal leading-[normal] relative shrink-0 text-[16px] sm:text-[18px] tracking-[-0.05em] w-full">
            Type a simple instruction in natural language, and Plucia instantly understands your intent.
          </p>
        </div>
        <div className="flex flex-col items-start p-[10px] relative shrink-0 w-full max-w-[506px]">
          <div className="flex flex-col gap-[38px] items-center relative shrink-0 w-full">
            <WaitlistForm />
            <AvatarGroup light />
          </div>
        </div>
      </div>
    </section>
  );
}
