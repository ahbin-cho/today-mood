"use client";

import tw from "tailwind-styled-components";

export const LetterCard = tw.div`
  relative text-left text-[#2c2a28] rounded-[20px]
  [backdrop-filter:blur(4px)]
  shadow-[0_26px_64px_rgba(74,54,33,0.14)]
  bg-[repeating-linear-gradient(180deg,transparent_0_31px,rgba(120,96,60,0.05)_31px_32px),linear-gradient(180deg,var(--paper-1)_0%,var(--paper-2)_100%)]
  pt-[22px] px-5 pb-5 sm:pt-[34px] sm:px-[30px] sm:pb-[30px]
  animate-[rise_0.6s_cubic-bezier(0.2,0.8,0.2,1)_both]
  before:content-[''] before:absolute before:left-[18px] before:right-[18px] before:top-3
  before:h-px before:opacity-[0.35]
  before:bg-[repeating-linear-gradient(90deg,var(--accent)_0_6px,transparent_6px_12px)]
`;

export const Report = tw.div`
  text-center px-1 pt-1 pb-5 mb-1.5 border-b border-dashed border-black/10
`;

export const ReportLabel = tw.p`
  text-[12.5px] font-extrabold text-accent tracking-[0.02em]
`;

export const ReportType = tw.p`
  flex items-center justify-center gap-2 mt-2
  text-2xl font-bold tracking-[-0.02em]
`;

export const ReportEmoji = tw.span`text-[26px]`;

export const ReportScore = tw.div`max-w-[300px] mx-auto mt-4`;

export const ReportScoreTop = tw.div`
  flex justify-between items-baseline text-[12.5px] font-bold text-ink-soft mb-1.5
`;

export const ReportScoreNum = tw.span`text-base font-extrabold text-ink`;

export const ReportBar = tw.div`
  h-2.5 rounded-md bg-black/[0.08] overflow-hidden
`;

export const ReportBarFill = tw.span`
  block h-full rounded-md bg-accent transition-[width] duration-[600ms]
`;

export const ReportSummary = tw.p`
  font-soft mt-3.5 text-sm leading-[1.65] text-[#4a453f] [word-break:keep-all]
`;

export const Reading = tw.div`
  mt-[18px] rounded-2xl border border-line bg-white/55 py-4 px-3 sm:px-[18px]
`;

export const ReadingLabel = tw.p`
  font-serif text-sm font-bold text-accent mb-[9px]
`;

export const ReadingRead = tw.p`
  font-soft text-[15px] leading-[1.72] text-[#3d342c] [word-break:keep-all]
`;

export const ReadingSuggest = tw.div`
  mt-3 rounded-xl border border-[rgba(176,137,95,0.24)]
  bg-[rgba(176,137,95,0.1)] py-3 px-[11px] sm:px-3.5
`;

export const ReadingSuggestTag = tw.span`
  block text-[12.5px] font-extrabold text-[#7c5a34] mb-[5px]
`;

export const ReadingSuggestText = tw.span`
  font-soft text-sm leading-[1.65] text-[#3d342c] [word-break:keep-all]
`;

export const ReadingCaution = tw.p`
  mt-2.5 text-[12.5px] leading-[1.6] text-[#6b5f52] [word-break:keep-all]
`;

export const LetterFrom = tw.div`
  flex items-center gap-[13px] mt-[26px] pb-[18px] mb-6
  border-b border-dashed border-black/10
`;

export const LetterAvatarImg = tw.img`
  block w-12 h-12 rounded-full object-cover shrink-0 bg-[#f7efe4]
  border-2 border-[#fffdf8] shadow-[0_4px_12px_rgba(74,54,33,0.14)]
`;

export const LetterFromText = tw.span`text-[15px] font-extrabold`;

export const LetterTag = tw.span`text-xs font-semibold text-ink-soft`;

export const LetterOpen = tw.p`
  font-soft text-xl font-bold leading-[1.55] tracking-[-0.01em]
  text-[#34291d] [word-break:keep-all]
  animate-[fadein_0.6s_ease_0.1s_both]
`;

