// 오늘의 마음 체크인 (가벼운 자기 점검 — 임상 진단 아님)
// 고른 "기분"마다 그에 맞는 질문을 물어봐요.
// 각 선택지는 value 1(무겁다)~4(가볍다)를 가지며, 평균으로 오늘의 마음 무게를 가늠해요.

export type MoodChoice = { label: string; value: number };
export type MoodQuestion = {
  emoji: string;
  title: string;
  short: string; // 캘린더 다시보기용 짧은 항목명
  choices: MoodChoice[];
};

// 기분(moodId)별 맞춤 질문 풀 (기분당 5개). 시작할 때마다 이 중 3개를 뽑아요.
// 톤: 기쁨·설렘·짜증은 위트 있게 / 우울·불안·외로움·슬픔·번아웃은 더 깊고 다정하게.
export const moodQuestions: Record<string, MoodQuestion[]> = {
  happy: [
    {
      emoji: "✨",
      title: "오늘 기분을 좋게 만든 건 무엇인가요?",
      short: "계기",
      choices: [
        { label: "특별한 일이 있었어요", value: 4 },
        { label: "소소한 순간들이 모였어요", value: 4 },
        { label: "딱히 이유는 없어요", value: 3 },
        { label: "그냥 오늘의 내가 좀 멋졌어요", value: 4 },
      ],
    },
    {
      emoji: "🤝",
      title: "이 기분을 지금 어떻게 하고 싶나요?",
      short: "바람",
      choices: [
        { label: "마음껏 즐기고 싶어요", value: 4 },
        { label: "누군가와 나누고 싶어요", value: 4 },
        { label: "조용히 간직하고 싶어요", value: 3 },
      ],
    },
    {
      emoji: "🕰️",
      title: "이 좋은 기분, 얼마나 갈 것 같나요?",
      short: "지속",
      choices: [
        { label: "한동안 이어질 것 같아요", value: 4 },
        { label: "오늘 하루는 갈 것 같아요", value: 3 },
        { label: "금방 사라질까 살짝 걱정돼요", value: 2 },
      ],
    },
    {
      emoji: "🏷️",
      title: "오늘 이 기분에 이름을 붙인다면?",
      short: "이름",
      choices: [
        { label: "'럭키 데이'", value: 4 },
        { label: "'소확행 모음집'", value: 4 },
        { label: "'이유는 몰라도 개운'", value: 3 },
        { label: "'텐션 최고조'", value: 4 },
      ],
    },
    {
      emoji: "📸",
      title: "오늘을 한 장면으로 남긴다면?",
      short: "장면",
      choices: [
        { label: "활짝 웃는 셀카", value: 4 },
        { label: "좋아하는 사람과 한 컷", value: 4 },
        { label: "맛있는 거 인증샷", value: 4 },
        { label: "그냥 예뻤던 하늘", value: 3 },
      ],
    },
  ],
  flutter: [
    {
      emoji: "💓",
      title: "무엇에 설레고 있나요?",
      short: "대상",
      choices: [
        { label: "곧 있을 일이나 약속", value: 4 },
        { label: "좋아하는 사람", value: 4 },
        { label: "새로운 시작", value: 4 },
        { label: "이유 없이 그냥", value: 3 },
      ],
    },
    {
      emoji: "🌸",
      title: "그 설렘, 티가 나나요?",
      short: "표현",
      choices: [
        { label: "이미 다 티 나요", value: 4 },
        { label: "속으로만 간직해요", value: 3 },
        { label: "들킬까 조마조마해요", value: 3 },
      ],
    },
    {
      emoji: "🌡️",
      title: "이 두근거림은 어떤 온도인가요?",
      short: "온도",
      choices: [
        { label: "기분 좋은 떨림이에요", value: 4 },
        { label: "살짝 긴장도 돼요", value: 3 },
        { label: "설렘 반 불안 반이에요", value: 2 },
      ],
    },
    {
      emoji: "🎢",
      title: "지금 심장 박동을 그래프로 그리면?",
      short: "박동",
      choices: [
        { label: "쿵쾅쿵쾅 급상승", value: 4 },
        { label: "잔잔한 물결", value: 3 },
        { label: "롤러코스터 급이에요", value: 3 },
      ],
    },
    {
      emoji: "🔮",
      title: "이 설렘의 결말을 예상한다면?",
      short: "예감",
      choices: [
        { label: "분명 좋을 거예요", value: 4 },
        { label: "모르니까 더 설레요", value: 4 },
        { label: "기대 말자 싶다가도 두근", value: 3 },
      ],
    },
  ],
  calm: [
    {
      emoji: "🍃",
      title: "이 잔잔함은 어떤 느낌인가요?",
      short: "결",
      choices: [
        { label: "편안한 고요함이에요", value: 4 },
        { label: "그냥 무난해요", value: 3 },
        { label: "조금 심심해요", value: 2 },
        { label: "살짝 공허해요", value: 2 },
      ],
    },
    {
      emoji: "🌿",
      title: "오늘 나를 위한 여유가 있었나요?",
      short: "여유",
      choices: [
        { label: "충분히 있었어요", value: 4 },
        { label: "조금 있었어요", value: 3 },
        { label: "거의 없었어요", value: 2 },
      ],
    },
    {
      emoji: "🤍",
      title: "지금 무언가 바라는 게 있나요?",
      short: "바람",
      choices: [
        { label: "이대로가 좋아요", value: 4 },
        { label: "작은 변화가 있으면 해요", value: 3 },
        { label: "잘 모르겠어요", value: 3 },
      ],
    },
    {
      emoji: "☕",
      title: "오늘을 음료 한 잔으로 표현하면?",
      short: "한잔",
      choices: [
        { label: "따뜻한 차 한 잔", value: 4 },
        { label: "무난한 아메리카노", value: 3 },
        { label: "미지근한 물 한 잔", value: 3 },
        { label: "김빠진 탄산 같아요", value: 2 },
      ],
    },
    {
      emoji: "🎬",
      title: "오늘이 영화라면 장르는?",
      short: "장르",
      choices: [
        { label: "힐링 다큐", value: 4 },
        { label: "잔잔한 일상물", value: 3 },
        { label: "조금 지루한 중간 부분", value: 2 },
      ],
    },
  ],
  down: [
    {
      emoji: "🕰️",
      title: "언제부터 마음이 가라앉았나요?",
      short: "시작",
      choices: [
        { label: "아침부터 쭉이요", value: 2 },
        { label: "어떤 일 이후로요", value: 2 },
        { label: "이유 없이 문득요", value: 2 },
        { label: "며칠째 이어져요", value: 1 },
      ],
    },
    {
      emoji: "🫧",
      title: "몸도 무겁게 느껴지나요?",
      short: "몸",
      choices: [
        { label: "많이 무거워요", value: 1 },
        { label: "조금 그래요", value: 2 },
        { label: "몸은 괜찮아요", value: 3 },
      ],
    },
    {
      emoji: "🧡",
      title: "지금 나에게 필요한 건 무엇일까요?",
      short: "필요",
      choices: [
        { label: "혼자만의 시간", value: 3 },
        { label: "누군가의 위로", value: 3 },
        { label: "푹 쉬는 것", value: 3 },
        { label: "잘 모르겠어요", value: 2 },
      ],
    },
    {
      emoji: "🌧️",
      title: "이 가라앉은 마음을 날씨로 말하면?",
      short: "날씨",
      choices: [
        { label: "그칠 줄 모르는 장대비", value: 1 },
        { label: "부슬부슬 이슬비", value: 2 },
        { label: "흐리지만 곧 갤 것 같은", value: 3 },
      ],
    },
    {
      emoji: "🪶",
      title: "지금 스스로에게 뭐라고 해주고 싶나요?",
      short: "자기말",
      choices: [
        { label: "\"그럴 수 있어, 괜찮아\"", value: 3 },
        { label: "\"오늘은 좀 쉬어도 돼\"", value: 3 },
        { label: "\"왜 이러지…\" 싶어요", value: 1 },
      ],
    },
  ],
  anxious: [
    {
      emoji: "🎯",
      title: "무엇이 가장 마음에 걸리나요?",
      short: "걱정",
      choices: [
        { label: "앞으로 일어날 일", value: 2 },
        { label: "해야 할 일들", value: 2 },
        { label: "관계 문제", value: 2 },
        { label: "콕 집기 어려워요", value: 1 },
      ],
    },
    {
      emoji: "🎚️",
      title: "그 걱정, 지금 손쓸 수 있는 일인가요?",
      short: "통제",
      choices: [
        { label: "사실 대비는 돼 있어요", value: 4 },
        { label: "조금은 할 수 있어요", value: 3 },
        { label: "지금은 어쩔 수 없어요", value: 2 },
      ],
    },
    {
      emoji: "😮‍💨",
      title: "몸에도 긴장이 느껴지나요?",
      short: "긴장",
      choices: [
        { label: "잔뜩 굳어 있어요", value: 1 },
        { label: "조금 그래요", value: 2 },
        { label: "몸은 괜찮아요", value: 3 },
      ],
    },
    {
      emoji: "🔁",
      title: "그 생각이 얼마나 맴도나요?",
      short: "반추",
      choices: [
        { label: "쉬지 않고 계속 맴돌아요", value: 1 },
        { label: "가끔 떠올라요", value: 2 },
        { label: "잊고 있다가도 문득", value: 2 },
      ],
    },
    {
      emoji: "🌍",
      title: "이 걱정, 1년 뒤에도 지금만큼 클까요?",
      short: "거리두기",
      choices: [
        { label: "그때도 클 것 같아요", value: 2 },
        { label: "그땐 작아져 있을 듯", value: 3 },
        { label: "사실 잘 모르겠어요", value: 2 },
      ],
    },
  ],
  empty: [
    {
      emoji: "🛋️",
      title: "지금 몸이 원하는 건 무엇인가요?",
      short: "욕구",
      choices: [
        { label: "그냥 눕고 싶어요", value: 2 },
        { label: "아무것도 안 하기", value: 2 },
        { label: "좋아하는 것 딱 하나", value: 3 },
        { label: "잘 모르겠어요", value: 2 },
      ],
    },
    {
      emoji: "📅",
      title: "이 무기력함, 얼마나 됐나요?",
      short: "기간",
      choices: [
        { label: "오늘만 그래요", value: 3 },
        { label: "며칠째예요", value: 2 },
        { label: "꽤 오래됐어요", value: 1 },
      ],
    },
    {
      emoji: "🫶",
      title: "혹시 스스로를 몰아세우고 있진 않나요?",
      short: "자책",
      choices: [
        { label: "자꾸 나를 탓하게 돼요", value: 1 },
        { label: "조금 그래요", value: 2 },
        { label: "그냥 두고 있어요", value: 3 },
      ],
    },
    {
      emoji: "🔋",
      title: "지금 방전 정도를 %로 말하면?",
      short: "배터리",
      choices: [
        { label: "1% 겨우 켜져 있어요", value: 1 },
        { label: "한 20%쯤", value: 2 },
        { label: "반쯤은 남았어요", value: 3 },
      ],
    },
    {
      emoji: "🐌",
      title: "오늘 나의 속도를 동물로 고르면?",
      short: "속도",
      choices: [
        { label: "멈춰버린 달팽이", value: 1 },
        { label: "느릿한 거북이", value: 2 },
        { label: "널브러진 나무늘보", value: 2 },
      ],
    },
  ],
  burnout: [
    {
      emoji: "🔥",
      title: "무엇이 가장 지치게 했나요?",
      short: "원인",
      choices: [
        { label: "일이나 공부", value: 2 },
        { label: "사람 관계", value: 2 },
        { label: "쉼 없이 달려와서", value: 1 },
        { label: "이유 모를 소진이요", value: 1 },
      ],
    },
    {
      emoji: "🛏️",
      title: "제대로 쉰 게 언제인가요?",
      short: "쉼",
      choices: [
        { label: "최근에 쉬었어요", value: 3 },
        { label: "꽤 오래됐어요", value: 2 },
        { label: "기억이 안 나요", value: 1 },
      ],
    },
    {
      emoji: "📣",
      title: "지금 몸이 보내는 신호는 무엇인가요?",
      short: "신호",
      choices: [
        { label: "잠이 많이 부족해요", value: 2 },
        { label: "여기저기 뻐근해요", value: 2 },
        { label: "마음이 먼저 지쳤어요", value: 1 },
      ],
    },
    {
      emoji: "⚖️",
      title: "요즘 '해야 해'와 '하고 싶어', 어느 쪽이 크나요?",
      short: "균형",
      choices: [
        { label: "온통 '해야 해'뿐이에요", value: 1 },
        { label: "반반쯤이요", value: 2 },
        { label: "'하고 싶어'도 조금 있어요", value: 3 },
      ],
    },
    {
      emoji: "🕯️",
      title: "지금 나에게 허락하고 싶은 건?",
      short: "허락",
      choices: [
        { label: "아무것도 안 할 권리", value: 3 },
        { label: "조금 못해도 괜찮다는 것", value: 3 },
        { label: "누군가에게 기대는 것", value: 3 },
      ],
    },
  ],
  lonely: [
    {
      emoji: "🌙",
      title: "지금 곁에 누가 있으면 좋겠나요?",
      short: "바람",
      choices: [
        { label: "특정한 그 사람이요", value: 3 },
        { label: "누구든 곁에 있으면", value: 2 },
        { label: "사실 혼자가 편해요", value: 3 },
      ],
    },
    {
      emoji: "💬",
      title: "오늘 마음을 나눈 대화가 있었나요?",
      short: "대화",
      choices: [
        { label: "거의 없었어요", value: 1 },
        { label: "형식적인 것뿐이에요", value: 2 },
        { label: "조금 있었어요", value: 3 },
      ],
    },
    {
      emoji: "🌊",
      title: "이 외로움은 어떤 결인가요?",
      short: "결",
      choices: [
        { label: "사무치게 깊어요", value: 1 },
        { label: "잔잔히 있어요", value: 2 },
        { label: "익숙한 편이에요", value: 2 },
      ],
    },
    {
      emoji: "📱",
      title: "지금 누군가에게 연락한다면?",
      short: "연락",
      choices: [
        { label: "용기가 잘 안 나요", value: 1 },
        { label: "할까 말까 망설여져요", value: 2 },
        { label: "한번 해볼까 싶어요", value: 3 },
      ],
    },
    {
      emoji: "🫂",
      title: "이 마음을 누가 알아주면 좋겠나요?",
      short: "이해",
      choices: [
        { label: "딱 한 사람이면 돼요", value: 2 },
        { label: "그냥 누구라도요", value: 2 },
        { label: "나라도 나를 알아주자 싶어요", value: 3 },
      ],
    },
  ],
  angry: [
    {
      emoji: "⚡",
      title: "무엇이 당신을 화나게 했나요?",
      short: "계기",
      choices: [
        { label: "누군가의 말이나 행동", value: 2 },
        { label: "일이 안 풀려서", value: 2 },
        { label: "반복되는 상황이요", value: 1 },
        { label: "콕 집기 어려워요", value: 2 },
      ],
    },
    {
      emoji: "🌡️",
      title: "그 화, 지금 얼마나 큰가요?",
      short: "크기",
      choices: [
        { label: "부글부글 끓어올라요", value: 1 },
        { label: "욱하다 가라앉는 중", value: 2 },
        { label: "남은 잔불 정도예요", value: 3 },
      ],
    },
    {
      emoji: "🌬️",
      title: "이 감정을 어떻게 하고 싶나요?",
      short: "바람",
      choices: [
        { label: "시원하게 풀고 싶어요", value: 3 },
        { label: "이해받고 싶어요", value: 3 },
        { label: "혼자 삭이고 싶어요", value: 2 },
      ],
    },
    {
      emoji: "🌋",
      title: "지금 이 화를 온도로 재면?",
      short: "온도",
      choices: [
        { label: "용암급 부글부글", value: 1 },
        { label: "펄펄 끓는 물", value: 2 },
        { label: "미지근해지는 중", value: 3 },
      ],
    },
    {
      emoji: "🥊",
      title: "속으로 하고 싶은 말, 있나요?",
      short: "속말",
      choices: [
        { label: "엄청 많아요", value: 2 },
        { label: "딱 한마디 있어요", value: 2 },
        { label: "말해도 소용없을 것 같아요", value: 1 },
      ],
    },
  ],
  sad: [
    {
      emoji: "💧",
      title: "지금 울고 싶은 마음이 드나요?",
      short: "눈물",
      choices: [
        { label: "이미 울었어요", value: 2 },
        { label: "울컥울컥해요", value: 2 },
        { label: "꾹 참고 있어요", value: 1 },
        { label: "그 정돈 아니에요", value: 3 },
      ],
    },
    {
      emoji: "🫂",
      title: "이 슬픔을 어떻게 하고 싶나요?",
      short: "바람",
      choices: [
        { label: "혼자 조용히 있고 싶어요", value: 3 },
        { label: "누군가에게 기대고 싶어요", value: 3 },
        { label: "실컷 울고 싶어요", value: 3 },
      ],
    },
    {
      emoji: "🔎",
      title: "슬픔의 이유를 알고 있나요?",
      short: "이유",
      choices: [
        { label: "분명히 알아요", value: 3 },
        { label: "어렴풋이 알아요", value: 2 },
        { label: "이유 없이 슬퍼요", value: 1 },
      ],
    },
    {
      emoji: "🌧️",
      title: "이 슬픔이 머문 지는 얼마나 됐나요?",
      short: "기간",
      choices: [
        { label: "오늘 갑자기 찾아왔어요", value: 2 },
        { label: "며칠째 머물러요", value: 1 },
        { label: "오래된 것 같아요", value: 1 },
      ],
    },
    {
      emoji: "🕊️",
      title: "이 눈물이 지나고 나면 어떨 것 같나요?",
      short: "이후",
      choices: [
        { label: "조금은 가벼워질 것 같아요", value: 3 },
        { label: "잘 모르겠어요", value: 2 },
        { label: "또 찾아올 것 같아요", value: 1 },
      ],
    },
  ],
};

