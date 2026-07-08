// 시간·날짜는 전부 한국 시간(Asia/Seoul) 기준으로 처리.
// iframe으로 다른 사이트/해외에 임베드돼도 "오늘"의 경계와 표시 시각이 일관됩니다.
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const TZ = "Asia/Seoul";

/** 한국 시간 기준 dayjs 객체 */
export function kst(input?: dayjs.ConfigType) {
  return dayjs(input).tz(TZ);
}

/** YYYY-MM-DD (한국 시간 기준) */
export function dateKey(input?: dayjs.ConfigType): string {
  return kst(input).format("YYYY-MM-DD");
}

/** 오전/오후 h:mm (한국 시간 기준). ts 없으면 빈 문자열 */
export function fmtTime(ts?: number): string {
  if (!ts) return "";
  return kst(ts).format("A h:mm").replace("AM", "오전").replace("PM", "오후");
}
