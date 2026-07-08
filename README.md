# 오늘의 기분 🌤️

오늘의 기분을 고르거나 직접 적으면, 어울리는 **위로·응원 한마디와 명언**을 건네주는 Next.js 웹앱입니다.
매일 다시 찾고 싶도록 *오늘의 한마디 · 마음 날씨 기록 · 분위기 배경 · 공유 카드*를 담았어요.

## 주요 기능

- **⭐ 오늘의 한마디** — 날짜를 시드로 매일 하나의 명언/문장이 상단에 고정돼요. 하루 동안 같고, 매일 바뀝니다.
- **기분별 맞춤 한마디** — 기분을 고르면 창작 위로글 + 어울리는 **명언(출처 표기)**을 함께 건네요. "다른 한마디 🔄"로 순환할 수 있어요.
- **분위기 배경** — 고른 기분에 따라 배경 그라데이션과 은은하게 떠다니는 오브가 바뀌어 화면 자체가 위로가 되게 했어요. (`prefers-reduced-motion` 존중)
- **마음 날씨 캘린더** — 그날 고른 기분이 달력에 이모지로 기록돼요. 한 달 흐름을 한눈에 보고, 연속 기록(스트릭)도 표시돼요.
- **마음에 담기 🔖** — 좋았던 한마디를 스크랩해 "담은 문장" 탭에 모아볼 수 있어요.
- **공유 카드 🖼️** — 오늘의 기분·한마디를 세로형(스토리 비율) 이미지 카드(PNG)로 저장 → SNS에 올리기 좋아요.

> 기록·스크랩은 모두 브라우저 **localStorage**에만 저장돼요. 서버도, API 키도 필요 없어요.

## 콘텐츠 수정하기

문구는 전부 `data/moods.ts` 한 파일에 모여 있어요.

- `moods[].messages` — 기분별 창작 위로 한마디
- `moods[].quotes` — 기분별 명언 (`text`, `author`)
- `moods[].bg` — 그 기분의 분위기 배경 그라데이션 색 두 개
- `dailyOneLiners` — 상단 "오늘의 한마디" 후보 (날짜 시드로 선택)
- `freeInputMessages` / `freeInputQuotes` — 직접 입력형일 때의 문구

> 명언(`author`)은 실제 출처가 확실한 것만 인물명을 적었고, 창작 문장은 "오늘의 기분" 또는 "작자 미상"으로 두었습니다. 인물 인용을 추가할 땐 출처를 꼭 확인해 주세요.

## 폴더 구조

```
app/            Next.js App Router (layout, page, globals.css)
components/     MoodApp · MoodCalendar · ShareCard
data/moods.ts   모든 문구·명언·색 데이터
lib/            storage(localStorage) · pick(날짜 시드·랜덤)
```

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm start        # 빌드된 앱 실행
```

## 기술 스택

- Next.js 14 (App Router) · React 18 · TypeScript
- 순수 CSS (별도 UI 라이브러리 없음), Canvas API로 공유 카드 생성