// 기분당 추가 질문 5개 (위 5개와 합쳐 총 10개 풀)
export const moodQuestionsExtra: Record<string, MoodQuestion[]> = {
  happy: [
    { emoji: "🎁", title: "이 좋은 기분, 누구에게 나눠주고 싶나요?", short: "나눔", choices: [{ label: "가까운 사람에게", value: 4 }, { label: "만나는 모두에게", value: 4 }, { label: "우선 나 자신에게", value: 3 }] },
    { emoji: "🌈", title: "오늘을 색으로 칠한다면?", short: "색", choices: [{ label: "쨍한 노랑", value: 4 }, { label: "따뜻한 주황", value: 4 }, { label: "맑은 하늘색", value: 3 }] },
    { emoji: "🎵", title: "지금 어울리는 BGM은?", short: "BGM", choices: [{ label: "신나는 팝", value: 4 }, { label: "콧노래 절로", value: 4 }, { label: "잔잔한 발라드", value: 3 }] },
    { emoji: "⭐", title: "오늘 나에게 별점을 준다면?", short: "별점", choices: [{ label: "별 다섯 개!", value: 4 }, { label: "기대 이상이었어요", value: 4 }, { label: "네 개쯤은 돼요", value: 3 }] },
    { emoji: "💐", title: "이 기분을 내일까지 데려가려면?", short: "이어가기", choices: [{ label: "오늘 푹 자두기", value: 4 }, { label: "기록해두기", value: 4 }, { label: "그냥 실컷 즐기기", value: 3 }] },
  ],
  flutter: [
    { emoji: "🎬", title: "이 설렘이 영화 장면이라면?", short: "장면", choices: [{ label: "설레는 첫 만남", value: 4 }, { label: "두근대는 고백", value: 4 }, { label: "반가운 재회", value: 4 }] },
    { emoji: "🌟", title: "설렘 지수를 별로 매기면?", short: "지수", choices: [{ label: "별 다섯 개", value: 4 }, { label: "별 네 개", value: 4 }, { label: "별 세 개", value: 3 }] },
    { emoji: "📞", title: "이 마음, 누구에게 말하고 싶나요?", short: "공유", choices: [{ label: "절친에게 자랑", value: 4 }, { label: "그 사람에게", value: 3 }, { label: "혼자 간직", value: 3 }] },
    { emoji: "🍬", title: "이 설렘의 맛을 고르면?", short: "맛", choices: [{ label: "달콤한 솜사탕", value: 4 }, { label: "톡 쏘는 사이다", value: 4 }, { label: "새콤달콤 사탕", value: 3 }] },
    { emoji: "🎈", title: "지금 마음이 붕 떠 있나요?", short: "부력", choices: [{ label: "둥둥 떠 있어요", value: 4 }, { label: "구름 위 같아요", value: 4 }, { label: "살짝 들떠요", value: 3 }] },
  ],
  calm: [
    { emoji: "🛶", title: "오늘 마음의 흐름은?", short: "흐름", choices: [{ label: "잔잔한 호수", value: 4 }, { label: "느린 강물", value: 3 }, { label: "고인 물 같기도", value: 2 }] },
    { emoji: "🍵", title: "지금 딱 하고 싶은 건?", short: "하고픔", choices: [{ label: "따뜻한 차 한 잔", value: 4 }, { label: "가만히 멍때리기", value: 3 }, { label: "딱히 없어요", value: 3 }] },
    { emoji: "🌤️", title: "오늘 마음 날씨 예보는?", short: "예보", choices: [{ label: "대체로 맑음", value: 4 }, { label: "구름 조금", value: 3 }, { label: "무난한 흐림", value: 3 }] },
    { emoji: "🧩", title: "오늘 하루의 완성도는?", short: "완성도", choices: [{ label: "무난히 채웠어요", value: 3 }, { label: "그럭저럭이요", value: 3 }, { label: "조금 비어 보여요", value: 2 }] },
    { emoji: "🕊️", title: "지금 마음에 걸리는 게 있나요?", short: "걸림", choices: [{ label: "없어요, 평온해요", value: 4 }, { label: "사소한 것 하나", value: 3 }, { label: "뭔가 좀 허전해요", value: 2 }] },
  ],
  down: [
    { emoji: "🌫️", title: "지금 마음의 시야는 어떤가요?", short: "시야", choices: [{ label: "온통 뿌옇어요", value: 1 }, { label: "조금 흐릿해요", value: 2 }, { label: "그래도 보여요", value: 3 }] },
    { emoji: "🫀", title: "가슴이 답답하게 느껴지나요?", short: "답답", choices: [{ label: "많이요", value: 1 }, { label: "조금요", value: 2 }, { label: "그건 괜찮아요", value: 3 }] },
    { emoji: "🔦", title: "오늘 작은 빛 하나쯤 있었나요?", short: "빛", choices: [{ label: "딱히 없었어요", value: 1 }, { label: "작게 하나 있었어요", value: 3 }, { label: "찾아보면 있을 듯", value: 2 }] },
    { emoji: "🧸", title: "지금 위로가 되는 건 무엇인가요?", short: "위로", choices: [{ label: "따뜻한 이불 속", value: 3 }, { label: "좋아하는 음악", value: 3 }, { label: "잘 모르겠어요", value: 2 }] },
    { emoji: "🕰️", title: "이 기분에 시간을 준다면?", short: "시간", choices: [{ label: "좀 오래 걸릴 듯", value: 1 }, { label: "며칠이면 나아질 듯", value: 2 }, { label: "곧 괜찮아질 것 같아요", value: 3 }] },
  ],
  anxious: [
    { emoji: "🌪️", title: "머릿속이 얼마나 시끄러운가요?", short: "소음", choices: [{ label: "폭풍이 몰아쳐요", value: 1 }, { label: "웅성웅성해요", value: 2 }, { label: "조용한 편이에요", value: 3 }] },
    { emoji: "🫁", title: "지금 숨은 어떤가요?", short: "숨", choices: [{ label: "얕고 빨라요", value: 1 }, { label: "조금 답답해요", value: 2 }, { label: "고른 편이에요", value: 3 }] },
    { emoji: "🛡️", title: "최악의 상황을 자꾸 상상하나요?", short: "상상", choices: [{ label: "자꾸 그래요", value: 1 }, { label: "가끔요", value: 2 }, { label: "아니요", value: 3 }] },
    { emoji: "✍️", title: "그 걱정, 적어두면 좀 나을까요?", short: "정리", choices: [{ label: "이미 정리해봤어요", value: 4 }, { label: "도움 될 것 같아요", value: 3 }, { label: "해봐야 알 듯해요", value: 2 }] },
    { emoji: "🤲", title: "지금 붙잡을 수 있는 '확실한 것'은?", short: "지금", choices: [{ label: "여기, 이 순간이요", value: 3 }, { label: "하나쯤 있어요", value: 3 }, { label: "잘 안 보여요", value: 1 }] },
  ],
  empty: [
    { emoji: "🍽️", title: "오늘 끼니는 챙겼나요?", short: "끼니", choices: [{ label: "챙겨 먹었어요", value: 3 }, { label: "대충 때웠어요", value: 2 }, { label: "걸렀어요", value: 1 }] },
    { emoji: "🪟", title: "지금 커튼은 열려 있나요?", short: "햇빛", choices: [{ label: "활짝 열려 있어요", value: 3 }, { label: "조금 열려 있어요", value: 2 }, { label: "다 닫혀 있어요", value: 1 }] },
    { emoji: "🎯", title: "딱 하나 한다면 뭐가 제일 쉬울까요?", short: "한걸음", choices: [{ label: "물 한 잔 마시기", value: 3 }, { label: "세수하기", value: 3 }, { label: "그것도 모르겠어요", value: 2 }] },
    { emoji: "📉", title: "지금 의욕 그래프는?", short: "의욕", choices: [{ label: "바닥에 일자예요", value: 1 }, { label: "살짝 꿈틀해요", value: 2 }, { label: "오르락내리락", value: 2 }] },
    { emoji: "☁️", title: "이 무기력함은 어떤 무게인가요?", short: "무게", choices: [{ label: "온몸을 눌러요", value: 1 }, { label: "어깨쯤에 얹혀요", value: 2 }, { label: "안개처럼 가벼워요", value: 3 }] },
  ],
  burnout: [
    { emoji: "😴", title: "요즘 잠은 어떤가요?", short: "잠", choices: [{ label: "자도 개운치 않아요", value: 1 }, { label: "자꾸 뒤척여요", value: 2 }, { label: "그럭저럭 자요", value: 3 }] },
    { emoji: "🪫", title: "재충전에 필요한 건 무엇일까요?", short: "충전", choices: [{ label: "긴 휴식이요", value: 2 }, { label: "혼자만의 시간", value: 3 }, { label: "그냥 아무것도", value: 2 }] },
    { emoji: "🎭", title: "괜찮은 척하고 있진 않나요?", short: "가면", choices: [{ label: "계속 그래요", value: 1 }, { label: "가끔요", value: 2 }, { label: "아니요", value: 3 }] },
    { emoji: "📵", title: "잠깐 다 꺼두고 싶나요?", short: "차단", choices: [{ label: "정말 그래요", value: 2 }, { label: "조금요", value: 3 }, { label: "아니요", value: 3 }] },
    { emoji: "🌱", title: "아주 작게라도 위안이 되는 건?", short: "위안", choices: [{ label: "곧 쉴 수 있다는 것", value: 3 }, { label: "따뜻한 것 하나", value: 3 }, { label: "잘 모르겠어요", value: 1 }] },
  ],
  lonely: [
    { emoji: "🪟", title: "창밖 불빛을 보면 어떤가요?", short: "불빛", choices: [{ label: "더 외로워져요", value: 1 }, { label: "그냥 그래요", value: 2 }, { label: "포근하기도 해요", value: 3 }] },
    { emoji: "📖", title: "이 마음을 어디에 털어놓고 싶나요?", short: "털어놓기", choices: [{ label: "누군가에게요", value: 3 }, { label: "일기장에요", value: 2 }, { label: "아무 데도 못하겠어요", value: 1 }] },
    { emoji: "🐾", title: "지금 곁에 뭐가 있으면 좋겠나요?", short: "곁", choices: [{ label: "사람의 온기", value: 2 }, { label: "포근한 반려동물", value: 3 }, { label: "따뜻한 담요", value: 3 }] },
    { emoji: "🌙", title: "이 밤이 길게 느껴지나요?", short: "밤", choices: [{ label: "아주 길어요", value: 1 }, { label: "조금 길어요", value: 2 }, { label: "견딜 만해요", value: 3 }] },
    { emoji: "💌", title: "지금 누군가 연락이 온다면?", short: "연락받기", choices: [{ label: "무척 고마울 듯", value: 3 }, { label: "정말 반가울 듯", value: 2 }, { label: "부담될 수도 있어요", value: 2 }] },
  ],
  angry: [
    { emoji: "🎤", title: "이 화를 한 문장으로 외친다면?", short: "외침", choices: [{ label: "\"너무하잖아!\"", value: 2 }, { label: "\"이해가 안 돼!\"", value: 2 }, { label: "\"나도 힘들다고!\"", value: 2 }] },
    { emoji: "⏰", title: "이 화, 얼마나 갈 것 같나요?", short: "지속", choices: [{ label: "꽤 오래갈 듯", value: 1 }, { label: "조금 있다 풀릴 듯", value: 2 }, { label: "벌써 풀리는 중", value: 3 }] },
    { emoji: "🧯", title: "화를 식히는 나만의 방법이 있나요?", short: "진화법", choices: [{ label: "이미 쓰는 중이에요", value: 3 }, { label: "있긴 해요", value: 3 }, { label: "딱히 없어요", value: 2 }] },
    { emoji: "🥤", title: "지금 당장 하고 싶은 건?", short: "당장", choices: [{ label: "시원한 거 마시기", value: 3 }, { label: "혼자 있기", value: 2 }, { label: "소리 지르기", value: 2 }] },
    { emoji: "🪞", title: "사실은 서운한 마음도 있나요?", short: "이면", choices: [{ label: "많이요", value: 2 }, { label: "조금요", value: 2 }, { label: "아니요, 그냥 화예요", value: 2 }] },
  ],
  sad: [
    { emoji: "🌧️", title: "이 슬픔의 세기는 어느 정도인가요?", short: "세기", choices: [{ label: "장대비처럼요", value: 1 }, { label: "보슬비처럼요", value: 2 }, { label: "그쳐가는 중이에요", value: 3 }] },
    { emoji: "🫂", title: "지금 누가 안아주면 좋겠나요?", short: "품", choices: [{ label: "그 사람이요", value: 3 }, { label: "누구든지요", value: 2 }, { label: "나 자신이요", value: 3 }] },
    { emoji: "🎵", title: "지금 어울리는 노래는?", short: "노래", choices: [{ label: "위로가 되는 곡", value: 3 }, { label: "잔잔한 피아노", value: 3 }, { label: "슬픈 발라드", value: 2 }] },
    { emoji: "💭", title: "이 감정을 참고 있진 않나요?", short: "억누름", choices: [{ label: "흘려보내는 중이에요", value: 3 }, { label: "조금 참아요", value: 2 }, { label: "꾹 참고 있어요", value: 1 }] },
    { emoji: "🌱", title: "이 슬픔이 나에게 무엇을 남길까요?", short: "의미", choices: [{ label: "조금 단단해질 듯", value: 3 }, { label: "잘 모르겠어요", value: 2 }, { label: "그냥 아픔뿐이에요", value: 1 }] },
  ],
};

