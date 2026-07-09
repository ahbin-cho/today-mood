"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { moods, dailyOneLiners, type Mood, type Quote } from "@/data/moods";
import {
  buildMoodQuestions,
  computeProfile,
  moodScore,
  acknowledgment,
  reflectNote,
  computeAnalysis,
  type MoodQuestion,
  type MoodChoice,
  type Profile,
  type Analysis,
} from "@/data/checkin";
import { personas, personaById, type Persona } from "@/data/personas";
import { buildFortune, type Fortune, type MoodHistory } from "@/data/fortune";
import { seededPick, pickRandom } from "@/lib/pick";
import {
  dateKey,
  loadJournal,
  recordEntry,
  loadSaved,
  addSaved,
  removeSaved,
  calcStreak,
  mergeJournals,
  saveJournalAll,
  saveSavedAll,
  type JournalMap,
  type Entry,
  type SavedItem,
  type QA,
} from "@/lib/storage";
import { kst } from "@/lib/time";
import { resolveUid } from "@/lib/uid";
import { pushToParent } from "@/lib/cloud";
import ShareCard, { type ShareCardData } from "@/components/ShareCard";
import {
  Tabs, Tab, DailyBanner, DailyLabel, DailyText, DailyAuthor, SectionLabel,
  Footer, PersonaRow, PersonaChip, PersonaPhoto, PersonaCopy, PersonaName,
  PersonaTag, MoodGrid, MoodBtn, MoodEmoji, MoodCopy, MoodName, MoodCaption,
  MoodLine, DailyReflect, FortuneCard, FortuneHead, FortuneLine, FortuneGauge, FortuneGaugeTop,
  FortuneScore, FortuneBar, FortuneBarFill, FortuneFlow, FortuneGrid, FortuneItem,
  FortuneKey, FortuneVal, FortuneSwatch, FortuneTip, FortuneNote,
} from "@/components/ui/home";
import {
  StepCard, Advisor, AdvisorPhoto, AdvisorCopy, AdvisorName, AdvisorTag,
  AdvisorBadge, StepHead, StepBack, StepSkip, StepDots, Dot, StepEmoji,
  StepTitle, StepSub, IntensityValue, SliderEnds, FreeBtn, FreeInput,
  Choices, Choice,
} from "@/components/ui/step";
import {
  LetterCard, Report, ReportLabel, ReportType, ReportEmoji, ReportScore,
  ReportScoreTop, ReportScoreNum, ReportBar, ReportBarFill, ReportSummary,
  Reading, ReadingLabel, ReadingRead, ReadingSuggest, ReadingSuggestTag,
  ReadingSuggestText, ReadingCaution, LetterFrom, LetterAvatarImg,
  LetterFromText, LetterTag, LetterOpen, LetterEcho, LetterEchoTail,
  LetterReflect, LetterLine, LetterBody, QuoteBlock, QuoteText, QuoteAuthor,
  SupportNote, LetterSign, PsBox, PsLabel, PsSaved, PsBtn, Disclaimer,
  Explore, ExploreLabel, ExploreLinks, ExploreLink, Actions, Btn,
} from "@/components/ui/letter";
import { CalEmptyMsg } from "@/components/ui/calendar";
import {
  SavedWrap, SavedCard, SavedTop, SavedEmoji, SavedDate, SavedDel,
  SavedMessage, SavedQuote, SavedQAuthor,
} from "@/components/ui/saved";
import MoodCalendar from "@/components/MoodCalendar";

const DEFAULT_BG: [string, string] = ["#FBF6EE", "#F3E9DB"];
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const INTENSITY_LABELS = ["", "아주 살짝", "살짝", "보통", "꽤", "아주 많이"];
// persona is now randomly assigned when starting a check-in

type Tab = "today" | "calendar" | "saved";
type Stage = "home" | "breathe" | "intensity" | "questions" | "note" | "result";

type ResultContent = {
  message: string;
  quote: Quote;
  opener: string;
  closer: string;
  profile: Profile | null;
  complete: boolean;
};

function labelOf(d: Date): string {
  const k = kst(d);
  return `${k.year()}. ${k.month() + 1}. ${k.date()} (${WEEK[k.day()]})`;
}

