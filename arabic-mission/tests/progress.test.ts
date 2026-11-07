import { test } from "node:test";
import assert from "node:assert/strict";
import { missions } from "../src/lib/content";
import {
  emptyProgress,
  recordAnswer,
  finish,
  xpOf,
  badgesOf,
  parseProgress,
  grade,
  normalize,
  levelOf,
} from "../src/lib/progress";
const answer = (a: (typeof missions)[number]["activities"][number]) =>
  a.type === "match"
    ? JSON.stringify(a.pairs!.map((p) => p[1]))
    : a.type === "speak"
      ? "self-reviewed"
      : a.type === "free"
        ? "اسمي علي. أنا طالب. أنا من إندونيسيا."
        : a.answer!;
test("25 activities with unique ids and valid keys", () => {
  const a = missions.flatMap((m) => m.activities);
  assert.equal(a.length, 25);
  assert.equal(new Set(a.map((q) => q.id)).size, 25);
  for (const q of a) {
    assert.ok(q.explanation);
    assert.ok(grade(q, answer(q)), q.id);
    if (q.options && q.type !== "order" && q.type !== "letters")
      assert.ok(q.options.includes(q.answer!));
    if (q.options && q.type === "letters")
      assert.equal(
        [...q.answer!].sort().join(""),
        [...q.options].sort().join(""),
      );
  }
});
test("wrong choice, malformed match and wrong writing are rejected", () => {
  assert.equal(grade(missions[0].activities[0], "Ali"), false);
  assert.equal(grade(missions[0].activities[3], "bad json"), false);
  assert.equal(grade(missions[3].activities[2], "طالب"), false);
  assert.equal(grade(missions[3].activities[4], "english text only"), false);
});
test("Arabic normalization allows diacritics and punctuation, preserves gender", () => {
  assert.equal(normalize(" اِسْمِي   عَلِيٌّ. "), normalize("اسمي علي"));
  assert.notEqual(normalize("طالبة"), normalize("طالب"));
});
test("double answer, finish and reload never duplicate XP", () => {
  let p = emptyProgress();
  for (const a of missions[0].activities)
    p = recordAnswer(p, "listening", a.id, answer(a));
  assert.equal(xpOf(p), 50);
  p = recordAnswer(p, "listening", "l1", "Ahmad");
  assert.equal(xpOf(p), 50);
  p = finish(p, "listening");
  assert.equal(xpOf(p), 75);
  const once = JSON.stringify(p);
  p = finish(p, "listening");
  assert.equal(JSON.stringify(p), once);
  assert.equal(xpOf(parseProgress(JSON.stringify(p))), 75);
  assert.deepEqual(badgesOf(p), ["first", "listening"]);
});
test("incomplete and failed missions do not get completion bonus", () => {
  let p = emptyProgress();
  assert.equal(finish(p, "reading").completed.length, 0);
  for (const a of missions[2].activities)
    p = recordAnswer(p, "reading", a.id, "wrong");
  p = finish(p, "reading");
  assert.equal(p.results.reading.score, 0);
  assert.equal(p.completed.length, 0);
  assert.equal(xpOf(p), 0);
});
test("80% passes but missing self reflection does not", () => {
  let p = emptyProgress();
  for (const [i, a] of missions[0].activities.entries())
    p = recordAnswer(p, "listening", a.id, i === 0 ? "wrong" : answer(a));
  p = finish(p, "listening");
  assert.equal(p.results.listening.passed, true);
  let q = emptyProgress();
  for (const a of missions[1].activities)
    q = recordAnswer(
      q,
      "speaking",
      a.id,
      a.id === "s5" ? "not completed" : answer(a),
    );
  q = finish(q, "speaking");
  assert.equal(q.results.speaking.score, 80);
  assert.equal(q.results.speaking.passed, false);
});
test("all five missions award 400 XP and six badges; retry earns no duplicates", () => {
  let p = emptyProgress();
  for (const m of missions) {
    for (const a of m.activities) p = recordAnswer(p, m.id, a.id, answer(a));
    p = finish(p, m.id);
  }
  assert.equal(xpOf(p), 400);
  assert.equal(badgesOf(p).length, 6);
  assert.equal(levelOf(400).current.name, "Mission Master");
  p = {
    ...p,
    finalized: p.finalized.filter((x) => x !== "listening"),
    drafts: { ...p.drafts, listening: {} },
  };
  for (const a of missions[0].activities)
    p = recordAnswer(p, "listening", a.id, answer(a));
  p = finish(p, "listening");
  assert.equal(xpOf(p), 400);
  assert.equal(p.results.listening.xp, 0);
  assert.deepEqual(p.results.listening.newBadges, []);
});
test("corrupt storage safely resets", () => {
  for (const raw of [
    null,
    "broken",
    "{}",
    "null",
    JSON.stringify({ ...emptyProgress(), drafts: { listening: { l1: null } } }),
    JSON.stringify({ ...emptyProgress(), earned: ["fake"] }),
  ])
    assert.deepEqual(parseProgress(raw), emptyProgress());
});
