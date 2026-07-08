// 오늘의 마음 운세 (재미로 보는 요소)
// 날짜를 시드로 매일 하나씩 결정 — 하루 동안 고정, 매일 바뀜.

import { hashString } from "@/lib/pick";

export type LuckyColor = { name: string; hex: string };

export type Fortune = {
  line: string; // 한 줄 운세
  score: number; // 마음 기운 지수 (55~99)
  color: LuckyColor; // 행운의 색
  time: string; // 행운의 시간
  item: string; // 오늘의 아이템
  tip: string; // 오늘의 작은 처방
  keyword: string; // 오늘의 키워드
  flow: string; // 내 기록이 반영된 기운 흐름 한 줄
  personalized: boolean; // 기록이 반영됐는지
};

// 내 최근 체크인 기록 요약 (기운 점수 개인화용)
export type MoodHistory = {
  streak: number; // 연속 기록 일수
  recentCount: number; // 최근 7일 기록 수
  trend: number; // 최근 마음 무게 평균(1~4). 기록 없으면 NaN
};

const lines = [
  "작게 시작한 일이 예상보다 멀리 데려다주는 하루예요.",
  "오늘은 마음이 하는 말에 귀 기울이면 답이 보여요.",
  "서두르지 않아도, 흐름이 당신 편으로 흘러가요.",
  "뜻밖의 다정함이 문득 찾아올 수 있어요.",
  "미뤄둔 한 가지를 해내면 마음이 한결 가벼워져요.",
  "오늘의 작은 용기가 내일의 나를 웃게 해요.",
  "잠깐의 쉼이 오히려 좋은 길을 열어줘요.",
  "당신이 건넨 따뜻함이 돌고 돌아 다시 돌아와요.",
  "너무 애쓰지 않아도 되는 날. 지금 그대로 충분해요.",
  "오늘 만난 작은 순간 하나가 오래 기억에 남을 거예요.",
  "마음의 문을 살짝 열면, 반가운 소식이 들어와요.",
  "흐린 마음도 오후엔 개어요. 조금만 기다려요.",
  "오늘은 나를 먼저 챙길수록 일이 잘 풀려요.",
  "무심코 뱉은 한마디가 누군가에겐 큰 위로가 돼요.",
];

const colors: LuckyColor[] = [
  { name: "따뜻한 살구", hex: "#F6B93B" },
  { name: "말간 하늘", hex: "#7FB3E8" },
  { name: "연둣빛", hex: "#9FD4A3" },
  { name: "포근한 코랄", hex: "#F08A7A" },
  { name: "라벤더", hex: "#B5A7D6" },
  { name: "크림 옐로", hex: "#FFE08A" },
  { name: "로즈 핑크", hex: "#F2A7C3" },
  { name: "민트", hex: "#8FD9C9" },
];

const times = [
  "이른 아침",
  "느지막한 오전",
  "점심 무렵",
  "나른한 오후",
  "해질 무렵",
  "고요한 밤",
  "자정 전후",
];

const items = [
  "따뜻한 차 한 잔",
  "좋아하는 노래 한 곡",
  "짧은 산책",
  "달콤한 간식",
  "포근한 담요",
  "향 좋은 커피",
  "창문 열고 환기하기",
  "좋아하는 사람과의 통화",
  "노트에 끄적이는 낙서",
  "5분 스트레칭",
];

const tips = [
  "미뤄둔 메시지 하나에 답장해보기",
  "물 한 잔 천천히 마시기",
  "잠들기 전 오늘 좋았던 일 하나 떠올리기",
  "10분 일찍 잠자리에 들기",
  "고마운 사람에게 한 줄 보내기",
  "핸드폰 없이 5분 멍때리기",
  "가장 쉬운 일부터 딱 하나만 끝내기",
  "창밖 하늘 한 번 올려다보기",
  "좋아하는 향 맡아보기",
  "어깨 크게 한 바퀴 돌리기",
];

const keywords = [
  "쉼",
  "용기",
  "다정",
  "균형",
  "설렘",
  "정리",
  "연결",
  "기대",
  "여유",
  "회복",
  "시작",
  "감사",
];

function pick<T>(arr: T[], seed: string): T {
  return arr[hashString(seed) % arr.length];
}

export function buildFortune(dateKey: string, history?: MoodHistory, uid?: string): Fortune {
  const seed = uid ? `${dateKey}:${uid}` : dateKey;
  const base = 60 + (hashString(seed + "|score") % 34); // 60~93 (개인화 여지)
  let score = base;
  let flow = "오늘부터 마음을 기록하면, 내일의 운세가 당신에게 더 맞춰져요.";
  let personalized = false;

  if (history && history.recentCount > 0) {
    personalized = true;
    // 꾸준함 보너스 + 최근 마음 흐름 반영
    score += Math.min(history.streak, 5) * 2;
    if (!Number.isNaN(history.trend)) {
      score += Math.round((history.trend - 2.5) * 5);
    }
    score = Math.max(55, Math.min(99, score));

    if (history.streak >= 3) {
      flow = `마음을 ${history.streak}일째 돌보고 있어요. 그 꾸준함이 오늘의 기운을 밀어올려요.`;
    } else if (!Number.isNaN(history.trend) && history.trend <= 2) {
      flow = "요즘 마음이 조금 무거웠죠. 오늘의 기운은 천천히 차오르는 중이에요.";
    } else if (!Number.isNaN(history.trend) && history.trend >= 3.2) {
      flow = "최근의 좋은 흐름이 오늘의 기운에도 이어지고 있어요.";
    } else {
      flow = "최근 남긴 기록들이 오늘의 기운에 은은하게 반영됐어요.";
    }
  }

  return {
    line: pick(lines, seed + "|line"),
    score,
    color: pick(colors, seed + "|color"),
    time: pick(times, seed + "|time"),
    item: pick(items, seed + "|item"),
    tip: pick(tips, seed + "|tip"),
    keyword: pick(keywords, seed + "|kw"),
    flow,
    personalized,
  };
}