/** 시작할 때마다 기분 풀(10개)에서 질문 n개를 무작위로 골라 반환 */
export function buildMoodQuestions(moodId: string, n = 6): MoodQuestion[] {
  const pool = [
    ...(moodQuestions[moodId] || []),
    ...(moodQuestionsExtra[moodId] || []),
  ];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(n, pool.length));
}

/** 평균값(1~4)을 100점 만점 마음 점수로 환산 */
export function moodScore(avg: number): number {
  return Math.round((avg / 4) * 100);
}

// 답변 평균으로 오늘의 마음 무게 유형을 계산
export type Profile = {
  avg: number;
  label: string;
  emoji: string;
  summary: string;
  gentleSupport?: string;
};

export function computeProfile(values: number[]): Profile {
  const avg =
    values.length > 0 ? values.reduce((s, v) => s + v, 0) / values.length : 2.5;

  let label: string;
  let emoji: string;
  let summary: string;
  if (avg >= 3.3) {
    label = "한결 가벼운 하루";
    emoji = "🌟";
    summary =
      "마음이 밝고 가벼운 쪽에 있어요. 이 좋은 기운을 오래 간직해 두세요.";
  } else if (avg >= 2.6) {
    label = "잔잔히 흘러가는 하루";
    emoji = "🍃";
    summary =
      "크게 치우침 없이 잔잔하게 흘러가는 하루예요. 그 자체로 충분히 잘 지내고 있어요.";
  } else if (avg >= 1.9) {
    label = "조금 버거운 하루";
    emoji = "🌥️";
    summary =
      "버겁고 무거운 부분이 있었던 하루네요. 오늘은 나를 조금 더 다정하게 대해도 돼요.";
  } else {
    label = "돌봄이 필요한 하루";
    emoji = "🌧️";
    summary =
      "마음이 많이 무거운 하루예요. 여기까지 버텨온 것만으로 충분히 애썼어요. 오늘은 나를 돌보는 걸 가장 앞에 두어요.";
  }

  const profile: Profile = { avg, label, emoji, summary };
  if (avg <= 1.6) {
    profile.gentleSupport =
      "혹시 이런 마음이 며칠째 이어지고 있다면, 믿을 만한 사람이나 전문가에게 마음을 나눠보는 것도 좋은 방법이에요. 당신은 혼자가 아니에요.";
  }
  return profile;
}

