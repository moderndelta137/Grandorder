import { ENEMY_INTEL_RULES } from "../src/data/generatedData.js";
import { INITIAL_STATE, SCENES } from "../src/scenario.js";

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function sceneIdsForChapter(chapter) {
  return Object.keys(SCENES).filter((id) => id.startsWith(`chapter${chapter}_`));
}

// 1) 命名規約チェック
const chapterSceneIds = Object.keys(SCENES).filter((id) => /^chapter\d+_/.test(id)).sort();
const namingRegex = /^chapter([1-6])_(main|opt|branch)_\d{3}$/;
for (const id of chapterSceneIds) {
  assert(namingRegex.test(id), `命名規約違反: ${id}`);
}

for (let chapter = 1; chapter <= 6; chapter += 1) {
  const ids = sceneIdsForChapter(chapter);
  assert(ids.length > 0, `第${chapter}章の本文シーンが未定義`);
  assert(ids.includes(`chapter${chapter}_main_001`), `第${chapter}章の入口 scene chapter${chapter}_main_001 がない`);
}

// 2) getChapterContentEntryScene相当の入口存在チェック
for (let chapter = 1; chapter <= 6; chapter += 1) {
  const state = structuredClone(INITIAL_STATE);
  state.progress.chapterIndex = chapter;
  const expected = `chapter${chapter}_main_001`;
  assert(Boolean(SCENES[expected]), `章入口の参照先がSCENESに存在しない: ${expected}`);
}

// 3) ??? 開示 / 看破連動ルールの整合チェック
const sortedRules = [...ENEMY_INTEL_RULES].sort((a, b) => a.level - b.level);
assert(sortedRules.length > 0, "ENEMY_INTEL_RULES が空");

for (let i = 0; i < sortedRules.length; i += 1) {
  const rule = sortedRules[i];
  const prev = sortedRules[i - 1] || rule;
  assert(rule.level === i, `看破ルールのlevel連番不整合: expected=${i}, got=${rule.level}`);
  assert(rule.revealStatsCount >= prev.revealStatsCount, `revealStatsCount が単調増加でない(level=${rule.level})`);
  assert(rule.revealSkillCount >= prev.revealSkillCount, `revealSkillCount が単調増加でない(level=${rule.level})`);
  assert(rule.revealTrueName >= prev.revealTrueName, `revealTrueName が単調増加でない(level=${rule.level})`);
  assert(rule.revealNpType >= prev.revealNpType, `revealNpType が単調増加でない(level=${rule.level})`);
  assert(rule.revealNpName >= prev.revealNpName, `revealNpName が単調増加でない(level=${rule.level})`);
}

const level0 = sortedRules.find((r) => r.level === 0);
const level3 = sortedRules.find((r) => r.level === 3);
const level4 = sortedRules.find((r) => r.level === 4);
assert(level0 && level0.revealTrueName === 0 && level0.revealNpType === 0 && level0.revealNpName === 0, "level0で???維持ルールを満たしていない");
assert(level3 && level3.revealNpType === 1, "level3で宝具種別が開示されない");
assert(level4 && level4.revealTrueName === 1 && level4.revealNpName === 1, "level4で真名/宝具名が開示されない");

if (errors.length) {
  console.error("Sprint3 D-2 check failed:");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log("Sprint3 D-2 check passed.");
console.log(`- 命名規約: ${chapterSceneIds.length} scenes OK`);
console.log(`- 章入口参照: chapter1〜6_main_001 OK`);
console.log(`- ??? 開示 / 看破連動ルール: ENEMY_INTEL_RULES(${sortedRules.length} levels) OK`);
