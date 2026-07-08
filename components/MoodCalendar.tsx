"use client";

import { useMemo, useState } from "react";
import { moods } from "@/data/moods";
import { reflectNote } from "@/data/checkin";
import { dateKey, type JournalMap, type Entry } from "@/lib/storage";
import { kst, fmtTime } from "@/lib/time";
import {
  CalWrap, CalHead, CalTitle, CalNav, CalSub, CalGrid, CalWeekRow, CalWeekday,
  CalCell, CalCellEmpty, CalDay, CalEmoji, CalCount, CalEmptyMsg, DayDetailList,
  DayDetailCount, DayDetail, DayDetailHead, DayDetailEmoji, DayDetailDate,
  DayDetailType, DayDetailLine, QaList, QaRow, QaQ, QaA, DayDetailNote,
  DayDetailReflect, DayDetailReading, DayDetailSuggest, DayDetailMessage,
  DayDetailQuote, DayDetailSign, DayDetailSelf,
} from "@/components/ui/calendar";

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
    <CalWrap>
      <CalHead>
        <CalNav onClick={() => shift(-1)} aria-label="이전 달">
          ‹
        </CalNav>
        <CalTitle>
          {view.year}년 {view.month + 1}월
        </CalTitle>
        <CalNav onClick={() => shift(1)} aria-label="다음 달">
          ›
        </CalNav>
      </CalHead>

      <CalSub>이 달에 마음을 {monthlyCount}번 기록했어요.</CalSub>

      <CalWeekRow>
        {WEEK.map((w) => (
          <CalWeekday key={w}>{w}</CalWeekday>
        ))}
      </CalWeekRow>

      <CalGrid>
        {cells.map((d, i) => {
          if (d === null) return <CalCellEmpty key={i} />;
          const k = keyFor(d);
          const dayEntries = journal[k];
          const entry = dayEntries?.[dayEntries.length - 1]; // 그날 가장 최근 기록
          const mood = entry ? moodById[entry.moodId] : undefined;
          const count = dayEntries?.length ?? 0;
          const isToday = k === todayKey;
          const isSel = k === selected;
          return (
            <CalCell
              key={i}
              $has={!!mood}
              $today={isToday}
              $sel={isSel}
              style={
                mood
                  ? { background: mood.bg[1], borderColor: `${mood.color}55` }
                  : undefined
              }
              title={mood ? mood.label : ""}
              onClick={() => count > 0 && setSelected(isSel ? null : k)}
            >
              <CalDay>{d}</CalDay>
              {mood && <CalEmoji>{mood.emoji}</CalEmoji>}
              {count > 1 && <CalCount>{count}</CalCount>}
            </CalCell>
          );
        })}
      </CalGrid>

      {monthlyCount === 0 && (
        <CalEmptyMsg>
          아직 이 달의 기록이 없어요. 기분을 고르면 여기에 마음 날씨가 쌓여요. 🌤️
        </CalEmptyMsg>
      )}

      {/* 날짜 상세 다시보기 — 그날의 여러 기록을 모두 목록으로 */}
      {selectedEntries && selectedEntries.length > 0 && (
        <DayDetailList>
          {selectedEntries.length > 1 && (
            <DayDetailCount>
              {selected} · 이 날 {selectedEntries.length}번 기록했어요
            </DayDetailCount>
          )}
          {selectedEntries.map((entry, idx) => (
            <DayEntryDetail
              key={entry.ts ?? idx}
              entry={entry}
              date={selected!}
              index={selectedEntries.length > 1 ? idx + 1 : undefined}
            />
          ))}
        </DayDetailList>
      )}
    </CalWrap>
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
    <DayDetail style={{ borderColor: `${mood.color}55` }}>
      <DayDetailHead>
        <DayDetailEmoji>{entry.typeEmoji || mood.emoji}</DayDetailEmoji>
        <div>
          <DayDetailDate>
            {index ? `${index}번째 기록` : date}
            {time ? ` · ${time}` : ""}
          </DayDetailDate>
          <DayDetailType>{entry.typeLabel || mood.label}</DayDetailType>
        </div>
      </DayDetailHead>

      {typeof entry.intensity === "number" && (
        <DayDetailLine>강도 · {INTENSITY_LABELS[entry.intensity]}</DayDetailLine>
      )}

      {entry.qa && entry.qa.length > 0 && (
        <QaList>
          {entry.qa.map((item, i) => (
            <QaRow key={i}>
              <QaQ>{item.q}</QaQ>
              <QaA>{item.a}</QaA>
            </QaRow>
          ))}
        </QaList>
      )}

      {entry.note && <DayDetailNote>✍️ {entry.note}</DayDetailNote>}
      {entry.note && reflectNote(entry.note) && (
        <DayDetailReflect>💡 {reflectNote(entry.note)}</DayDetailReflect>
      )}

      {entry.analysisRead && (
        <DayDetailReading>🔎 {entry.analysisRead}</DayDetailReading>
      )}
      {entry.analysisSuggestion && (
        <DayDetailSuggest>🌱 {entry.analysisSuggestion}</DayDetailSuggest>
      )}
      {entry.message && <DayDetailMessage>{entry.message}</DayDetailMessage>}
      {entry.quoteText && (
        <DayDetailQuote>
          “{entry.quoteText}”
          {entry.quoteAuthor ? (
            <span className="opacity-70"> — {entry.quoteAuthor}</span>
          ) : null}
        </DayDetailQuote>
      )}
      {entry.personaName && (
        <DayDetailSign>— {entry.personaName} 드림</DayDetailSign>
      )}
      {entry.selfNote && (
        <DayDetailSelf>🌙 오늘의 나에게 · “{entry.selfNote}”</DayDetailSelf>
      )}
    </DayDetail>
  );
}
