import { INITIAL_STATE, SCENES } from "../src/scenario.js";

const TARGET_MIN = 0.4;
const TARGET_MAX = 0.6;
const sceneIds = [
  "chapter1_main_001",
  "chapter1_main_002",
  "chapter2_main_001",
  "chapter2_main_002",
];

function getSceneText(sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) return "";
  const state = structuredClone(INITIAL_STATE);
  const text = typeof scene.text === "function" ? scene.text(state) : scene.text;
  return String(text || "");
}

function analyzeText(text) {
  let dialogueChars = 0;
  let narrationChars = 0;
  let inDialogue = false;

  for (const ch of text) {
    if (ch === "「") {
      inDialogue = true;
      continue;
    }
    if (ch === "」") {
      inDialogue = false;
      continue;
    }
    if (/\s/.test(ch)) continue;
    if (inDialogue) dialogueChars += 1;
    else narrationChars += 1;
  }

  const total = dialogueChars + narrationChars;
  const ratio = total > 0 ? dialogueChars / total : 0;
  return { dialogueChars, narrationChars, total, ratio };
}

function fmtPct(v) {
  return `${(v * 100).toFixed(1)}%`;
}

let sumDialogue = 0;
let sumNarration = 0;

for (const sceneId of sceneIds) {
  const text = getSceneText(sceneId);
  const result = analyzeText(text);
  sumDialogue += result.dialogueChars;
  sumNarration += result.narrationChars;

  const inRange = result.ratio >= TARGET_MIN && result.ratio <= TARGET_MAX;
  console.log(
    `${sceneId}: 台詞=${result.dialogueChars}, 地の文=${result.narrationChars}, 台詞比率=${fmtPct(result.ratio)} ${
      inRange ? "[OK]" : "[REVIEW]"
    }`
  );
}

const total = sumDialogue + sumNarration;
const totalRatio = total > 0 ? sumDialogue / total : 0;
const totalInRange = totalRatio >= TARGET_MIN && totalRatio <= TARGET_MAX;

console.log("---");
console.log(
  `TOTAL: 台詞=${sumDialogue}, 地の文=${sumNarration}, 台詞比率=${fmtPct(totalRatio)} ${
    totalInRange ? "[OK]" : "[REVIEW]"
  }`
);
