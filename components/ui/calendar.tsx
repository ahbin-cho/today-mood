"use client";

import tw from "tailwind-styled-components";

export const CalWrap = tw.div`
  rounded-[20px] border border-line bg-white/[0.62] [backdrop-filter:blur(6px)]
  pt-[22px] px-3.5 pb-[26px] sm:px-5
`;

export const CalHead = tw.div`flex items-center justify-between mb-1.5`;

export const CalTitle = tw.div`
  font-soft text-lg font-extrabold text-[#33291f] tracking-[-0.01em]
`;

export const CalNav = tw.button`
  w-[38px] h-[38px] rounded-xl border border-line bg-white/70
  text-xl leading-none cursor-pointer text-ink hover:bg-white
`;

export const CalSub = tw.p`text-[13px] text-ink-soft mb-4`;

export const CalGrid = tw.div`grid grid-cols-7 gap-1.5`;

export const CalWeekRow = tw.div`grid grid-cols-7 gap-1.5 mb-1.5`;

export const CalWeekday = tw.div`
  text-center text-xs font-bold text-ink-soft py-0.5
`;

export const CalCell = tw.button<{ $has?: boolean; $today?: boolean; $sel?: boolean }>`
  relative aspect-square rounded-xl flex items-center justify-center
  bg-black/[0.02] border border-transparent p-0 cursor-default
  ${(p) =>
    p.$has
      ? "cursor-pointer transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08)]"
      : ""}
  ${(p) =>
    p.$sel
      ? "outline outline-2 outline-ink -outline-offset-2"
      : p.$today
      ? "outline outline-2 outline-accent -outline-offset-2"
      : ""}
`;

export const CalCellEmpty = tw.div`
  aspect-square rounded-xl border border-transparent bg-transparent
`;

export const CalDay = tw.span`
  absolute top-1 left-1.5 text-[10.5px] font-semibold text-ink-soft
`;

export const CalEmoji = tw.span`text-xl leading-none`;

export const CalCount = tw.span`
  absolute bottom-[3px] right-1 min-w-[14px] h-3.5 px-[3px] rounded-[7px]
  bg-accent text-white text-[9px] font-bold leading-[14px] text-center
`;

export const CalEmptyMsg = tw.p`
  mt-[18px] text-[13.5px] text-ink-soft text-center leading-[1.6] [word-break:keep-all]
`;

export const DayDetailList = tw.div`flex flex-col gap-3 mt-[18px]`;

export const DayDetailCount = tw.p`
  mb-[-2px] text-[13px] font-semibold text-ink-soft text-center
`;

export const DayDetail = tw.div`
  rounded-[18px] border border-line bg-white/70
  py-[18px] px-3.5 sm:px-[18px]
  animate-[rise_0.35s_cubic-bezier(0.2,0.8,0.2,1)_both]
`;

export const DayDetailHead = tw.div`flex items-center gap-3 mb-3`;

export const DayDetailEmoji = tw.span`text-[34px] leading-none`;

export const DayDetailDate = tw.p`text-[12.5px] text-ink-soft`;

export const DayDetailType = tw.p`
  font-soft text-[17px] font-extrabold tracking-[-0.01em] text-[#33291f]
`;

export const DayDetailLine = tw.p`text-[13px] text-ink-soft mb-3`;

export const QaList = tw.div`flex flex-col gap-2 mt-1 mb-3.5`;

export const QaRow = tw.div`flex items-baseline gap-2.5`;

export const QaQ = tw.span`
  shrink-0 text-xs font-bold text-ink-soft bg-black/[0.04] rounded-lg py-[3px] px-[9px]
`;

export const QaA = tw.span`text-[13.5px] font-semibold text-ink [word-break:keep-all]`;

export const DayDetailNote = tw.p`
  text-sm text-[#4a453f] bg-black/[0.03] rounded-[10px] py-2.5 px-3 mb-3 [word-break:keep-all]
`;

export const DayDetailReflect = tw.p`
  mt-2 text-[13px] font-semibold text-[#4a453f] bg-[rgba(255,245,225,0.8)]
  rounded-[10px] py-[9px] px-3 [word-break:keep-all]
`;

export const DayDetailReading = tw.p`
  mt-2 text-[13.5px] leading-[1.6] text-[#3d342c] [word-break:keep-all]
`;

export const DayDetailSuggest = tw.p`
  mt-2 text-[13px] leading-[1.6] text-[#4a3d2f] bg-[rgba(176,137,95,0.1)]
  rounded-[10px] py-[9px] px-3 [word-break:keep-all]
`;

export const DayDetailMessage = tw.p`
  text-[15px] font-bold leading-[1.55] [word-break:keep-all]
`;

export const DayDetailQuote = tw.p`
  font-soft mt-2 text-[13px] italic text-[#4a453f] leading-[1.6] [word-break:keep-all]
`;

export const DayDetailSign = tw.p`mt-2.5 text-right text-[13px] font-extrabold`;

export const DayDetailSelf = tw.p`
  mt-2.5 text-[13.5px] text-[#4a453f] bg-black/[0.03] rounded-[10px] py-2.5 px-3 [word-break:keep-all]
`;
