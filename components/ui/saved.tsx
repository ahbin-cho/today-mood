"use client";

import tw from "tailwind-styled-components";

export const SavedWrap = tw.div`flex flex-col gap-3`;

export const SavedCard = tw.div`
  rounded-[18px] border border-line bg-white/[0.72] [backdrop-filter:blur(4px)]
  pt-[18px] px-3.5 pb-4 sm:px-[18px]
`;

export const SavedTop = tw.div`flex items-center gap-2 mb-2.5`;

export const SavedEmoji = tw.span`text-[22px]`;

export const SavedDate = tw.span`text-[12.5px] text-ink-soft flex-1`;

export const SavedDel = tw.button`
  border-0 bg-transparent text-ink-soft text-[15px] cursor-pointer
  p-1 leading-none rounded-lg
`;

export const SavedMessage = tw.p`
  font-soft text-base font-semibold leading-[1.55] [word-break:keep-all]
`;

export const SavedQuote = tw.p`
  mt-2.5 text-[13.5px] italic text-[#4a453f] leading-[1.6] [word-break:keep-all]
`;

export const SavedQAuthor = tw.span`not-italic font-semibold opacity-70`;
