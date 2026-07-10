"use client";

import tw from "tailwind-styled-components";

export const Tabs = tw.nav`
  flex w-full max-w-[420px] mx-auto gap-1.5 rounded-2xl
  border border-line bg-[rgba(253,249,240,0.7)]
  p-1 mb-[18px] sm:p-[5px] sm:mb-[26px]
  [backdrop-filter:blur(6px)]
`;

export const Tab = tw.button<{ $on?: boolean }>`
  flex-1 py-2.5 px-2 rounded-xl border-0
  text-[13.5px] font-bold cursor-pointer
  transition-colors duration-200
  ${(p) => (p.$on ? "bg-[#3a3028] text-[#fdf7ea]" : "bg-transparent text-ink-soft")}
`;

export const DailyBanner = tw.div`
  rounded-[28px] border border-line bg-[rgba(255,255,255,0.62)]
  text-left [backdrop-filter:blur(6px)]
  shadow-[0_14px_34px_rgba(74,54,33,0.08)]
  py-[18px] px-[14px] sm:py-[26px] sm:px-[28px]
`;

export const DailyLabel = tw.p`
  font-serif text-[19px] font-bold text-accent
  tracking-[-0.005em] mb-2.5
`;

export const DailyText = tw.p`
  font-hand font-normal text-[clamp(22px,3.4vw,31px)]
  leading-[1.5] tracking-[-0.01em] text-[#3c332b]
  [word-break:keep-all]
`;

export const DailyAuthor = tw.p`
  font-hand mt-2.5 text-right text-[17px] text-ink-soft
`;

export const DailyReflect = tw.p`
  font-soft mt-4 pt-3.5 border-t border-[rgba(176,137,95,0.28)]
  text-[14px] font-semibold leading-[1.6] text-[#7c5a34] [word-break:keep-all]
`;

export const SectionLabel = tw.p`
  font-serif text-[18px] font-bold leading-[1.45]
  text-[#3d342c] tracking-[-0.005em]
  mt-[30px] mb-3 [word-break:keep-all]
`;

export const Footer = tw.p`
  font-soft mt-10 text-center text-[12.5px] text-ink-soft
`;

export const PersonaRow = tw.div`
  grid grid-cols-2 gap-3 mb-2
`;

export const PersonaChip = tw.button<{ $on?: boolean }>`
  relative grid grid-cols-[58px_1fr] items-center gap-[14px]
  min-h-[86px] py-[13px] px-[15px] rounded-[22px] text-left
  bg-[rgba(255,255,255,0.7)] cursor-pointer
  transition-[transform,box-shadow,border-color] duration-200
  shadow-[0_8px_22px_rgba(74,54,33,0.05)]
  ${(p) =>
    p.$on
      ? "border-2 border-[#c9ac7d] bg-[#fffdf9] shadow-[0_12px_30px_rgba(74,54,33,0.12)] opacity-100"
      : "border-[1.5px] border-line opacity-[0.82] hover:opacity-100"}
`;

export const PersonaPhoto = tw.img`
  w-[58px] h-[58px] rounded-full object-cover
  border-2 border-white shadow-[0_4px_12px_rgba(74,54,33,0.14)]
`;

export const PersonaCopy = tw.span`
  flex flex-col items-start justify-center gap-0.5
  text-left min-w-0
`;

export const PersonaName = tw.span<{ $on?: boolean }>`
  font-soft text-[17px] font-bold leading-[1.25] tracking-[-0.01em]
  ${(p) => (p.$on ? "text-[#2a2118]" : "text-[#2e2822]")}
`;

export const PersonaTag = tw.span`
  text-[13px] leading-[1.35] text-ink-soft [word-break:keep-all]
`;

export const MoodGrid = tw.div`
  grid grid-cols-2 gap-2.5 sm:gap-3
`;

