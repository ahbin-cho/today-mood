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
import { seededPick, pickRandom } from "@/lib/pick";
import {
  dateKey,
  loadJournal,
  recordEntry,
  loadSaved,
  addSaved,
  removeSaved,
  calcStreak,
  saveJournalAll,
  saveSavedAll,
  type JournalMap,
  type Entry,
  type SavedItem,
  type QA,
} from "@/lib/storage";
import { getDeviceId } from "@/lib/uid";
import { pullMoodState, pushMoodState } from "@/lib/cloud";
import ShareCard, { type ShareCardData } from "@/components/ShareCard";
import MoodCalendar from "@/components/MoodCalendar";

const DEFAULT_BG: [string, string] = ["#FBF6EE", "#F3E9DB"];
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const INTENSITY_LABELS = ["", "아주 살짝", "살짝", "보통", "꽤", "아주 많이"];
const PERSONA_KEY = "today-mood:persona:v1";

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
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()} (${WEEK[d.getDay()]})`;
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

  const [personaId, setPersonaId] = useState<string>("seoa");
  const [selfNote, setSelfNote] = useState("");
  const [selfSaved, setSelfSaved] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const uidRef = useRef("");

  // 현재 localStorage 상태를 클라우드로 밀어넣기 (미설정이면 no-op)
  const cloudSync = () => {
    if (uidRef.current) pushMoodState(uidRef.current, loadJournal(), loadSaved());
  };

  useEffect(() => {
    const now = new Date();
    setToday(now);
    const localJ = loadJournal();
    const localS = loadSaved();
    setJournal(localJ);
    setSaved(localS);
    const stored =
      typeof window !== "undefined"
        ? window.localStorage.getItem(PERSONA_KEY)
        : null;
    setPersonaId(
      stored && personaById[stored]
        ? stored
        : seededPick(personas, dateKey(now)).id
    );

    // 클라우드 동기화 (Supabase 설정 시에만 동작)
    const uid = getDeviceId();
    uidRef.current = uid;
    (async () => {
      const cloud = await pullMoodState(uid);
      if (cloud) {
        const mergedJ: JournalMap = { ...cloud.journal, ...localJ };
        const byId = new Map<string, SavedItem>();
        [...cloud.saved, ...localS].forEach((x) => byId.set(x.id, x));
        const mergedS = Array.from(byId.values());
        saveJournalAll(mergedJ);
        saveSavedAll(mergedS);
        setJournal(mergedJ);
        setSaved(mergedS);
        pushMoodState(uid, mergedJ, mergedS);
      } else {
        pushMoodState(uid, localJ, localS);
      }
    })();
  }, []);

  const dateText = today ? labelOf(today) : "";
  const todayKey = today ? dateKey(today) : "";
  const streak = today ? calcStreak(journal, today) : 0;
  const persona: Persona = personaById[personaId] || personas[0];

  const daily = useMemo<Quote | null>(
    () => (todayKey ? seededPick(dailyOneLiners, todayKey) : null),
    [todayKey]
  );
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
    if (typeof window !== "undefined") {
      window.localStorage.setItem(PERSONA_KEY, id);
    }
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
      <div
        className="ambient"
        style={{
          background: `radial-gradient(120% 90% at 50% 0%, ${bg[0]} 0%, ${bg[1]} 100%)`,
        }}
      >
        <span className="orb orb-a" style={{ background: bg[1] }} />
        <span className="orb orb-b" style={{ background: bg[0] }} />
      </div>

      <nav className="tabs">
        <button
          className={`tab${tab === "today" ? " on" : ""}`}
          onClick={() => setTab("today")}
        >
          오늘
        </button>
        <button
          className={`tab${tab === "calendar" ? " on" : ""}`}
          onClick={() => setTab("calendar")}
        >
          마음 날씨
        </button>
        <button
          className={`tab${tab === "saved" ? " on" : ""}`}
          onClick={() => setTab("saved")}
        >
          담은 문장{saved.length > 0 ? ` (${saved.length})` : ""}
        </button>
      </nav>

      {tab === "today" && (
        <>
          {stage === "home" && (
            <>
              <div className="daily-banner">
                <p className="daily-label">⭐ 오늘의 한마디</p>
                {daily ? (
                  <>
                    <p className="daily-text">“{daily.text}”</p>
                    <p className="daily-author">— {daily.author}</p>
                  </>
                ) : (
                  <p className="daily-text dim">오늘의 한마디를 불러오는 중…</p>
                )}
              </div>

              <p className="section-label">오늘의 마음을 누구와 살펴볼까요?</p>
              <div className="persona-row">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    className={`persona-chip${p.id === personaId ? " on" : ""}`}
                    onClick={() => choosePersona(p.id)}
                  >
                    <img className="persona-photo" src={p.avatar} alt="" />
                    <span className="persona-copy">
                      <span className="persona-name">{p.name}</span>
                      <span className="persona-tag">{p.tagline}</span>
                    </span>
                  </button>
                ))}
              </div>

              <p className="section-label">지금 마음과 가장 가까운 문장을 골라보세요</p>
              <div className="mood-grid">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    className="mood-btn"
                    onClick={() => startFlow(m)}
                  >
                    <span className="mood-emoji" aria-hidden="true">{m.emoji}</span>
                    <span className="mood-copy">
                      <span className="mood-name">{m.label}</span>
                      <span className="mood-caption">{m.caption}</span>
                    </span>
                    <span
                      className="mood-line"
                      style={{ background: m.color }}
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>

              <p className="footer">
                {dateText ? `${dateText} · ` : ""}
                {streak > 0
                  ? `${streak}일째 마음을 들여다보는 중 🌱`
                  : "오늘 하루도 당신의 마음을 응원해요."}
              </p>
            </>
          )}

          {/* ---- 강도 ---- */}
          {stage === "intensity" && mood && (
            <div className="step-card">
              <StepAdvisor persona={persona} />
              <StepHeader
                step={1}
                total={totalSteps}
                onBack={resetFlow}
                onSkip={() => enterResult(note)}
              />
              <div className="step-emoji">{mood.emoji}</div>
              <p className="step-title">“{mood.label}”, 얼마나 그런가요?</p>
              <p className="intensity-value">{INTENSITY_LABELS[intensity]}</p>
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
              <div className="slider-ends">
                <span>살짝</span>
                <span>많이</span>
              </div>
              <button
                className="free-btn"
                onClick={() => setStage("questions")}
              >
                다음
              </button>
            </div>
          )}

          {/* ---- 기분별 질문 ---- */}
          {stage === "questions" && mood && sessionQuestions[qIndex] && (
            <div className="step-card">
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
              <div className="step-emoji">{sessionQuestions[qIndex].emoji}</div>
              <p className="step-title">{sessionQuestions[qIndex].title}</p>
              <div className="choices">
                {sessionQuestions[qIndex].choices.map((c) => {
                  const on = picked[qIndex]?.label === c.label;
                  return (
                    <button
                      key={c.label}
                      className={`choice${on ? " on" : ""}`}
                      style={on ? { borderColor: mood.color } : undefined}
                      onClick={() => answer(qIndex, c)}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---- 메모 ---- */}
          {stage === "note" && mood && (
            <div className="step-card">
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
              <div className="step-emoji">✍️</div>
              <p className="step-title">오늘 있었던 일을 한 줄로 남겨볼래요?</p>
              <p className="step-sub">비워두어도 괜찮아요.</p>
              <textarea
                className="free-input"
                rows={3}
                placeholder="예: 회의가 많아 정신없었지만 저녁엔 좋아하는 걸 먹었다."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button
                className="free-btn"
                onClick={() => enterResult(note)}
              >
                편지 받기
              </button>
            </div>
          )}

          {/* ---- 편지(결과) ---- */}
          {stage === "result" && mood && rc && (
            <>
              <div
                className="letter-card"
                style={{
                  background: `linear-gradient(160deg, ${mood.color}18 0%, rgba(255,255,255,0.9) 92%)`,
                  border: `1px solid ${mood.color}44`,
                }}
              >
                {rc.profile && (
                  <div className="report">
                    <p className="report-label">🧭 오늘의 마음 진단 결과</p>
                    <p className="report-type">
                      <span className="report-emoji">{rc.profile.emoji}</span>
                      {rc.profile.label}
                    </p>
                    <div className="report-score">
                      <div className="report-score-top">
                        <span>마음 점수</span>
                        <span className="report-score-num">
                          {moodScore(rc.profile.avg)}점
                        </span>
                      </div>
                      <div className="report-bar">
                        <span
                          className="report-bar-fill"
                          style={{
                            width: `${moodScore(rc.profile.avg)}%`,
                            background: mood.color,
                          }}
                        />
                      </div>
                    </div>
                    <p className="report-summary">{rc.profile.summary}</p>
                  </div>
                )}

                {analysis && (
                  <div className="reading">
                    <p className="reading-label">🔎 상담 소견</p>
                    <p className="reading-read">{analysis.read}</p>
                    <div className="reading-suggest">
                      <span className="reading-suggest-tag">🌱 오늘의 제안</span>
                      <span className="reading-suggest-text">
                        {analysis.suggestion}
                      </span>
                    </div>
                    {analysis.caution && (
                      <p className="reading-caution">{analysis.caution}</p>
                    )}
                  </div>
                )}

                <div className="letter-from">
                  <img className="letter-avatar-img" src={persona.avatar} alt="" />
                  <span className="letter-fromtext">
                    {persona.name}
                    <span className="letter-tag"> · {persona.tagline}</span>
                  </span>
                </div>

                <p className="letter-open">{acknowledgment(mood.id, intensity)}</p>

                {note.trim() && (
                  <p className="letter-echo">
                    “{note.trim()}”
                    <span className="letter-echo-tail">
                      그 마음, 여기 그대로 받아둘게요.
                    </span>
                  </p>
                )}
                {reflectNote(note) && (
                  <p className="letter-reflect">💡 {reflectNote(note)}</p>
                )}

                <p className="letter-line dim">{rc.opener}</p>
                <p className="letter-body">{rc.message}</p>
                <p className="letter-line dim">{rc.closer}</p>

                <div className="quote-block" style={{ borderColor: `${mood.color}44` }}>
                  <p className="quote-text">“{rc.quote.text}”</p>
                  <p className="quote-author">— {rc.quote.author}</p>
                </div>

                {rc.profile?.gentleSupport && (
                  <p className="support-note">{rc.profile.gentleSupport}</p>
                )}

                <p className="letter-sign">— {persona.name} 드림</p>

                <div className="ps-box">
                  <p className="ps-label">🌙 오늘의 나에게 한마디</p>
                  {selfSaved ? (
                    <p className="ps-saved">“{selfNote}”</p>
                  ) : (
                    <>
                      <textarea
                        className="free-input"
                        rows={2}
                        placeholder="스스로에게 건네고 싶은 말을 적어보세요."
                        value={selfNote}
                        onChange={(e) => setSelfNote(e.target.value)}
                      />
                      <button
                        className="ps-btn"
                        onClick={saveSelf}
                        disabled={!selfNote.trim()}
                      >
                        남기기
                      </button>
                    </>
                  )}
                </div>

                <p className="disclaimer">
                  이 체크인은 의학적 진단이 아니라, 오늘의 마음을 돌아보기 위한 가벼운
                  기록이에요.
                </p>
              </div>

              <div className="explore">
                <p className="explore-label">🧭 이 마음, 웹에서 더 둘러보기</p>
                <div className="explore-links">
                  <a
                    className="explore-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      mood.label + " 어울리는 음악 플레이리스트"
                    )}`}
                  >
                    🎧 어울리는 음악
                  </a>
                  <a
                    className="explore-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      mood.label + " 위로가 되는 글귀"
                    )}`}
                  >
                    📖 위로가 되는 글
                  </a>
                  <a
                    className="explore-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://www.google.com/search?q=${encodeURIComponent(
                      mood.label + " 마음 다스리는 법"
                    )}`}
                  >
                    🌿 마음 다스리기
                  </a>
                </div>
              </div>

              <div className="actions">
                <button className="btn" onClick={changePersona}>
                  다른 사람에게 받기 🔀
                </button>
                <button className="btn" onClick={drawAgain}>
                  다른 한마디 🔄
                </button>
                <button className="btn" onClick={saveCurrent} disabled={justSaved}>
                  {justSaved ? "담았어요 ✓" : "마음에 담기 🔖"}
                </button>
                {shareData && <ShareCard data={shareData} />}
                <button className="btn btn-primary" onClick={resetFlow}>
                  처음으로
                </button>
              </div>

              <p className="footer">
                {dateText ? `${dateText} · ` : ""}
                {streak > 0
                  ? `${streak}일째 마음을 들여다보는 중 🌱`
                  : "오늘 기록을 남겼어요 🌱"}
              </p>
            </>
          )}
        </>
      )}

      {tab === "calendar" && today && (
        <MoodCalendar journal={journal} today={today} />
      )}

      {tab === "saved" && (
        <div className="saved-wrap">
          {saved.length === 0 ? (
            <p className="cal-empty-msg">
              아직 담은 문장이 없어요. 마음에 드는 한마디를 만나면 “마음에 담기 🔖”로 모아보세요.
            </p>
          ) : (
            saved.map((s) => (
              <div
                key={s.id}
                className="saved-card"
                style={{ borderColor: `${s.color}44` }}
              >
                <div className="saved-top">
                  <span className="saved-emoji">{s.emoji}</span>
                  <span className="saved-date">
                    {s.dateKey} · {s.caption}
                  </span>
                  <button
                    className="saved-del"
                    onClick={() => deleteSaved(s.id)}
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
                <p className="saved-message">{s.message}</p>
                <p className="saved-quote">
                  “{s.quoteText}”{" "}
                  <span className="saved-qauthor">— {s.quoteAuthor}</span>
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

function StepAdvisor({ persona }: { persona: Persona }) {
  return (
    <div className="step-advisor">
      <img className="step-advisor-photo" src={persona.avatar} alt="" />
      <span className="step-advisor-copy">
        <span className="step-advisor-name">{persona.name}</span>
        <span className="step-advisor-tag">{persona.tagline}</span>
      </span>
      <span className="step-advisor-badge">상담 중</span>
    </div>
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
    <div className="step-head">
      <button className="step-back" onClick={onBack}>
        ‹ 뒤로
      </button>
      <div className="step-dots">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`dot${i < step ? " on" : ""}`} />
        ))}
      </div>
      <button className="step-skip" onClick={onSkip}>
        건너뛰기
      </button>
    </div>
  );
}
