import type { Metadata, Viewport } from "next";
import "./globals.css";
import StyledComponentsRegistry from "./registry";

// 배포 도메인 — 환경변수로 덮어쓸 수 있음 (OG/canonical/사이트맵 절대경로에 사용)
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://today-mood-one.vercel.app";

const TITLE = "오늘의 마음 — 기분 체크인 · 위로 편지 · 마음 날씨";
const DESCRIPTION =
  "지금 마음에 가까운 감정을 고르면, 어울리는 위로·응원 한마디와 명언을 편지 한 통으로 정리해 드려요. 매일 바뀌는 오늘의 한마디, 마음 날씨 캘린더, 공유 카드까지 — 하루를 돌아보는 가장 다정한 방법.";
const OG_IMAGE = "/share-art/good-day.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · 오늘의 마음",
  },
  description: DESCRIPTION,
  applicationName: "오늘의 마음",
  category: "lifestyle",
  keywords: [
    "오늘의 마음",
    "기분",
    "감정 체크인",
    "감정 일기",
    "무드 트래커",
    "마음 날씨",
    "위로",
    "응원",
    "명언",
    "힐링",
    "오늘의 한마디",
    "마음 기록",
    "감정 기록",
    "mood tracker",
  ],
  authors: [{ name: "1234 LAB" }],
  creator: "1234 LAB",
  publisher: "1234 LAB",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "오늘의 마음",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1122,
        height: 1402,
        alt: "오늘의 마음 — 기분 체크인 공유 카드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/brand/logo-square-v1-clean-256.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f4ecdd",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

// 구조화 데이터(JSON-LD) — 검색엔진이 앱 성격을 이해하도록
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "오늘의 마음",
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  inLanguage: "ko-KR",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  publisher: { "@type": "Organization", name: "1234 LAB" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* 웹폰트 CDN preconnect (로딩 성능) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* 본문: Pretendard (모던·전문) */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard.min.css"
        />
        {/* 제목·편지: 마루 부리(따뜻한 명조) — 실패 시 고운바탕으로 대체 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/webfontworld/MaruBuri/MaruBuri.css"
        />
        {/* 대체 명조 + 손글씨 서명 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@400;700&family=Nanum+Pen+Script&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
