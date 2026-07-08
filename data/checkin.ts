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

const structuredMoodQuestions: Record<string, MoodQuestion[]> = {
  happy: [
    { emoji: "☀️", title: "오늘 기분이 좋아진 데에는 비교적 분명한 이유가 있나요?", short: "이유", choices: [{ label: "분명한 계기가 있었어요", value: 4 }, { label: "소소한 좋은 일이 겹쳤어요", value: 4 }, { label: "이유는 뚜렷하지 않지만 안정적이에요", value: 3 }] },
    { emoji: "🫶", title: "이 좋은 기분이 지금 나에게 어떤 도움을 주고 있나요?", short: "도움", choices: [{ label: "에너지와 의욕이 올라와요", value: 4 }, { label: "사람들과 편하게 연결돼요", value: 4 }, { label: "마음이 한결 안정돼요", value: 3 }] },
    { emoji: "🧭", title: "지금의 좋은 상태는 얼마나 안정적으로 느껴지나요?", short: "안정감", choices: [{ label: "꽤 안정적으로 유지돼요", value: 4 }, { label: "오늘 하루는 이어질 것 같아요", value: 3 }, { label: "좋지만 금방 사라질까 걱정돼요", value: 2 }] },
    { emoji: "📝", title: "이 기분을 어떻게 남기고 싶나요?", short: "기록", choices: [{ label: "기록해두고 싶어요", value: 4 }, { label: "누군가와 나누고 싶어요", value: 4 }, { label: "그냥 조용히 누리고 싶어요", value: 3 }] },
    { emoji: "🌿", title: "지금의 상태에서 스스로에게 가장 해주고 싶은 말은 무엇인가요?", short: "자기말", choices: [{ label: "\"잘 해내고 있어\"", value: 4 }, { label: "\"이 감정을 충분히 누려도 돼\"", value: 4 }, { label: "\"무리하지 말고 이 리듬을 지켜보자\"", value: 3 }] },
    { emoji: "🔎", title: "이 좋은 감정이 이후에도 유지되려면 무엇이 필요할까요?", short: "유지", choices: [{ label: "지금의 리듬을 해치지 않는 것", value: 4 }, { label: "조금 더 나를 챙기는 것", value: 4 }, { label: "기록해두고 다시 꺼내보는 것", value: 3 }] },
  ],
  flutter: [
    { emoji: "💓", title: "지금의 설렘에는 기대와 긴장 중 어떤 감정이 더 크게 섞여 있나요?", short: "감정결", choices: [{ label: "기대가 더 커요", value: 4 }, { label: "기대와 긴장이 비슷해요", value: 3 }, { label: "긴장도 꽤 커요", value: 2 }] },
    { emoji: "🎯", title: "이 설렘의 대상은 비교적 분명한 편인가요?", short: "대상", choices: [{ label: "무엇 때문인지 분명해요", value: 4 }, { label: "대강은 알겠어요", value: 3 }, { label: "명확하지 않지만 들떠 있어요", value: 3 }] },
    { emoji: "🫁", title: "몸의 반응으로 보면 이 설렘은 편안한 편인가요?", short: "신체", choices: [{ label: "편안하고 기분 좋은 떨림이에요", value: 4 }, { label: "약간 긴장되지만 괜찮아요", value: 3 }, { label: "들뜨지만 불안도 함께 있어요", value: 2 }] },
    { emoji: "🧠", title: "이 감정이 생각을 어떻게 바꾸고 있나요?", short: "생각", choices: [{ label: "앞일을 긍정적으로 보게 돼요", value: 4 }, { label: "자꾸 그 일만 떠올라요", value: 3 }, { label: "기대와 걱정이 번갈아 와요", value: 2 }] },
    { emoji: "🗣️", title: "이 마음을 밖으로 표현하고 싶은 편인가요?", short: "표현", choices: [{ label: "표현하고 싶어요", value: 4 }, { label: "조용히 간직하고 싶어요", value: 3 }, { label: "표현하면 깨질까 조심스러워요", value: 2 }] },
    { emoji: "📍", title: "이 설렘이 지금 생활에 주는 영향은 어떤가요?", short: "영향", choices: [{ label: "활력을 줘요", value: 4 }, { label: "집중이 조금 흔들려요", value: 3 }, { label: "좋지만 피로도 함께 와요", value: 2 }] },
  ],
  calm: [
    { emoji: "🍃", title: "지금의 잔잔함은 편안함에 가깝나요, 무감함에 가깝나요?", short: "결", choices: [{ label: "편안하고 안정적이에요", value: 4 }, { label: "그냥 무난한 상태예요", value: 3 }, { label: "조금 무덤덤한 편이에요", value: 2 }] },
    { emoji: "🫖", title: "오늘 하루 속도는 나에게 무리가 없는 편이었나요?", short: "속도", choices: [{ label: "무리 없는 리듬이었어요", value: 4 }, { label: "조금 바빴지만 괜찮았어요", value: 3 }, { label: "겉으론 잔잔하지만 속은 지쳤어요", value: 2 }] },
    { emoji: "🧭", title: "지금 상태에서 가장 잘 유지되고 있는 부분은 무엇인가요?", short: "유지", choices: [{ label: "감정 기복이 크지 않아요", value: 4 }, { label: "생각이 비교적 정돈돼 있어요", value: 3 }, { label: "그럭저럭 버티는 정도예요", value: 3 }] },
    { emoji: "🤍", title: "이 평온함을 해치는 요소가 지금 있나요?", short: "방해", choices: [{ label: "거의 없어요", value: 4 }, { label: "작은 걱정 하나쯤 있어요", value: 3 }, { label: "겉만 괜찮고 안은 조금 복잡해요", value: 2 }] },
    { emoji: "🌱", title: "오늘 나를 위해 챙긴 작은 여유가 있었나요?", short: "여유", choices: [{ label: "분명히 있었어요", value: 4 }, { label: "짧게라도 있었어요", value: 3 }, { label: "거의 없었어요", value: 2 }] },
    { emoji: "📌", title: "지금 상태에서 스스로에게 가장 필요한 태도는 무엇일까요?", short: "태도", choices: [{ label: "이 리듬을 유지하는 것", value: 4 }, { label: "조금 더 나를 챙기는 것", value: 3 }, { label: "괜찮은 척하지 않는 것", value: 2 }] },
  ],
  down: [
    { emoji: "🌧️", title: "가라앉은 기분이 오늘 하루 전반에 얼마나 영향을 주고 있나요?", short: "영향", choices: [{ label: "하루 전체를 무겁게 만들어요", value: 1 }, { label: "중간중간 크게 느껴져요", value: 2 }, { label: "있지만 견딜 수는 있어요", value: 3 }] },
    { emoji: "🫧", title: "이 기분은 생각보다 몸에서 먼저 느껴지나요?", short: "몸반응", choices: [{ label: "몸도 많이 무거워요", value: 1 }, { label: "몸과 마음이 둘 다 가라앉아요", value: 2 }, { label: "마음 쪽이 더 커요", value: 3 }] },
    { emoji: "🧠", title: "가장 자주 드는 생각은 어떤 쪽에 가깝나요?", short: "생각", choices: [{ label: "의욕이 잘 안 생겨요", value: 1 }, { label: "왜 이러는지 모르겠어요", value: 2 }, { label: "쉬면 나아질 것 같아요", value: 3 }] },
    { emoji: "🫶", title: "지금 가장 필요한 도움은 무엇에 가깝나요?", short: "필요", choices: [{ label: "충분한 휴식", value: 3 }, { label: "누군가의 이해와 공감", value: 3 }, { label: "지금은 아직 잘 모르겠어요", value: 2 }] },
    { emoji: "🕰️", title: "이 상태가 얼마나 이어지고 있다고 느끼나요?", short: "지속", choices: [{ label: "며칠 이상 이어지는 느낌이에요", value: 1 }, { label: "오늘 유난히 그래요", value: 2 }, { label: "파도처럼 왔다 갔다 해요", value: 2 }] },
    { emoji: "🪶", title: "스스로에게 지금 해줄 수 있는 가장 현실적인 말은 무엇인가요?", short: "자기말", choices: [{ label: "\"오늘은 천천히 가도 돼\"", value: 3 }, { label: "\"왜 이런지 몰라도 지금은 버거울 수 있어\"", value: 2 }, { label: "\"일단 하나만 해보자\"", value: 3 }] },
  ],
  anxious: [
    { emoji: "🎯", title: "지금 불안을 크게 만드는 대상이 비교적 분명한가요?", short: "대상", choices: [{ label: "분명한 걱정거리가 있어요", value: 2 }, { label: "여러 일이 겹쳐 있어요", value: 2 }, { label: "콕 집기 어려운 불안이에요", value: 1 }] },
    { emoji: "🫁", title: "불안이 올라올 때 몸에서는 어떤 반응이 먼저 느껴지나요?", short: "신체", choices: [{ label: "숨이 가빠지거나 얕아져요", value: 1 }, { label: "몸이 굳고 긴장돼요", value: 2 }, { label: "생각 쪽이 더 분주해져요", value: 2 }] },
    { emoji: "🔁", title: "같은 생각이 반복되는 정도는 어떤가요?", short: "반복", choices: [{ label: "계속 맴돌아요", value: 1 }, { label: "수시로 떠올라요", value: 2 }, { label: "떠올라도 어느 정도 멈출 수 있어요", value: 3 }] },
    { emoji: "🧭", title: "그 걱정 중 지금 바로 다룰 수 있는 부분이 있나요?", short: "통제", choices: [{ label: "거의 없어서 더 막막해요", value: 1 }, { label: "조금은 손댈 수 있어요", value: 3 }, { label: "생각보다 준비된 것도 있어요", value: 4 }] },
    { emoji: "📉", title: "불안이 생활 리듬을 얼마나 흔들고 있나요?", short: "생활영향", choices: [{ label: "수면이나 집중까지 많이 흔들려요", value: 1 }, { label: "집중이 자주 깨져요", value: 2 }, { label: "불안하지만 일상은 유지돼요", value: 3 }] },
    { emoji: "🤲", title: "지금 붙잡을 수 있는 가장 확실한 것은 무엇에 가깝나요?", short: "지금여기", choices: [{ label: "아직 잘 안 보여요", value: 1 }, { label: "하나쯤 떠올릴 수 있어요", value: 3 }, { label: "내가 할 수 있는 일이 분명히 있어요", value: 4 }] },
  ],
  empty: [
    { emoji: "🛋️", title: "아무것도 하기 싫은 상태가 몸의 피로에 더 가깝나요, 마음의 소진에 더 가깝나요?", short: "성격", choices: [{ label: "둘 다 많이 섞여 있어요", value: 1 }, { label: "마음의 소진 쪽이 더 커요", value: 2 }, { label: "몸이 쉬지 못한 영향이 커요", value: 2 }] },
    { emoji: "🔋", title: "지금의 에너지 수준을 현실적으로 표현하면 어떤가요?", short: "에너지", choices: [{ label: "거의 바닥이에요", value: 1 }, { label: "기본적인 것만 겨우 해요", value: 2 }, { label: "시작만 하면 조금은 할 수 있어요", value: 3 }] },
    { emoji: "🧠", title: "이 상태에서 가장 힘든 점은 무엇인가요?", short: "어려움", choices: [{ label: "시작 자체가 너무 어려워요", value: 1 }, { label: "해야 한다는 생각이 더 버거워요", value: 2 }, { label: "하고 싶지 않은 마음이 커요", value: 2 }] },
    { emoji: "🫶", title: "지금 나에게 가장 덜 부담스러운 행동은 무엇일까요?", short: "한걸음", choices: [{ label: "물 한 잔 마시기 같은 아주 작은 일", value: 3 }, { label: "잠깐 몸을 움직이는 것", value: 3 }, { label: "아직은 아무것도 떠오르지 않아요", value: 1 }] },
    { emoji: "📆", title: "무기력한 상태가 얼마나 이어지고 있나요?", short: "기간", choices: [{ label: "꽤 계속되고 있어요", value: 1 }, { label: "며칠째 반복돼요", value: 2 }, { label: "오늘 유난히 심해요", value: 2 }] },
    { emoji: "🪞", title: "이럴 때 스스로를 어떻게 대하는 편인가요?", short: "자기대함", choices: [{ label: "자꾸 게으르다고 몰아붙여요", value: 1 }, { label: "답답하지만 버티는 중이에요", value: 2 }, { label: "지금은 쉬어야 할 신호라고 보려 해요", value: 3 }] },
  ],
  burnout: [
    { emoji: "🪫", title: "지침의 강도가 단순 피로를 넘었다고 느껴지나요?", short: "강도", choices: [{ label: "일반적인 피로 이상이에요", value: 1 }, { label: "쉬어도 잘 회복되지 않아요", value: 1 }, { label: "피곤하지만 회복 가능해 보여요", value: 3 }] },
    { emoji: "📣", title: "몸이나 마음이 보내는 신호 중 가장 두드러지는 것은 무엇인가요?", short: "신호", choices: [{ label: "의욕이 거의 안 생겨요", value: 1 }, { label: "잠과 휴식이 충분하지 않아요", value: 2 }, { label: "예민함이 커졌어요", value: 2 }] },
    { emoji: "⚖️", title: "요즘 생활은 '버티기'와 '회복하기' 중 어디에 더 치우쳐 있나요?", short: "균형", choices: [{ label: "거의 버티기만 하고 있어요", value: 1 }, { label: "버티는 쪽이 훨씬 커요", value: 2 }, { label: "조금씩 회복도 챙기고 있어요", value: 3 }] },
    { emoji: "🧱", title: "지금 가장 큰 부담은 무엇에 가깝나요?", short: "부담", choices: [{ label: "해야 할 일의 양", value: 2 }, { label: "쉬지 못하는 구조", value: 1 }, { label: "기대에 맞춰야 한다는 압박", value: 1 }] },
    { emoji: "🕯️", title: "나에게 허락이 필요한 것이 있다면 무엇일까요?", short: "허락", choices: [{ label: "잠시 멈추는 것", value: 3 }, { label: "완벽하지 않아도 되는 것", value: 3 }, { label: "도움을 요청하는 것", value: 3 }] },
    { emoji: "🌱", title: "회복을 위해 오늘 현실적으로 가능한 한 가지는 무엇인가요?", short: "회복한걸음", choices: [{ label: "일정을 하나 줄이는 것", value: 3 }, { label: "아무 생산성 없는 휴식을 갖는 것", value: 3 }, { label: "누군가에게 현재 상태를 말하는 것", value: 3 }] },
  ],
  lonely: [
    { emoji: "🌙", title: "외로움이 가장 크게 느껴지는 순간은 어떤 때인가요?", short: "순간", choices: [{ label: "혼자 있는 시간이 길어질 때", value: 2 }, { label: "사람들 사이에 있어도 연결감이 없을 때", value: 1 }, { label: "밤이 되면 더 커져요", value: 2 }] },
    { emoji: "💬", title: "오늘 마음을 나눌 수 있는 대화가 있었나요?", short: "대화", choices: [{ label: "거의 없었어요", value: 1 }, { label: "피상적인 대화만 있었어요", value: 2 }, { label: "짧게라도 있었어요", value: 3 }] },
    { emoji: "🫂", title: "지금 필요한 연결은 어떤 형태에 더 가깝나요?", short: "연결", choices: [{ label: "한 사람의 깊은 이해", value: 3 }, { label: "가벼운 안부라도 좋겠어요", value: 2 }, { label: "지금은 누가 곁에 있다는 감각만 있어도 돼요", value: 2 }] },
    { emoji: "📱", title: "먼저 연락을 시도하는 일은 지금 어떤가요?", short: "연락", choices: [{ label: "용기가 잘 안 나요", value: 1 }, { label: "망설여지지만 가능할 것 같아요", value: 2 }, { label: "가볍게는 해볼 수 있어요", value: 3 }] },
    { emoji: "🧠", title: "외로울 때 주로 어떤 생각이 따라오나요?", short: "생각", choices: [{ label: "아무도 나를 잘 모르는 것 같아요", value: 1 }, { label: "말해도 잘 이해받지 못할 것 같아요", value: 2 }, { label: "그냥 연결이 부족한 하루였다고 느껴요", value: 3 }] },
    { emoji: "🏠", title: "지금 나를 가장 덜 외롭게 해줄 것은 무엇일까요?", short: "완화", choices: [{ label: "신뢰하는 사람 한 명과의 연결", value: 3 }, { label: "일상적인 온기 하나", value: 3 }, { label: "우선 나를 안정시키는 시간", value: 3 }] },
  ],
  angry: [
    { emoji: "⚡", title: "지금 화를 만든 핵심은 무엇에 가장 가깝나요?", short: "핵심", choices: [{ label: "존중받지 못한 느낌", value: 1 }, { label: "반복되는 상황에 대한 피로", value: 2 }, { label: "예상과 다른 결과", value: 2 }] },
    { emoji: "🌡️", title: "화의 강도는 지금 어느 정도인가요?", short: "강도", choices: [{ label: "몸으로 느껴질 만큼 커요", value: 1 }, { label: "말만 꺼내면 다시 올라와요", value: 2 }, { label: "많이 줄었지만 남아 있어요", value: 3 }] },
    { emoji: "🧠", title: "화 아래에 다른 감정이 같이 있나요?", short: "이면감정", choices: [{ label: "서운함이 커요", value: 2 }, { label: "억울함이 커요", value: 2 }, { label: "지금은 화가 가장 앞에 있어요", value: 2 }] },
    { emoji: "🗣️", title: "지금 필요한 것은 무엇에 더 가깝나요?", short: "필요", choices: [{ label: "내 입장을 정확히 말하는 것", value: 3 }, { label: "조금 진정할 시간", value: 3 }, { label: "이해받고 있다는 감각", value: 3 }] },
    { emoji: "🧯", title: "이 감정을 다루는 방식은 현재 어떤가요?", short: "다루기", choices: [{ label: "억누르고 있어요", value: 1 }, { label: "터뜨릴까 봐 조심 중이에요", value: 2 }, { label: "조금씩 정리되고 있어요", value: 3 }] },
    { emoji: "📍", title: "이 화가 나에게 알려주는 경계는 무엇일까요?", short: "경계", choices: [{ label: "넘기기 어려운 선이 있었어요", value: 3 }, { label: "반복되면 안 되는 상황이었어요", value: 3 }, { label: "내가 중요하게 여기는 것이 건드려졌어요", value: 3 }] },
  ],
  sad: [
    { emoji: "💧", title: "슬픔이 지금 어느 정도로 머물러 있나요?", short: "정도", choices: [{ label: "쉽게 가라앉지 않을 만큼 커요", value: 1 }, { label: "계속 배경처럼 남아 있어요", value: 2 }, { label: "올라오지만 견딜 수는 있어요", value: 3 }] },
    { emoji: "🔎", title: "슬픔의 이유가 비교적 분명한 편인가요?", short: "이유", choices: [{ label: "분명한 이유가 있어요", value: 3 }, { label: "어렴풋이만 알아요", value: 2 }, { label: "이유 없이 가라앉아요", value: 1 }] },
    { emoji: "🫂", title: "이 감정 앞에서 가장 필요한 것은 무엇일까요?", short: "필요", choices: [{ label: "조용히 머물 시간", value: 3 }, { label: "누군가의 공감", value: 3 }, { label: "울어도 괜찮은 안전함", value: 3 }] },
    { emoji: "🧠", title: "슬플 때 스스로에게 어떤 말을 가장 많이 하나요?", short: "자기말", choices: [{ label: "자꾸 버티라고 해요", value: 1 }, { label: "이유를 찾으려 애써요", value: 2 }, { label: "그럴 수 있다고 말해주려 해요", value: 3 }] },
    { emoji: "🕰️", title: "이 슬픔이 이어지는 시간감각은 어떤가요?", short: "지속", choices: [{ label: "며칠 이상 길게 느껴져요", value: 1 }, { label: "오늘 특히 크게 느껴져요", value: 2 }, { label: "파도처럼 오고 가요", value: 2 }] },
    { emoji: "🌿", title: "지금의 슬픔을 조금 덜 외롭게 만들 수 있는 것이 있다면 무엇일까요?", short: "완화", choices: [{ label: "말하지 않아도 곁에 있어주는 사람", value: 3 }, { label: "감정을 흘려보낼 시간", value: 3 }, { label: "스스로를 덜 재촉하는 태도", value: 3 }] },
  ],
};