// --- 편지형 결과: 감정 인정 문장 ---
export const feelingAdj: Record<string, string> = {
  happy: "기분 좋은",
  flutter: "설레는",
  calm: "잔잔한",
  down: "가라앉은",
  anxious: "불안한",
  empty: "기운 없는",
  burnout: "지친",
  lonely: "외로운",
  angry: "화가 난",
  sad: "슬픈",
};

const ACK_ADV = ["", "살짝", "조금", "", "꽤", "많이"]; // intensity 1~5

/** 고른 감정과 강도를 문장으로 되받아 인정 */
export function acknowledgment(moodId: string, intensity: number): string {
  const adv = ACK_ADV[intensity] ?? "";
  const adj = feelingAdj[moodId] ?? "";
  return `오늘은 ${adv ? adv + " " : ""}${adj} 하루였군요.`;
}

// --- 메모 반영: 적은 한 줄에서 키워드를 알아채 맞춤 문장을 더해요 (API 없이) ---
type Reflection = { keys: string[]; line: string };

const reflections: Reflection[] = [
  {
    keys: ["해냈", "해 냈", "끝냈", "끝 냈", "마무리", "합격", "성공", "칭찬", "뿌듯", "잘했", "잘 했", "이겼", "완성", "해결", "붙었"],
    line: "오늘 해낸 그 일, 결코 작지 않아요. 스스로를 충분히 칭찬해줘도 돼요.",
  },
  {
    keys: ["친구", "사람", "엄마", "아빠", "부모", "가족", "애인", "남친", "여친", "연인", "헤어", "싸웠", "싸움", "다퉜", "다툼", "갈등", "서운", "동료", "선배", "후배", "관계"],
    line: "관계에서 오는 마음은 참 무겁죠. 오늘 그 일이 온전히 당신 탓만은 아니에요.",
  },
  {
    keys: ["아프", "아파", "몸살", "감기", "두통", "병원", "불면", "못 잤", "못잤", "잠을", "잠이", "피곤", "지쳐", "지침", "힘들", "졸려"],
    line: "몸이 먼저 신호를 보내고 있네요. 오늘은 무엇보다 쉼을 앞에 두어요.",
  },
  {
    keys: ["야근", "마감", "회의", "미팅", "발표", "업무", "프로젝트", "출근", "퇴근", "상사", "과제", "시험", "공부", "일이", "일에", "일을", "알바", "바빴", "바쁘", "출장"],
    line: "할 일에 치인 하루였네요. 오늘 당신의 몫은 충분히 다 했어요.",
  },
  {
    keys: ["밥", "굶", "못 먹", "안 먹", "배고", "끼니", "식사"],
    line: "우선 따뜻한 거라도 챙겨 드세요. 나를 먹이는 것도 나를 돌보는 일이에요.",
  },
  {
    keys: ["돈", "월급", "카드값", "빚", "통장", "지출", "월세", "생활비"],
    line: "현실적인 걱정은 마음을 참 무겁게 하죠. 여기까지 온 것만으로 잘 해내고 있어요.",
  },
  {
    keys: ["쉬었", "쉬는", "산책", "여행", "놀았", "취미", "게임", "영화", "카페", "휴식", "쉼", "낮잠"],
    line: "잘 쉬어준 하루네요. 그렇게 나를 채우는 시간, 꼭 필요해요.",
  },
  {
    keys: ["비가", "비 와", "비와", "장마", "눈이", "더위", "더워", "추위", "추워", "날씨", "흐림", "흐려"],
    line: "날씨마저 마음을 거들 때가 있죠. 그런 날엔 나에게 조금 더 너그러워도 돼요.",
  },
];

