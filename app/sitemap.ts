import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://today-mood-one.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      // "오늘의 한마디"가 매일 바뀌므로 daily
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