/** 시작할 때마다 구조화된 질문 풀에서 질문 n개를 무작위로 골라 반환 */
export function buildMoodQuestions(moodId: string, n = 6): MoodQuestion[] {
  const pool = [...(structuredMoodQuestions[moodId] || [])];
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
      "전반적인 정서 상태가 비교적 안정적이에요. 현재의 리듬과 자원을 잘 유지하고 있는 하루로 볼 수 있습니다.";
  } else if (avg >= 2.6) {
    label = "잔잔히 흘러가는 하루";
    emoji = "🍃";
    summary =
      "감정 기복이 크지 않고 비교적 균형을 유지하고 있어요. 무리하지 않는 선에서 일상을 이어가기 좋은 상태에 가깝습니다.";
  } else if (avg >= 1.9) {
    label = "조금 버거운 하루";
    emoji = "🌥️";
    summary =
      "정서적 부담이 평소보다 조금 높게 나타나요. 바로 해결하려 하기보다 현재 부담을 줄이는 접근이 더 적절해 보입니다.";
  } else {
    label = "돌봄이 필요한 하루";
    emoji = "🌧️";
    summary =
      "정서적 소모가 크게 누적된 상태로 보여요. 오늘은 성과보다 회복과 안정 확보를 우선에 두는 편이 필요합니다.";
  }

  const profile: Profile = { avg, label, emoji, summary };
  if (avg <= 1.6) {
    profile.gentleSupport =
      "이런 상태가 며칠 이상 이어지거나 수면, 식사, 집중 같은 일상 기능에 분명한 영향을 주고 있다면 신뢰할 수 있는 사람이나 전문가와 연결해보는 것을 권합니다.";
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
  return `오늘은 ${adv ? adv + " " : ""}${adj} 상태가 비교적 분명하게 느껴진 하루였어요.`;
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
export type Analysis = {
  read: string;
  observed: string;
  meaning: string;
  suggestion: string;
  caution?: string;
};

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

const meaningByMood: Record<string, string[]> = {
  happy: [
    "좋은 감정이 비교적 안정적으로 유지되고 있다는 건, 지금 생활 안에 나를 지탱하는 자원이 분명히 있다는 뜻일 수 있어요.",
    "기분이 좋은 날에도 그 이유를 알아차려 두면 이후 컨디션이 흔들릴 때 다시 돌아올 기준이 생깁니다.",
  ],
  flutter: [
    "설렘은 기대가 살아 있다는 신호이지만, 긴장이 함께 있을 때는 감정 소모도 커질 수 있어요.",
    "두근거림 자체보다 그 감정이 나를 앞으로 움직이게 하는지, 혹은 불안하게 만드는지를 구분해보는 것이 중요해요.",
  ],
  calm: [
    "잔잔한 상태는 특별하지 않아 보여도 실제로는 회복이 작동하고 있다는 신호일 수 있어요.",
    "극적인 감정이 없다는 건 무감각과는 다릅니다. 오히려 생활 리듬이 비교적 안정돼 있다는 뜻일 수 있어요.",
  ],
  down: [
    "가라앉은 마음은 의지가 부족해서라기보다, 에너지와 정서 자원이 줄어든 상태에서 흔히 나타나는 반응이에요.",
    "이럴 때 중요한 건 감정을 빨리 바꾸는 것보다 지금의 무게를 정확히 인정하고 부담을 줄이는 쪽이에요.",
  ],
  anxious: [
    "불안은 실제 위험보다 '예상되는 부담'을 먼저 계산하려는 마음의 경계 반응일 때가 많아요.",
    "생각이 반복될수록 불안은 커지기 쉬워요. 그래서 원인을 다 없애기보다 지금 다룰 수 있는 범위를 좁히는 게 도움이 됩니다.",
  ],
  empty: [
    "무기력은 게으름의 문제가 아니라, 소진이나 부담이 오래 누적됐을 때 흔히 나타나는 정지 반응일 수 있어요.",
    "아무것도 하기 싫다는 상태에는 종종 회복이 먼저 필요하다는 신호가 들어 있습니다.",
  ],
  burnout: [
    "지침이 길어질수록 '조금만 더'로 버티는 방식은 오히려 회복을 늦출 수 있어요.",
    "소진은 의욕의 문제가 아니라 자원 고갈의 문제에 더 가까워서, 회복을 위한 구조 조정이 필요할 때가 많아요.",
  ],
  lonely: [
    "외로움은 관계의 수보다 '정서적으로 연결되어 있다는 감각'이 부족할 때 더 크게 느껴지곤 해요.",
    "혼자 있는 것 자체보다 이해받지 못할 것 같다는 예상이 외로움을 더 깊게 만드는 경우도 많아요.",
  ],
  angry: [
    "분노는 대개 지켜지지 않은 기대, 침해된 경계, 혹은 누적된 피로가 밖으로 드러나는 방식이에요.",
    "화가 크다는 사실보다 중요한 건 그 안에 어떤 요구와 상처가 숨어 있는지를 읽어내는 일이에요.",
  ],
  sad: [
    "슬픔은 약함의 증거라기보다 상실, 실망, 피로처럼 중요한 정서적 사건을 통과하고 있다는 신호에 가까워요.",
    "이 감정을 너무 빨리 정리하려고 하면 오히려 더 오래 남을 수 있어서, 안전하게 머물 수 있는 시간이 필요할 때가 있어요.",
  ],
};

function buildObserved(
  low: AnalysisItem | undefined,
  high: AnalysisItem | undefined
): string {
  if (low && high && low.short !== high.short && high.value - low.value >= 1) {
    return `이번 체크인에서는 '${low.short}' 영역에서 부담이 가장 크게 나타났고, '${high.short}' 영역에서는 상대적으로 유지되는 기능이 확인돼요. 전반적으로는 힘든 요소가 분명하지만, 동시에 버티고 있는 자원도 남아 있는 상태로 해석됩니다.`;
  }
  if (low) {
    return `이번 체크인에서는 '${low.short}'와 관련된 반응이 가장 무겁게 나타났어요. 현재 마음의 부담이 특히 그 지점에 집중돼 있다고 볼 수 있습니다.`;
  }
  return "이번 체크인에서는 몇 가지 부담이 겹쳐 있지만, 현재 상태를 이해할 수 있는 단서도 함께 드러나고 있습니다.";
}

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

  let read = `선택하신 답을 종합하면, 오늘은 ${adj} 감정이 ${deg} 지속된 하루로 보입니다.`;
  if (low && high && low.short !== high.short && high.value - low.value >= 1) {
    read += ` 특히 ‘${low.short}’(“${low.answer}”)와 관련된 부담이 두드러졌고, 반대로 ‘${high.short}’(“${high.answer}”)에서는 상대적으로 유지되는 힘이 확인됩니다.`;
  } else if (low) {
    read += ` 그중 ‘${low.short}’(“${low.answer}”)이 현재 상태를 가장 크게 압박하는 지점으로 보입니다.`;
  }

  const analysis: Analysis = {
    read,
    observed: buildObserved(low, high),
    meaning: pickOne(meaningByMood[moodId] || meaningByMood.calm),
    suggestion: pickOne(suggestions[moodId] || suggestions.calm),
  };

  const avg = items.reduce((s, i) => s + i.value, 0) / items.length;
  if (avg <= 1.7) {
    analysis.caution =
      "이런 부담이 2주 이상 이어지거나 수면, 식사, 의욕, 집중 같은 일상 기능에 뚜렷한 저하가 생긴다면 전문 상담이나 진료를 통해 추가 도움을 받는 것을 권합니다.";
  }
  return analysis;
}
