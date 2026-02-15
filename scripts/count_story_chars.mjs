import { INITIAL_STATE, SCENES } from "../src/scenario.js";

const CHAPTER_TARGETS = {
  1: 7000,
  2: 8000,
  3: 8500,
  4: 8500,
  5: 9000,
  6: 8500,
};
const TOTAL_TARGET = 49500;

function getSceneText(sceneId, state = INITIAL_STATE) {
  const scene = SCENES[sceneId];
  if (!scene) return "";
  const local = structuredClone(state);
  const text = typeof scene.text === "function" ? scene.text(local) : scene.text;
  return String(text || "");
}

function countChars(text) {
  return String(text)
    .replace(/\s+/g, "")
    .length;
}

const chapterRows = [];
let totalChars = 0;

for (let chapter = 1; chapter <= 6; chapter += 1) {
  const ids = Object.keys(SCENES)
    .filter((id) => id.startsWith(`chapter${chapter}_`))
    .sort();

  const sum = ids
    .map((id) => countChars(getSceneText(id)))
    .reduce((a, b) => a + b, 0);

  totalChars += sum;
  chapterRows.push({
    chapter,
    scenes: ids.length,
    chars: sum,
    target: CHAPTER_TARGETS[chapter] || 0,
  });
}

const endingChars = countChars(getSceneText("endingJudge"));
totalChars += endingChars;

for (const row of chapterRows) {
  const diff = row.chars - row.target;
  const pct = row.target > 0 ? ((row.chars / row.target) * 100).toFixed(1) : "0.0";
  console.log(
    `第${row.chapter}章: ${row.chars}文字 / 目標${row.target}文字 (${pct}%) / シーン${row.scenes}件 / 差分${diff >= 0 ? "+" : ""}${diff}`
  );
}

console.log(`エンディング本文: ${endingChars}文字`);

const totalDiff = totalChars - TOTAL_TARGET;
const totalPct = ((totalChars / TOTAL_TARGET) * 100).toFixed(1);
console.log("---");
console.log(
  `総文字数(章本文+エンディング): ${totalChars}文字 / 目標${TOTAL_TARGET}文字 (${totalPct}%) / 差分${totalDiff >= 0 ? "+" : ""}${totalDiff}`
);