function shareArtworkForMood(moodId: string): string {
  switch (moodId) {
    case "happy":
    case "flutter":
      return "/share-art/good-day.png";
    case "calm":
      return "/share-art/calm-day.png";
    case "down":
    case "sad":
      return "/share-art/down-day.png";
    case "anxious":
    case "lonely":
      return "/share-art/anxious-day.png";
    case "burnout":
    case "empty":
      return "/share-art/rest-day.png";
    case "angry":
      return "/share-art/anger-day.png";
    default:
      return "/share-art/calm-day.png";
  }
}

export default function MoodApp() {
  const [today, setToday] = useState<Date | null>(null);
  const [tab, setTab] = useState<Tab>("today");
  const [journal, setJournal] = useState<JournalMap>({});
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  const [stage, setStage] = useState<Stage>("home");
  const [mood, setMood] = useState<Mood | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [sessionQuestions, setSessionQuestions] = useState<MoodQuestion[]>([]);
  const [picked, setPicked] = useState<(MoodChoice | null)[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [note, setNote] = useState("");
  const [rc, setRc] = useState<ResultContent | null>(null);

  const [personaId, setPersonaId] = useState<string | null>(null);
  const [selfNote, setSelfNote] = useState("");
  const [selfSaved, setSelfSaved] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const uidRef = useRef("");
  const parentDbRef = useRef(false);

  // 부모 DB 모드일 때 부모 사이트에 저장 요청
  const cloudSync = () => {
    if (parentDbRef.current) {
      pushToParent(loadJournal(), loadSaved());
    }
  };

  useEffect(() => {
    const now = new Date();
    setToday(now);
    const localJ = loadJournal();
    const localS = loadSaved();
    setJournal(localJ);
    setSaved(localS);
    // persona is assigned randomly when starting a check-in

    // uid 결정 + 클라우드 동기화
    (async () => {
      const { uid, parentDb, initialData } = await resolveUid();
      uidRef.current = uid;
      parentDbRef.current = parentDb;

      if (parentDb && initialData) {
        // 부모 DB 모드: 부모가 보내준 데이터와 로컬 병합
        const mergedJ: JournalMap = mergeJournals(initialData.journal, localJ);
        const byId = new Map<string, SavedItem>();
        [...(initialData.saved || []), ...localS].forEach((x) => byId.set(x.id, x));
        const mergedS = Array.from(byId.values());
        saveJournalAll(mergedJ);
        saveSavedAll(mergedS);
        setJournal(mergedJ);
        setSaved(mergedS);
      }
    })();
  }, []);

  const dateText = today ? labelOf(today) : "";
  const todayKey = today ? dateKey(today) : "";
  const streak = today ? calcStreak(journal, today) : 0;
  const persona: Persona = (personaId && personaById[personaId]) || personas[0];

  const daily = useMemo<Quote | null>(
    () => (todayKey ? seededPick(dailyOneLiners, todayKey) : null),
    [todayKey]
  );

  // 최근 기록으로 운세 개인화용 요약
  const TYPE_WEIGHT: Record<string, number> = {
    "한결 가벼운 하루": 4,
    "잔잔히 흘러가는 하루": 3,
    "조금 버거운 하루": 2,
    "돌봄이 필요한 하루": 1,
  };
  const MOOD_POS: Record<string, number> = {
    happy: 4, flutter: 4, calm: 3, down: 2, anxious: 2,
    empty: 2, burnout: 1.5, lonely: 2, angry: 2, sad: 1.5,
  };
  const history = useMemo<MoodHistory | undefined>(() => {
    if (!today) return undefined;
    let recent = 0;
    let sum = 0;
    let cnt = 0;
    for (let d = 0; d < 7; d++) {
      const dd = new Date(today);
      dd.setDate(today.getDate() - d);
      const dayEntries = journal[dateKey(dd)];
      const e = dayEntries?.[dayEntries.length - 1];
      if (e) {
        recent++;
        const w =
          (e.typeLabel ? TYPE_WEIGHT[e.typeLabel] : undefined) ??
          MOOD_POS[e.moodId] ??
          2.5;
        sum += w;
        cnt++;
      }
    }
    return {
      streak: calcStreak(journal, today),
      recentCount: recent,
      trend: cnt ? sum / cnt : NaN,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journal, today]);
  const fortune = useMemo<Fortune | null>(
    () => (todayKey ? buildFortune(todayKey, history, uidRef.current || undefined) : null),
    [todayKey, history]
  );

  // 마음 날씨 기록이 쌓였을 때 한마디 배너에 보여줄 따뜻한 한 줄
  const moodReflect = useMemo<string | null>(() => {
    const total = Object.values(journal).reduce((s, arr) => s + arr.length, 0);
    if (total === 0) return null;
    if (streak >= 2)
      return `🌱 ${streak}일째 마음을 살피고 있어요. 오늘도 잘 왔어요.`;
    return `🌱 벌써 ${total}번째 마음을 들여다봤어요. 오늘도 잘 왔어요.`;
  }, [journal, streak]);

  const bg = mood && stage !== "home" ? mood.bg : DEFAULT_BG;

  // ---- 답변 파생값 ----
  const isComplete = () =>
    sessionQuestions.length > 0 && picked.every((c) => c !== null);
  const valuesOf = () =>
    picked.filter((c): c is MoodChoice => c !== null).map((c) => c.value);
  const buildQA = (): QA[] =>
    sessionQuestions
      .map((q, i) => (picked[i] ? { q: q.short, a: picked[i]!.label } : null))
      .filter((x): x is QA => x !== null);
  const buildItems = () =>
    sessionQuestions
      .map((q, i) =>
        picked[i]
          ? { short: q.short, answer: picked[i]!.label, value: picked[i]!.value }
          : null
      )
      .filter((x): x is { short: string; answer: string; value: number } => x !== null);

  const choosePersona = (id: string) => {
    setPersonaId(id);
  };

  const makeContent = (
    m: Mood,
    per: Persona,
    complete: boolean,
    values: number[],
    prevMsg?: string,
    prevQuote?: Quote
  ): ResultContent => ({
    message: pickRandom(m.messages, prevMsg),
    quote: pickRandom(m.quotes, prevQuote),
    opener: pickRandom(per.openers),
    closer: pickRandom(per.closers),
    profile: complete ? computeProfile(values) : null,
    complete,
  });

  const persist = (
    m: Mood,
    per: Persona,
    content: ResultContent,
    qa: QA[],
    theNote: string,
    theSelf: string,
    ana: Analysis | null
  ) => {
    if (!todayKey) return;
    const entry: Entry = {
      ts: Date.now(),
      moodId: m.id,
      intensity,
      qa: qa.length ? qa : undefined,
      note: theNote.trim() || undefined,
      selfNote: theSelf.trim() || undefined,
      typeLabel: content.profile?.label,
      typeEmoji: content.profile?.emoji,
      message: content.message,
      quoteText: content.quote.text,
      quoteAuthor: content.quote.author,
      personaId: per.id,
      personaName: per.name,
      analysisRead: ana?.read,
      analysisSuggestion: ana?.suggestion,
      analysisCaution: ana?.caution,
    };
    setJournal(recordEntry(todayKey, entry));
    cloudSync();
  };

  // ---- 흐름 ----
  const startFlow = (m: Mood) => {
    const qs = buildMoodQuestions(m.id, 8);
    setMood(m);
    setIntensity(3);
    if (!personaId) setPersonaId(pickRandom(personas).id);
    setSessionQuestions(qs);
    setPicked(new Array(qs.length).fill(null));
    setQIndex(0);
    setNote("");
    setRc(null);
    setSelfNote("");
    setSelfSaved(false);
    setJustSaved(false);
    setStage("intensity");
  };

  const answer = (qi: number, choice: MoodChoice) => {
    const next = [...picked];
    next[qi] = choice;
    setPicked(next);
    if (qi < sessionQuestions.length - 1) setQIndex(qi + 1);
    else setStage("note");
  };

  const enterResult = (finalNote: string) => {
    if (!mood) return;
    const complete = isComplete();
    const content = makeContent(mood, persona, complete, valuesOf());
    const ana = computeAnalysis(mood.id, intensity, buildItems());
    setRc(content);
    setAnalysis(ana);
    setSelfNote("");
    setSelfSaved(false);
    persist(mood, persona, content, buildQA(), finalNote, "", ana);
    setJustSaved(false);
    setStage("result");
  };

  const drawAgain = () => {
    if (!mood || !rc) return;
    const content = makeContent(
      mood,
      persona,
      rc.complete,
      valuesOf(),
      rc.message,
      rc.quote
    );
    setRc(content);
    persist(mood, persona, content, buildQA(), note, selfSaved ? selfNote : "", analysis);
    setJustSaved(false);
  };

  const changePersona = () => {
    if (!mood || !rc) return;
    const others = personas.filter((p) => p.id !== personaId);
    const next = pickRandom(others);
    choosePersona(next.id);
    const content = makeContent(mood, next, rc.complete, valuesOf());
    setRc(content);
    persist(mood, next, content, buildQA(), note, selfSaved ? selfNote : "", analysis);
    setJustSaved(false);
  };

  const saveSelf = () => {
    if (!mood || !rc || !selfNote.trim()) return;
    persist(mood, persona, rc, buildQA(), note, selfNote, analysis);
    setSelfSaved(true);
  };

  const resetFlow = () => {
    setStage("home");
    setMood(null);
    setPicked([]);
    setQIndex(0);
    setNote("");
    setRc(null);
    setAnalysis(null);
    setSelfNote("");
    setSelfSaved(false);
    setJustSaved(false);
  };

  const saveCurrent = () => {
    if (!mood || !rc) return;
    const caption = rc.profile ? rc.profile.label : mood.caption;
    const item: SavedItem = {
      id: `${todayKey}-${Math.floor(Math.random() * 1e6)}`,
      dateKey: todayKey,
      emoji: mood.emoji,
      caption,
      message: rc.message,
      quoteText: rc.quote.text,
      quoteAuthor: rc.quote.author,
      color: mood.color,
    };
    setSaved(addSaved(item));
    setJustSaved(true);
    cloudSync();
  };

  const deleteSaved = (id: string) => {
    setSaved(removeSaved(id));
    cloudSync();
  };

  const totalSteps = sessionQuestions.length + 2; // 강도 + 질문 + 메모

  const shareData: ShareCardData | null =
    mood && rc
      ? {
          imageSrc: shareArtworkForMood(mood.id),
          emoji: mood.emoji,
          caption: acknowledgment(mood.id, intensity),
          message: rc.message,
          quoteText: rc.quote.text,
          quoteAuthor: rc.quote.author,
          dateText: `${dateText} · ${persona.name} 드림`,
          bg: mood.bg,
          color: mood.color,
        }
      : null;

  return (
    <>
      <Tabs>
        <Tab
          $on={tab === "today"}
          onClick={() => {
            setTab("today");
            resetFlow();
          }}
        >
          오늘
        </Tab>
        <Tab $on={tab === "calendar"} onClick={() => setTab("calendar")}>
          마음 날씨
        </Tab>
        <Tab $on={tab === "saved"} onClick={() => setTab("saved")}>
          담은 문장{saved.length > 0 ? ` (${saved.length})` : ""}
        </Tab>
      </Tabs>

      {tab === "today" && (
        <>
          {stage === "home" && (
            <>
              <DailyBanner>
                <DailyLabel>⭐ 오늘의 한마디</DailyLabel>
                {daily ? (
                  <>
                    <DailyText>“{daily.text}”</DailyText>
                    <DailyAuthor>— {daily.author}</DailyAuthor>
                  </>
                ) : (
                  <DailyText className="opacity-60">오늘의 한마디를 불러오는 중…</DailyText>
                )}
                {moodReflect && <DailyReflect>{moodReflect}</DailyReflect>}
              </DailyBanner>

              {fortune && (
                <FortuneCard>
                  <FortuneHead>🔮 오늘의 마음 운세</FortuneHead>
                  <FortuneLine>“{fortune.line}”</FortuneLine>

                  <FortuneGauge>
                    <FortuneGaugeTop>
                      <span>오늘의 마음 기운</span>
                      <FortuneScore>{fortune.score}점</FortuneScore>
                    </FortuneGaugeTop>
                    <FortuneBar>
                      <FortuneBarFill style={{ width: `${fortune.score}%` }} />
                    </FortuneBar>
                  </FortuneGauge>

                  <FortuneFlow>
                    {fortune.personalized ? "🌱 " : "✍️ "}
                    {fortune.flow}
                  </FortuneFlow>

                  <FortuneGrid>
                    <FortuneItem>
                      <FortuneKey>행운의 색</FortuneKey>
                      <FortuneVal>
                        <FortuneSwatch style={{ background: fortune.color.hex }} />
                        {fortune.color.name}
                      </FortuneVal>
                    </FortuneItem>
                    <FortuneItem>
                      <FortuneKey>행운의 시간</FortuneKey>
                      <FortuneVal>{fortune.time}</FortuneVal>
                    </FortuneItem>
                    <FortuneItem>
                      <FortuneKey>오늘의 아이템</FortuneKey>
                      <FortuneVal>{fortune.item}</FortuneVal>
                    </FortuneItem>
                    <FortuneItem>
                      <FortuneKey>오늘의 키워드</FortuneKey>
                      <FortuneVal>#{fortune.keyword}</FortuneVal>
                    </FortuneItem>
                  </FortuneGrid>

                  <FortuneTip>🍀 오늘의 작은 처방 · {fortune.tip}</FortuneTip>
                  <FortuneNote>
                    * 재미로 보는 운세예요. 내 기록이 쌓일수록 기운 점수가 더 맞춰져요.
                  </FortuneNote>
                </FortuneCard>
              )}

              <SectionLabel>오늘의 마음을 누구와 살펴볼까요?</SectionLabel>
              <PersonaRow>
                {personas.map((p) => {
                  const on = p.id === personaId;
                  return (
                    <PersonaChip key={p.id} $on={on} onClick={() => choosePersona(p.id)}>
                      <PersonaPhoto src={p.avatar} alt="" />
                      <PersonaCopy>
                        <PersonaName $on={on}>{p.name}</PersonaName>
                        <PersonaTag>{p.tagline}</PersonaTag>
                      </PersonaCopy>
                    </PersonaChip>
                  );
                })}
              </PersonaRow>

              <SectionLabel>지금 마음과 가장 가까운 문장을 골라보세요</SectionLabel>
              <MoodGrid>
                {moods.map((m) => (
                  <MoodBtn key={m.id} onClick={() => startFlow(m)}>
                    <MoodEmoji aria-hidden="true">{m.emoji}</MoodEmoji>
                    <MoodCopy>
                      <MoodName>{m.label}</MoodName>
                      <MoodCaption>{m.caption}</MoodCaption>
                    </MoodCopy>
                    <MoodLine style={{ background: m.color }} aria-hidden="true" />
                  </MoodBtn>
                ))}
              </MoodGrid>

              <Footer>
                {dateText ? `${dateText} · ` : ""}
                {streak > 0
                  ? `${streak}일째 마음을 들여다보는 중 🌱`
                  : "오늘 하루도 당신의 마음을 응원해요."}
              </Footer>
            </>
          )}

          {/* ---- 강도 ---- */}
          {stage === "intensity" && mood && (
            <StepCard>
              <StepAdvisor persona={persona} />
              <StepHeader
                step={1}
                total={totalSteps}
                onBack={resetFlow}
                onSkip={() => enterResult(note)}
              />
              <StepEmoji>{mood.emoji}</StepEmoji>
              <StepTitle>“{mood.label}”, 얼마나 그런가요?</StepTitle>
              <IntensityValue>{INTENSITY_LABELS[intensity]}</IntensityValue>
              <input
                className="slider"
                type="range"
                min={1}
                max={5}
                step={1}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ accentColor: mood.color }}
              />
              <SliderEnds>
                <span>살짝</span>
                <span>많이</span>
              </SliderEnds>
              <FreeBtn onClick={() => setStage("questions")}>다음</FreeBtn>
            </StepCard>
          )}

          {/* ---- 기분별 질문 ---- */}
          {stage === "questions" && mood && sessionQuestions[qIndex] && (
            <StepCard>
              <StepAdvisor persona={persona} />
              <StepHeader
                step={qIndex + 2}
                total={totalSteps}
                onBack={() => {
                  if (qIndex === 0) setStage("intensity");
                  else setQIndex(qIndex - 1);
                }}
                onSkip={() => enterResult(note)}
              />
              <StepEmoji>{sessionQuestions[qIndex].emoji}</StepEmoji>
              <StepTitle>{sessionQuestions[qIndex].title}</StepTitle>
              <Choices>
                {sessionQuestions[qIndex].choices.map((c) => {
                  const on = picked[qIndex]?.label === c.label;
                  return (
                    <Choice
                      key={c.label}
                      $on={on}
                      style={on ? { borderColor: mood.color } : undefined}
                      onClick={() => answer(qIndex, c)}
                    >
                      {c.label}
                    </Choice>
                  );
                })}
              </Choices>
            </StepCard>
          )}

          {/* ---- 메모 ---- */}
          {stage === "note" && mood && (
            <StepCard>
              <StepAdvisor persona={persona} />
              <StepHeader
                step={totalSteps}
                total={totalSteps}
                onBack={() => {
                  setStage("questions");
                  setQIndex(Math.max(0, sessionQuestions.length - 1));
                }}
                onSkip={() => enterResult("")}
              />
              <StepEmoji>✍️</StepEmoji>
              <StepTitle>오늘 있었던 일을 한 줄로 남겨볼래요?</StepTitle>
              <StepSub>비워두어도 괜찮아요.</StepSub>
              <FreeInput
                rows={3}
                placeholder="예: 회의가 많아 정신없었지만 저녁엔 좋아하는 걸 먹었다."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <FreeBtn onClick={() => enterResult(note)}>편지 받기</FreeBtn>
            </StepCard>
          )}

          {/* ---- 편지(결과) ---- */}
          {stage === "result" && mood && rc && (
            <>
              <LetterCard style={{ border: `1px solid ${mood.color}44` }}>
                {rc.profile && (
                  <Report>
                    <ReportLabel>🧭 오늘의 마음 진단 결과</ReportLabel>
                    <ReportType>
                      <ReportEmoji>{rc.profile.emoji}</ReportEmoji>
                      {rc.profile.label}
                    </ReportType>
                    <ReportScore>
                      <ReportScoreTop>
                        <span>마음 점수</span>
                        <ReportScoreNum>
                          {moodScore(rc.profile.avg)}점
                        </ReportScoreNum>
                      </ReportScoreTop>
                      <ReportBar>
                        <ReportBarFill
                          style={{ width: `${moodScore(rc.profile.avg)}%` }}
                        />
                      </ReportBar>
                    </ReportScore>
                    <ReportSummary>{rc.profile.summary}</ReportSummary>
                  </Report>
                )}

                {analysis && (
                  <Reading>
                    <ReadingLabel>🔎 상담 소견</ReadingLabel>
                    <ReadingRead>{analysis.read}</ReadingRead>
                    <ReadingSuggest>
                      <ReadingSuggestTag>🌱 오늘의 제안</ReadingSuggestTag>
                      <ReadingSuggestText>{analysis.suggestion}</ReadingSuggestText>
                    </ReadingSuggest>
                    {analysis.caution && (
                      <ReadingCaution>{analysis.caution}</ReadingCaution>
                    )}
                  </Reading>
                )}

                <LetterFrom>
                  <LetterAvatarImg src={persona.avatar} alt="" />
                  <LetterFromText>
                    {persona.name}
                    <LetterTag> · {persona.tagline}</LetterTag>
                  </LetterFromText>
                </LetterFrom>

                <LetterOpen>{acknowledgment(mood.id, intensity)}</LetterOpen>

                {note.trim() && (
                  <LetterEcho>
                    “{note.trim()}”
                    <LetterEchoTail>
                      그 마음, 여기 그대로 받아둘게요.
                    </LetterEchoTail>
                  </LetterEcho>
                )}
                {reflectNote(note) && (
                  <LetterReflect>💡 {reflectNote(note)}</LetterReflect>
                )}

                <LetterLine $dim>{rc.opener}</LetterLine>
                <LetterBody>{rc.message}</LetterBody>
                <LetterLine $dim>{rc.closer}</LetterLine>

                <QuoteBlock style={{ borderColor: `${mood.color}44` }}>
                  <QuoteText>“{rc.quote.text}”</QuoteText>
                  <QuoteAuthor>— {rc.quote.author}</QuoteAuthor>
                </QuoteBlock>

                {rc.profile?.gentleSupport && (
                  <SupportNote>{rc.profile.gentleSupport}</SupportNote>
                )}

                <LetterSign>— {persona.name} 드림</LetterSign>

                <PsBox>
                  <PsLabel>🌙 오늘의 나에게 한마디</PsLabel>
                  {selfSaved ? (
                    <PsSaved>“{selfNote}”</PsSaved>
                  ) : (
                    <>
                      <FreeInput
                        rows={2}
                        placeholder="스스로에게 건네고 싶은 말을 적어보세요."
                        value={selfNote}
                        onChange={(e) => setSelfNote(e.target.value)}
                      />
                      <PsBtn onClick={saveSelf} disabled={!selfNote.trim()}>
                        남기기
                      </PsBtn>
                    </>
                  )}
                </PsBox>

                <Disclaimer>
                  이 체크인은 의학적 진단이 아니라, 오늘의 마음을 돌아보기 위한 가벼운
                  기록이에요.
                </Disclaimer>
              </LetterCard>

              <Explore>
                <ExploreLabel>🧭 이 마음, 웹에서 더 둘러보기</ExploreLabel>
                <ExploreLinks>
                  <ExploreLink
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      mood.label + " 어울리는 음악 플레이리스트"
                    )}`}
                  >
                    🎧 어울리는 음악
                  </ExploreLink>
                  <ExploreLink
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      mood.label + " 위로가 되는 글귀"
                    )}`}
                  >
                    📖 위로가 되는 글
                  </ExploreLink>
                  <ExploreLink
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      mood.label + " 마음 다스리는 법"
                    )}`}
                  >
                    🌿 마음 다스리기
                  </ExploreLink>
                </ExploreLinks>
              </Explore>

              <Actions>
                <Btn onClick={changePersona}>다른 사람에게 받기 🔀</Btn>
                <Btn onClick={drawAgain}>다른 한마디 🔄</Btn>
                <Btn onClick={saveCurrent} disabled={justSaved}>
                  {justSaved ? "담았어요 ✓" : "마음에 담기 🔖"}
                </Btn>
                {shareData && <ShareCard data={shareData} />}
                <Btn $primary onClick={resetFlow}>
                  처음으로
                </Btn>
              </Actions>

              <Footer>
                {dateText ? `${dateText} · ` : ""}
                {streak > 0
                  ? `${streak}일째 마음을 들여다보는 중 🌱`
                  : "오늘 기록을 남겼어요 🌱"}
              </Footer>
            </>
          )}
        </>
      )}

      {tab === "calendar" && today && (
        <MoodCalendar journal={journal} today={today} />
      )}

      {tab === "saved" && (
        <SavedWrap>
          {saved.length === 0 ? (
            <CalEmptyMsg>
              아직 담은 문장이 없어요. 마음에 드는 한마디를 만나면 “마음에 담기 🔖”로 모아보세요.
            </CalEmptyMsg>
          ) : (
            saved.map((s) => (
              <SavedCard key={s.id} style={{ borderColor: `${s.color}44` }}>
                <SavedTop>
                  <SavedEmoji>{s.emoji}</SavedEmoji>
                  <SavedDate>
                    {s.dateKey} · {s.caption}
                  </SavedDate>
                  <SavedDel onClick={() => deleteSaved(s.id)} aria-label="삭제">
                    ✕
                  </SavedDel>
                </SavedTop>
                <SavedMessage>{s.message}</SavedMessage>
                <SavedQuote>
                  “{s.quoteText}”{" "}
                  <SavedQAuthor>— {s.quoteAuthor}</SavedQAuthor>
                </SavedQuote>
              </SavedCard>
            ))
          )}
        </SavedWrap>
      )}
    </>
  );
}

function StepAdvisor({ persona }: { persona: Persona }) {
  return (
    <Advisor>
      <AdvisorPhoto src={persona.avatar} alt="" />
      <AdvisorCopy>
        <AdvisorName>{persona.name}</AdvisorName>
        <AdvisorTag>{persona.tagline}</AdvisorTag>
      </AdvisorCopy>
      <AdvisorBadge>상담 중</AdvisorBadge>
    </Advisor>
  );
}

function StepHeader({
  step,
  total,
  onBack,
  onSkip,
}: {
  step: number;
  total: number;
  onBack: () => void;
  onSkip: () => void;
}) {
  return (
    <StepHead>
      <StepBack onClick={onBack}>‹ 뒤로</StepBack>
      <StepDots>
        {Array.from({ length: total }).map((_, i) => (
          <Dot key={i} $on={i < step} />
        ))}
      </StepDots>
      <StepSkip onClick={onSkip}>건너뛰기</StepSkip>
    </StepHead>
  );
}
