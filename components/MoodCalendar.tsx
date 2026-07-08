"use client";

import { useMemo, useState } from "react";
import { moods } from "@/data/moods";
import { reflectNote } from "@/data/checkin";
import { dateKey, type JournalMap } from "@/lib/storage";

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
  const [view, setView] = useState(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
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
    return Object.keys(journal).filter((k) => k.startsWith(prefix)).length;
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

  const selectedEntry = selected ? journal[selected] : undefined;
  const selectedMood = selectedEntry ? moodById[selectedEntry.moodId] : undefined;

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
          const entry = journal[k];
          const mood = entry ? moodById[entry.moodId] : undefined;
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
              onClick={() => entry && setSelected(isSel ? null : k)}
            >
              <span className="cal-day">{d}</span>
              {mood && <span className="cal-emoji">{mood.emoji}</span>}
            </button>
          );
        })}
      </div>

      {monthlyCount === 0 && (
        <p className="cal-empty-msg">
          아직 이 달의 기록이 없어요. 기분을 고르면 여기에 마음 날씨가 쌓여요. 🌤️
        </p>
      )}

      {/* 날짜 상세 다시보기 */}
      {selectedEntry && selectedMood && (
        <div
          className="day-detail"
          style={{ borderColor: `${selectedMood.color}55` }}
        >
          <div className="day-detail-head">
            <span className="day-detail-emoji">
              {selectedEntry.typeEmoji || selectedMood.emoji}
            </span>
            <div>
              <p className="day-detail-date">{selected}</p>
              <p className="day-detail-type">
                {selectedEntry.typeLabel || selectedMood.label}
              </p>
            </div>
          </div>

          {typeof selectedEntry.intensity === "number" && (
            <p className="day-detail-line">
              강도 · {INTENSITY_LABELS[selectedEntry.intensity]}
            </p>
          )}

          {selectedEntry.qa && selectedEntry.qa.length > 0 && (
            <div className="qa-list">
              {selectedEntry.qa.map((item, i) => (
                <div className="qa-row" key={i}>
                  <span className="qa-q">{item.q}</span>
                  <span className="qa-a">{item.a}</span>
                </div>
              ))}
            </div>
          )}

          {selectedEntry.note && (
            <p className="day-detail-note">✍️ {selectedEntry.note}</p>
          )}
          {selectedEntry.note && reflectNote(selectedEntry.note) && (
            <p className="day-detail-reflect">💡 {reflectNote(selectedEntry.note)}</p>
          )}

          {selectedEntry.analysisRead && (
            <p className="day-detail-reading">🔎 {selectedEntry.analysisRead}</p>
          )}
          {selectedEntry.analysisSuggestion && (
            <p className="day-detail-suggest">
              🌱 {selectedEntry.analysisSuggestion}
            </p>
          )}
          {selectedEntry.message && (
            <p className="day-detail-message">{selectedEntry.message}</p>
          )}
          {selectedEntry.quoteText && (
            <p className="day-detail-quote">
              “{selectedEntry.quoteText}”
              {selectedEntry.quoteAuthor ? (
                <span className="saved-qauthor"> — {selectedEntry.quoteAuthor}</span>
              ) : null}
            </p>
          )}
          {selectedEntry.personaName && (
            <p className="day-detail-sign">— {selectedEntry.personaName} 드림</p>
          )}
          {selectedEntry.selfNote && (
            <p className="day-detail-self">
              🌙 오늘의 나에게 · “{selectedEntry.selfNote}”
            </p>
          )}
        </div>
      )}
    </div>
  );
}
