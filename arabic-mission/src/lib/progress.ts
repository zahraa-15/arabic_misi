import { missions, levels, type Activity } from "./content";
export type Answer = { value: string; correct: boolean };
export type Result = {
  answers: Record<string, Answer>;
  score: number;
  passed: boolean;
  date: string;
  xp: number;
  newBadges: string[];
};
export type Progress = {
  version: 1;
  finalized: string[];
  earned: string[];
  completed: string[];
  drafts: Record<string, Record<string, Answer>>;
  results: Record<string, Result>;
  history: { mission: string; score: number; date: string }[];
  last: string | null;
};
export const emptyProgress = (): Progress => ({
  version: 1,
  finalized: [],
  earned: [],
  completed: [],
  drafts: {},
  results: {},
  history: [],
  last: null,
});
export const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[.,!?؟،؛۔]/g, "")
    .trim()
    .replace(/\s+/g, " ");
export function grade(a: Activity, value: string) {
  if (a.type === "match") {
    try {
      return (
        JSON.stringify(JSON.parse(value)) ===
        JSON.stringify(a.pairs?.map((p) => p[1]))
      );
    } catch {
      return false;
    }
  }
  if (a.type === "speak") return value === "self-reviewed";
  if (a.type === "free")
    return /[\u0621-\u064A]/.test(value) && value.trim().length >= 15;
  return [a.answer, ...(a.accepted ?? [])]
    .filter(Boolean)
    .some((v) => normalize(v!) === normalize(value));
}
export const xpOf = (p: Progress) =>
  p.earned.length * 10 +
  p.completed.reduce((n, id) => n + (id === "final" ? 50 : 25), 0);
export const badgesOf = (p: Progress) => [
  ...(p.completed.length ? ["first"] : []),
  ...["listening", "speaking", "reading", "writing"].filter((id) =>
    p.completed.includes(id),
  ),
  ...(missions.every((m) => p.completed.includes(m.id)) ? ["master"] : []),
];
export function levelOf(xp: number) {
  const index = levels.findLastIndex((l) => xp >= l.xp);
  const current = levels[Math.max(0, index)];
  const next = levels[index + 1];
  return {
    current,
    next,
    percent: next
      ? Math.min(100, ((xp - current.xp) / (next.xp - current.xp)) * 100)
      : 100,
  };
}
export function recordAnswer(
  p: Progress,
  mission: string,
  id: string,
  value: string,
): Progress {
  const a = missions
    .find((m) => m.id === mission)
    ?.activities.find((q) => q.id === id);
  if (!a || p.drafts[mission]?.[id]) return p;
  const correct = grade(a, value);
  return {
    ...p,
    last: mission,
    earned: correct && !p.earned.includes(id) ? [...p.earned, id] : p.earned,
    drafts: {
      ...p.drafts,
      [mission]: { ...p.drafts[mission], [id]: { value, correct } },
    },
  };
}
export function finish(p: Progress, id: string): Progress {
  const m = missions.find((m) => m.id === id);
  if (!m || p.finalized.includes(id)) return p;
  const answers = p.drafts[id] ?? {};
  if (m.activities.some((a) => !answers[a.id])) return p;
  const score = Math.round(
    (m.activities.filter((a) => answers[a.id].correct).length /
      m.activities.length) *
      100,
  );
  const passed =
    score >= 80 &&
    m.activities
      .filter((a) => ["speak", "free"].includes(a.type))
      .every((a) => answers[a.id].correct);
  const previous = badgesOf(p);
  const completed =
    passed && !p.completed.includes(id) ? [...p.completed, id] : p.completed;
  const next = { ...p, completed };
  const date = new Date().toISOString();
  const xp =
    completed.length > p.completed.length ? (id === "final" ? 50 : 25) : 0;
  return {
    ...next,
    finalized: [...p.finalized, id],
    results: {
      ...p.results,
      [id]: {
        answers,
        score,
        passed,
        date,
        xp,
        newBadges: badgesOf(next).filter((b) => !previous.includes(b)),
      },
    },
    history: [{ mission: id, score, date }, ...p.history].slice(0, 50),
  };
}
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const p = JSON.parse(raw);
    if (
      p.version !== 1 ||
      !Array.isArray(p.finalized) ||
      p.finalized.some((v: unknown) => typeof v !== "string") ||
      !Array.isArray(p.earned) ||
      !Array.isArray(p.completed) ||
      typeof p.drafts !== "object" ||
      !p.drafts ||
      typeof p.results !== "object" ||
      !p.results ||
      !Array.isArray(p.history)
    )
      throw Error();
    const valid = missions.map((m) => m.id);
    const all = missions.flatMap((m) => m.activities.map((a) => a.id));
    if (
      p.earned.some(
        (id: unknown) => typeof id !== "string" || !all.includes(id),
      ) ||
      p.completed.some(
        (id: unknown) => typeof id !== "string" || !valid.includes(id),
      )
    )
      throw Error();
    for (const [mid, answers] of Object.entries(p.drafts)) {
      if (!valid.includes(mid) || !answers || typeof answers !== "object")
        throw Error();
      for (const [id, a] of Object.entries(answers)) {
        if (
          !missions
            .find((m) => m.id === mid)
            ?.activities.some((q) => q.id === id) ||
          !a ||
          typeof a.value !== "string" ||
          typeof a.correct !== "boolean"
        )
          throw Error();
      }
    }
    for (const [id, r] of Object.entries(p.results) as [string, Result][]) {
      if (
        !valid.includes(id) ||
        !r ||
        !r.answers ||
        typeof r.answers !== "object" ||
        Object.values(r.answers).some(
          (a) =>
            !a || typeof a.value !== "string" || typeof a.correct !== "boolean",
        ) ||
        !Number.isFinite(r.score) ||
        r.score < 0 ||
        r.score > 100 ||
        typeof r.passed !== "boolean" ||
        !Number.isFinite(r.xp) ||
        !Array.isArray(r.newBadges) ||
        typeof r.date !== "string"
      )
        throw Error();
    }
    if (
      p.history.some(
        (h: Progress["history"][number]) =>
          !h ||
          !valid.includes(h.mission) ||
          !Number.isFinite(h.score) ||
          typeof h.date !== "string",
      )
    )
      throw Error();
    return {
      ...p,
      earned: [...new Set(p.earned)],
      completed: [...new Set(p.completed)],
      history: p.history.slice(0, 50),
      last: valid.includes(p.last) ? p.last : null,
    };
  } catch {
    return emptyProgress();
  }
}
