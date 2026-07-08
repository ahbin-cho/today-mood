"use client";

import { useMemo, useState } from "react";
import { moods } from "@/data/moods";
import { reflectNote } from "@/data/checkin";
import { dateKey, type JournalMap, type Entry } from "@/lib/storage";
import { kst, fmtTime } from "@/lib/time";

const moodById = Object.fromEntries(moods.map((m) => [m.id, m]));
const WEEK = ["일", "월", "화", "수", "목", "금", "토"];
const INTENSITY_LABELS = ["", "아주 살짝", "살짝", "보통", "꽤", "아주 많이"];

export default function MoodCalendar({
  journal,
  today,
}: {
  journal: JournalMap;
  today: Date;
}) {
  const [view, setView] = useState(() => {
    const k = kst(today);
    return { year: k.year(), month: k.month() };
  });
  const [selected, setSelected] = useState<string | null>(null);

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [view]);

  const monthlyCount = useMemo(() => {
    const prefix = `${view.year}-${String(view.month + 1).padStart(2, "0")}`;
    return Object.entries(journal)
      .filter(([k]) => k.startsWith(prefix))
      .reduce((sum, [, entries]) => sum + entries.length, 0);
  }, [journal, view]);

  const todayKey = dateKey(today);

  const shift = (delta: number) => {
    setSelected(null);
    setView((v) => {
      const m = v.month + delta;
      const year = v.year + Math.floor(m / 12);
      const month = ((m % 12) + 12) % 12;
      return { year, month };
    });
  };

  const keyFor = (d: number) =>
    `${view.year}-${String(view.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const selectedEntries = selected ? journal[selected] : undefined;

  return (
    <div className="cal-wrap">
      <div className="cal-head">
        <button className="cal-nav" onClick={() => shift(-1)} aria-label="이전 달">
          ‹
        </button>
        <div className="cal-title">
          {view.year}년 {view.month + 1}월
        </div>
        <button className="cal-nav" onClick={() => shift(1)} aria-label="다음 달">
          ›
        </button>
      </div>

      <p className="cal-sub">이 달에 마음을 {monthlyCount}번 기록했어요.</p>

      <div className="cal-grid cal-weekrow">
        {WEEK.map((w) => (
          <div key={w} className="cal-weekday">
            {w}
          </div>
        ))}
      </div>

      <div className="cal-grid">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} className="cal-cell empty" />;
          const k = keyFor(d);
          const dayEntries = journal[k];
          const entry = dayEntries?.[dayEntries.length - 1]; // 그날 가장 최근 기록
          const mood = entry ? moodById[entry.moodId] : undefined;
          const count = dayEntries?.length ?? 0;
          const isToday = k === todayKey;
          const isSel = k === selected;
          return (
            <button
              key={i}
              className={`cal-cell${isToday ? " today" : ""}${isSel ? " sel" : ""}${
                mood ? " has" : ""
              }`}
              style={
                mood
                  ? { background: mood.bg[1], borderColor: `${mood.color}55` }
                  : undefined
              }
              title={mood ? mood.label : ""}
              onClick={() => count > 0 && setSelected(isSel ? null : k)}
            >
              <span className="cal-day">{d}</span>
              {mood && <span className="cal-emoji">{mood.emoji}</span>}
              {count > 1 && <span className="cal-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {monthlyCount === 0 && (
        <p className="cal-empty-msg">
          아직 이 달의 기록이 없어요. 기분을 고르면 여기에 마음 날씨가 쌓여요. 🌤️
        </p>
      )}

      {/* 날짜 상세 다시보기 — 그날의 여러 기록을 모두 목록으로 */}
      {selectedEntries && selectedEntries.length > 0 && (
        <div className="day-detail-list">
          {selectedEntries.length > 1 && (
            <p className="day-detail-count">
              {selected} · 이 날 {selectedEntries.length}번 기록했어요
            </p>
          )}
          {selectedEntries.map((entry, idx) => (
            <DayEntryDetail
              key={entry.ts ?? idx}
              entry={entry}
              date={selected!}
              index={selectedEntries.length > 1 ? idx + 1 : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DayEntryDetail({
  entry,
  date,
  index,
}: {
  entry: Entry;
  date: string;
  index?: number;
}) {
  const mood = moodById[entry.moodId];
  if (!mood) return null;
  const time = fmtTime(entry.ts);
  return (
    <div className="day-detail" style={{ borderColor: `${mood.color}55` }}>
      <div className="day-detail-head">
        <span className="day-detail-emoji">{entry.typeEmoji || mood.emoji}</span>
        <div>
          <p className="day-detail-date">
            {index ? `${index}번째 기록` : date}
            {time ? ` · ${time}` : ""}
          </p>
          <p className="day-detail-type">{entry.typeLabel || mood.label}</p>
        </div>
      </div>

      {typeof entry.intensity === "number" && (
        <p className="day-detail-line">
          강도 · {INTENSITY_LABELS[entry.intensity]}
        </p>
      )}

      {entry.qa && entry.qa.length > 0 && (
        <div className="qa-list">
          {entry.qa.map((item, i) => (
            <div className="qa-row" key={i}>
              <span className="qa-q">{item.q}</span>
              <span className="qa-a">{item.a}</span>
            </div>
          ))}
        </div>
      )}

      {entry.note && <p className="day-detail-note">✍️ {entry.note}</p>}
      {entry.note && reflectNote(entry.note) && (
        <p className="day-detail-reflect">💡 {reflectNote(entry.note)}</p>
      )}

      {entry.analysisRead && (
        <p className="day-detail-reading">🔎 {entry.analysisRead}</p>
      )}
      {entry.analysisSuggestion && (
        <p className="day-detail-suggest">🌱 {entry.analysisSuggestion}</p>
      )}
      {entry.message && <p className="day-detail-message">{entry.message}</p>}
      {entry.quoteText && (
        <p className="day-detail-quote">
          “{entry.quoteText}”
          {entry.quoteAuthor ? (
            <span className="saved-qauthor"> — {entry.quoteAuthor}</span>
          ) : null}
        </p>
      )}
      {entry.personaName && (
        <p className="day-detail-sign">— {entry.personaName} 드림</p>
      )}
      {entry.selfNote && (
        <p className="day-detail-self">
          🌙 오늘의 나에게 · “{entry.selfNote}”
        </p>
      )}
    </div>
  );
}