export const LetterEcho = tw.p`
  mt-3.5 italic text-[14.5px] text-[#4a453f] bg-white/50
  rounded-xl py-3 px-3.5 leading-[1.6] [word-break:keep-all]
  animate-[fadein_0.6s_ease_0.25s_both]
`;

export const LetterEchoTail = tw.span`
  block mt-1.5 not-italic text-[13px] text-ink-soft
`;

export const LetterReflect = tw.p`
  mt-3 text-[14.5px] font-semibold leading-[1.6] text-[#3d3833]
  bg-[rgba(255,245,225,0.7)] rounded-xl py-3 px-3.5 [word-break:keep-all]
  animate-[fadein_0.6s_ease_0.32s_both]
`;

export const LetterLine = tw.p<{ $dim?: boolean }>`
  font-soft mt-4 text-[15px] leading-[1.7] [word-break:keep-all]
  ${(p) => (p.$dim ? "text-[#6a6058]" : "")}
`;

export const LetterBody = tw.p`
  font-soft mt-3 text-xl font-bold leading-[1.6] tracking-[-0.01em]
  [word-break:keep-all] animate-[fadein_0.7s_ease_0.4s_both]
`;

export const QuoteBlock = tw.div`
  mt-[22px] mx-auto max-w-[440px] rounded-2xl border bg-white/50 py-4 px-[18px]
`;

export const QuoteText = tw.p`
  font-soft text-base not-italic leading-[1.6] font-semibold
  text-[#3d3833] [word-break:keep-all]
`;

export const QuoteAuthor = tw.p`mt-2 text-[12.5px] font-semibold opacity-70`;

export const SupportNote = tw.p`
  mt-2.5 text-[13px] leading-[1.6] text-[#6b5f52] [word-break:keep-all]
`;

export const LetterSign = tw.p`
  font-hand mt-[22px] text-right text-[27px] text-[#4a3d2f] tracking-[-0.01em]
`;

export const PsBox = tw.div`
  mt-6 rounded-2xl border border-line p-3 sm:p-4
  bg-[linear-gradient(180deg,var(--paper-1)_0%,var(--paper-2)_100%)]
`;

export const PsLabel = tw.p`text-[13px] font-extrabold text-ink mb-2.5`;

export const PsSaved = tw.p`
  text-[15px] font-bold leading-[1.55] text-[#3d3833] [word-break:keep-all]
`;

export const PsBtn = tw.button`
  mt-2.5 w-full py-3 rounded-xl border-0 bg-[#3a3028] text-[#fdf7ea]
  text-[14.5px] font-bold cursor-pointer transition-opacity
  disabled:opacity-50
`;

export const Disclaimer = tw.p`
  mt-3.5 text-[11.5px] leading-[1.55] text-ink-soft opacity-85 [word-break:keep-all]
`;

export const Explore = tw.div`
  mt-4 rounded-[18px] border border-line py-4 px-[18px]
  bg-[linear-gradient(180deg,var(--paper-1),var(--paper-2))]
  shadow-[0_10px_26px_rgba(74,54,33,0.06)]
`;

export const ExploreLabel = tw.p`
  font-serif text-[14.5px] font-bold text-[#33291f] mb-3
`;

export const ExploreLinks = tw.div`flex flex-wrap gap-[9px]`;

export const ExploreLink = tw.a`
  flex-[1_1_30%] text-center no-underline whitespace-nowrap
  text-[13.5px] font-bold text-[#4a3d2f] bg-[#fffdf8]
  border-[1.5px] border-line rounded-xl py-[11px] px-2.5
  transition-[transform,border-color,box-shadow] duration-200
`;

export const Actions = tw.div`flex flex-wrap gap-2.5 mt-5`;

export const Btn = tw.button<{ $primary?: boolean }>`
  flex-[1_1_40%] py-[13px] rounded-[14px] text-sm font-bold cursor-pointer
  transition-[transform,box-shadow] duration-200
  ${(p) =>
    p.$primary
      ? "border border-[#3a3028] bg-[#3a3028] text-[#fffaf3]"
      : "border border-line bg-white/85 text-ink"}
`;