/** 메모에서 키워드를 찾아 어울리는 반영 문장을 반환 (없으면 null) */
export function reflectNote(note: string): string | null {
  const t = (note || "").trim();
  if (!t) return null;
  for (const r of reflections) {
    if (r.keys.some((k) => t.includes(k))) return r.line;
  }
  return null;
}

// --- 상담 소견: 실제 답변을 읽어 개인화된 리딩 + 구체적 제안 ---
export type AnalysisItem = { short: string; answer: string; value: number };
export type Analysis = { read: string; suggestion: string; caution?: string };

const ANALYSIS_DEG = ["", "아주 옅게", "옅게", "적당한 세기로", "꽤 뚜렷하게", "매우 강하게"];

// 기분별 구체적·행동적 제안 (전문 상담 톤)
const suggestions: Record<string, string[]> = {
  happy: [
    "지금의 좋은 상태를 한 줄이라도 기록해 두세요. 힘든 날 스스로에게 내미는 근거 자료가 됩니다.",
    "오늘 느낀 긍정을 한 사람과 나눠보세요. 좋은 감정은 표현할수록 더 오래 유지돼요.",
  ],
  flutter: [
    "설렘의 대상을 구체적으로 적어보세요. 기대가 선명해지면, 실망도 그만큼 다루기 쉬워져요.",
    "이 에너지를 미뤄둔 일 하나에 써보세요. 두근거릴 때 시작한 일이 가장 오래 갑니다.",
  ],
  calm: [
    "지금의 안정감이 어디서 오는지 한 가지만 짚어보세요. 다음에 다시 꺼내 쓸 수 있는 나만의 자원이 됩니다.",
    "잔잔할 때가 회복의 골든타임이에요. 미뤄둔 나를 위한 작은 일 하나를 오늘 해보세요.",
  ],
  down: [
    "가장 쉬운 일 하나만 정해 딱 5분 해보세요. 가라앉은 기분엔 '행동이 먼저, 기분은 나중'이 더 잘 통합니다.",
    "따뜻한 물로 손을 씻거나 짧게 샤워해보세요. 체온의 작은 변화가 가라앉은 마음을 살짝 끌어올려요.",
  ],
  anxious: [
    "걱정을 '지금 할 수 있는 것 / 지금은 어쩔 수 없는 것' 두 칸으로 나눠 적어보세요. 통제 가능한 것에만 에너지를 모으는 연습이에요.",
    "4초 들이쉬고 6초 내쉬는 호흡을 다섯 번. 날숨을 길게 하면 몸의 긴장 반응이 실제로 가라앉아요.",
  ],
  empty: [
    "'해야 할 일'이 아니라 '해도 되는 일' 하나만 골라보세요. 물 한 잔, 창문 열기처럼 아주 작은 것으로요.",
    "무기력엔 '10분만' 규칙이 유효해요. 딱 10분 뒤 그만둬도 좋다는 마음으로 하나만 시작해보세요.",
  ],
  burnout: [
    "오늘 밤은 '아무 생산성 없는 시간' 30분을 일부러 비워두세요. 회복은 계획된 무위(無爲)에서 시작됩니다.",
    "지금 짊어진 것 중 '내려놔도 되는 것' 하나를 찾아보세요. 다 잘 해내는 것보다 덜어내는 게 지금은 더 중요해요.",
  ],
  lonely: [
    "부담 없는 한 사람에게 안부 한 줄만 보내보세요. 연결은 완벽할 필요 없이, 짧고 가벼워도 충분해요.",
    "혼자인 시간을 '고립'이 아니라 '나와의 시간'으로 재정의해보세요. 좋아하는 것 하나를 나에게 대접하듯이요.",
  ],
  angry: [
    "화의 '진짜 이유'를 한 문장으로 적어보세요. 분노 뒤엔 대개 지켜지지 못한 나의 기준이나 바람이 숨어 있어요.",
    "행동으로 옮기기 전에 90초만 기다려보세요. 분노의 신체 반응은 대개 그 시간이 지나면 정점을 지납니다.",
  ],
  sad: [
    "감정을 참지 말고 딱 10분만 온전히 느껴보세요. 억누른 슬픔은 오래가고, 흘려보낸 슬픔은 옅어집니다.",
    "슬픔에 이름을 붙여보세요. '서운함'인지 '상실'인지 '지침'인지 구분되면, 필요한 위로도 분명해져요.",
  ],
};

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 실제 답변(가장 낮은/높은 항목)을 짚어 개인화된 소견을 만든다 */
export function computeAnalysis(
  moodId: string,
  intensity: number,
  items: AnalysisItem[]
): Analysis | null {
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => a.value - b.value);
  const low = sorted[0];
  const high = sorted[sorted.length - 1];
  const adj = feelingAdj[moodId] || "";
  const deg = ANALYSIS_DEG[intensity] || "";

  let read = `선택하신 답을 종합하면, 오늘은 ${adj} 감정이 ${deg} 자리 잡은 하루였어요.`;
  if (low && high && low.short !== high.short && high.value - low.value >= 1) {
    read += ` 특히 ‘${low.short}’ 쪽(“${low.answer}”)이 가장 무겁게 느껴졌고, 반대로 ‘${high.short}’ 쪽(“${high.answer}”)에서는 그래도 스스로를 지탱하는 힘이 남아 있었어요.`;
  } else if (low) {
    read += ` 그중 ‘${low.short}’ 부분(“${low.answer}”)이 지금 마음을 가장 크게 누르는 지점으로 보여요.`;
  }

  const analysis: Analysis = {
    read,
    suggestion: pickOne(suggestions[moodId] || suggestions.calm),
  };

  const avg = items.reduce((s, i) => s + i.value, 0) / items.length;
  if (avg <= 1.7) {
    analysis.caution =
      "만약 이런 무거움이 2주 이상 이어지거나 일상(수면·식사·의욕)에 뚜렷한 지장이 생긴다면, 전문 상담을 받아보시길 권해요. 그건 약함이 아니라 나를 돌보는 현명한 선택이에요.";
  }
  return analysis;
}
