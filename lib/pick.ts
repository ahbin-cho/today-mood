// 날짜를 시드로 한 결정적 선택 (같은 날엔 항상 같은 결과)
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** seed 문자열을 기준으로 배열에서 하나를 결정적으로 고른다 */
export function seededPick<T>(arr: T[], seed: string): T {
  if (arr.length === 0) throw new Error("빈 배열에서 뽑을 수 없어요");
  return arr[hashString(seed) % arr.length];
}

/** 랜덤 선택 (직전 값과 다르게) */
export function pickRandom<T>(arr: T[], exclude?: T): T {
  if (arr.length <= 1) return arr[0];
  let next = arr[Math.floor(Math.random() * arr.length)];
  if (exclude !== undefined && next === exclude) {
    next = arr[(arr.indexOf(next) + 1) % arr.length];
  }
  return next;
}
