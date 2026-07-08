"use client";

import tw from "tailwind-styled-components";

export const Wrap = tw.main`
  relative z-[1] mx-auto max-w-[760px]
  px-3 pt-5 pb-[52px]
  sm:px-5 sm:pt-[34px] sm:pb-20
`;

export const Header = tw.header`
  text-center mb-4 sm:mb-5
`;

export const DateText = tw.p`
  text-[13px] text-[#9a8b7c] tracking-[0.02em]
`;

export const Title = tw.h1`
  font-serif font-bold text-ink
  text-[clamp(25px,8vw,34px)] sm:text-[clamp(28px,4.5vw,42px)]
  leading-[1.22] tracking-[-0.02em]
  max-w-[620px] mx-auto mt-2 mb-1.5
  [word-break:keep-all]
`;

export const Subtitle = tw.p`
  text-[15px] sm:text-base text-ink-soft leading-[1.65]
  [word-break:keep-all]
`;