export const MoodBtn = tw.button`
  relative grid grid-cols-[36px_1fr] items-center gap-2.5
  min-h-[92px] p-3.5 rounded-[18px]
  sm:grid-cols-[48px_1fr] sm:gap-[14px] sm:min-h-[112px]
  sm:pt-[19px] sm:pr-5 sm:pb-5 sm:pl-6 sm:rounded-[24px]
  text-left overflow-hidden
  bg-[rgba(255,255,255,0.82)] border border-line cursor-pointer
  transition-[transform,box-shadow,border-color] duration-200
  shadow-[0_8px_22px_rgba(74,54,33,0.05)]
`;

export const MoodEmoji = tw.span`
  grid place-items-center w-9 h-9 text-[20px] rounded-[12px]
  sm:w-[44px] sm:h-[44px] sm:text-[24px] sm:rounded-[14px]
  leading-none bg-[rgba(176,137,95,0.12)]
`;

export const MoodCopy = tw.span`
  grid gap-1 sm:gap-1.5 min-w-0
`;

export const MoodName = tw.span`
  font-soft text-left text-[15px] sm:text-[17px] leading-[1.3] font-bold tracking-[-0.01em]
  text-[#33291f] [word-break:keep-all]
`;

export const MoodCaption = tw.span`
  font-soft block text-[12px] leading-[1.5] sm:text-[13.5px] sm:leading-[1.55]
  text-[#8c7d6b] [word-break:keep-all]
`;

export const MoodLine = tw.span`
  absolute left-0 top-0 bottom-0 w-[6px] rounded-none opacity-90
`;

export const FortuneCard = tw.div`
  mt-[14px] rounded-[20px] border border-line
  bg-[linear-gradient(160deg,rgba(255,255,255,0.72)_0%,rgba(255,250,240,0.72)_100%)]
  py-5 px-[22px] [backdrop-filter:blur(6px)]
  shadow-[0_10px_30px_rgba(0,0,0,0.05)]
`;

export const FortuneHead = tw.p`
  text-[12.5px] font-extrabold text-[#a06bd0] tracking-[0.03em] mb-3
`;

export const FortuneLine = tw.p`
  text-[17px] font-extrabold leading-[1.55] tracking-[-0.01em]
  text-ink [word-break:keep-all]
`;

export const FortuneGauge = tw.div`mt-4 mb-1`;

export const FortuneGaugeTop = tw.div`
  flex justify-between items-baseline
  text-[12.5px] font-bold text-ink-soft mb-1.5
`;

export const FortuneScore = tw.span`text-base font-extrabold text-[#a06bd0]`;

export const FortuneBar = tw.div`
  h-2.5 rounded-md bg-[rgba(0,0,0,0.07)] overflow-hidden
`;

export const FortuneBarFill = tw.span`
  block h-full rounded-md transition-[width] duration-[600ms]
  bg-[linear-gradient(90deg,#f6b93b,#f2a7c3,#a06bd0)]
`;

export const FortuneFlow = tw.p`
  mt-3 text-[13px] font-semibold leading-[1.6] text-[#6d5a3e]
  bg-[rgba(176,137,95,0.1)] rounded-[10px] py-[9px] px-3 [word-break:keep-all]
`;

export const FortuneGrid = tw.div`
  mt-4 grid grid-cols-2 gap-x-[14px] gap-y-2.5
`;

export const FortuneItem = tw.div`flex flex-col gap-[3px]`;

export const FortuneKey = tw.span`text-[11px] font-bold text-ink-soft`;

export const FortuneVal = tw.span`
  flex items-center gap-1.5 text-sm font-bold text-ink [word-break:keep-all]
`;

export const FortuneSwatch = tw.span`
  w-3.5 h-3.5 rounded-full border border-[rgba(0,0,0,0.1)] shrink-0
`;

export const FortuneTip = tw.p`
  mt-4 text-[13.5px] font-semibold text-[#4a453f]
  bg-[rgba(255,255,255,0.55)] rounded-xl py-[11px] px-[13px] [word-break:keep-all]
`;

export const FortuneNote = tw.p`
  mt-2.5 text-[11px] text-ink-soft opacity-80
`;
