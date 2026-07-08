"use client";

import tw from "tailwind-styled-components";

export const StepCard = tw.div`
  max-w-[480px] mx-auto mt-2 text-center
  rounded-[22px] border border-line bg-[rgba(255,255,255,0.72)]
  [backdrop-filter:blur(6px)] shadow-[0_22px_54px_rgba(74,54,33,0.12)]
  pt-[17px] px-[14px] pb-5 sm:pt-5 sm:px-6 sm:pb-[26px]
  animate-[rise_0.4s_cubic-bezier(0.2,0.8,0.2,1)_both]
`;

export const Advisor = tw.div`
  flex items-center gap-[11px] pb-[14px] mb-1 border-b border-line
`;

export const AdvisorPhoto = tw.img`
  w-[42px] h-[42px] rounded-full object-cover shrink-0
  border-2 border-[#fffdf8] shadow-[0_3px_10px_rgba(74,54,33,0.16)]
`;

export const AdvisorCopy = tw.span`grid gap-px flex-1 min-w-0`;

export const AdvisorName = tw.span`
  font-serif text-[15.5px] font-bold text-[#33291f]
`;

export const AdvisorTag = tw.span`text-xs text-ink-soft`;

export const AdvisorBadge = tw.span`
  shrink-0 text-[11px] font-bold text-accent rounded-full py-1 px-2.5
  bg-[rgba(176,137,95,0.12)] border border-[rgba(176,137,95,0.28)]
`;

export const StepHead = tw.div`
  flex items-center justify-between mt-[14px] mb-[18px]
`;

export const StepBack = tw.button`
  border-0 bg-transparent text-[13px] font-semibold text-ink-soft
  cursor-pointer py-1.5 px-1 rounded-lg hover:text-ink
`;

export const StepSkip = tw(StepBack)``;

export const StepDots = tw.div`flex gap-1.5`;

export const Dot = tw.span<{ $on?: boolean }>`
  w-[7px] h-[7px] rounded-full transition-colors
  ${(p) => (p.$on ? "bg-accent" : "bg-[rgba(0,0,0,0.12)]")}
`;

export const StepEmoji = tw.div`text-[40px] leading-none mt-1 mb-3 text-center`;

export const StepTitle = tw.p`
  font-soft text-xl font-bold leading-[1.5] tracking-[-0.01em]
  text-center text-[#33291f] [word-break:keep-all]
`;

export const StepSub = tw.p`mt-2 text-[13.5px] text-ink-soft text-center`;

export const IntensityValue = tw.p`
  text-center font-serif text-2xl font-bold mt-4 mb-3 text-[#33291f]
`;

export const SliderEnds = tw.div`
  flex justify-between text-xs text-ink-soft mt-2 mb-5
`;

export const FreeBtn = tw.button`
  mt-3 w-full py-[13px] border-0 rounded-xl bg-ink text-white
  text-[15px] font-bold cursor-pointer transition-opacity
`;

export const FreeInput = tw.textarea`
  w-full border border-line rounded-xl py-3 px-3.5
  text-[15px] text-ink bg-[#fdfbf7] resize-none
`;

export const Choices = tw.div`flex flex-col gap-[11px] mt-5`;

export const Choice = tw.button<{ $on?: boolean }>`
  py-4 px-[18px] rounded-[15px] border-line
  bg-[#fffdf8] font-serif text-base font-bold text-[#3a3028]
  text-center cursor-pointer
  transition-[transform,border-color,box-shadow,background] duration-200
  ${(p) =>
    p.$on
      ? "border-2 bg-[linear-gradient(180deg,#fffdf8,#f3e9d8)] shadow-[0_10px_24px_rgba(74,54,33,0.1)]"
      : "border-[1.5px]"}
`;
