import { INITIAL_STATE, SCENES } from "../src/scenario.js";

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function cloneState() {
  return structuredClone(INITIAL_STATE);
}

function getSceneChoices(state, sceneId) {
  const scene = SCENES[sceneId];
  if (!scene) throw new Error(`scene not found: ${sceneId}`);
  const choices = typeof scene.choices === "function" ? scene.choices(state) : scene.choices;
  return Array.isArray(choices) ? choices : [];
}

function getChoice(sceneId, label, state) {
  const choice = getSceneChoices(state ?? INITIAL_STATE, sceneId).find((c) => c.label === label);
  if (!choice) throw new Error(`choice not found: ${sceneId} -> ${label}`);
  return choice;
}

function runChoice(state, sceneId, label) {
  const choice = getChoice(sceneId, label, state);
  if (choice.effect) choice.effect(state);
  return typeof choice.next === "function" ? choice.next(state) : choice.next;
}

function withFixedRandom(value, fn) {
  const original = Math.random;
  Math.random = () => value;
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

function checkChapter1To2Alliance() {
  const state = cloneState();

  runChoice(state, "title", "主人公ビルドを決める");
  runChoice(state, "buildSelect", "研究型（情報高）");
  runChoice(state, "catalystSelect", "異国の魔導書断片を使用する");
  runChoice(state, "summonResult", "第1章へ進む");

  let next = runChoice(state, "chapterIntro", "作戦会議を終えて行動開始");
  assert(next === "chapter1_main_001", `第1章入口遷移不正: ${next}`);

  next = runChoice(state, "chapter1_main_001", "対等契約で進む（信頼優先）");
  assert(next === "chapter1_main_002", `chapter1_main_001 遷移不正: ${next}`);

  next = runChoice(state, "chapter1_main_002", "被害を抑えて索敵する");
  assert(next === "dayAction", `chapter1_main_002 遷移不正: ${next}`);

  // 回帰用に第2章入口状態を再現して章導線と同盟分岐を確認
  state.progress.chapterIndex = 2;
  state.progress.chapterIntroShown = 1;
  state.flags.allianceState = "none";

  next = runChoice(state, "chapterIntro", "作戦会議を終えて行動開始");
  assert(next === "chapter2_main_001", `第2章入口遷移不正: ${next}`);

  next = runChoice(state, "chapter2_main_001", "会談に応じる（情報優先）");
  assert(next === "chapter2_main_002", `chapter2_main_001 遷移不正: ${next}`);

  next = runChoice(state, "chapter2_main_002", "同盟を維持し被害を抑える");
  assert(next === "dayAction", `chapter2_main_002 遷移不正: ${next}`);

  // 第2章 intel行動で同盟状態が更新される（乱数固定で battle -> allied へ）
  withFixedRandom(0.1, () => {
    let scene = runChoice(state, "dayAction", "情報収集（敵情報を看破）");
    if (scene === "dayEncounterCheck") {
      scene = runChoice(state, "dayEncounterCheck", "行動を確定する");
    }
    assert(scene === "nightBattle", `第2章intel行動の戦闘遷移不正: ${scene}`);
  });
  assert(state.flags.allianceState === "allied", `第2章同盟分岐の更新失敗: ${state.flags.allianceState}`);
}

function checkChapter4Recovery() {
  const state = cloneState();
  state.progress.chapterIndex = 4;
  state.progress.chapterIntroShown = 4;
  state.flags.midgameRecoveryUsed = false;
  state.flags.midgameRecoveryClosed = false;
  state.flags.allianceState = "allied";
  state.flags.civilianDamage = 0;
  state.master.hp = 1;

  const next = runChoice(state, "midgameRecovery", "代償を払って再編する");
  assert(next === "dayAction", `中盤リカバリー遷移不正: ${next}`);
  assert(state.flags.midgameRecoveryUsed === true, "中盤リカバリー使用フラグが立たない");
  assert(state.master.hp === 35, `中盤リカバリー後HP不正: ${state.master.hp}`);
  assert(state.flags.allianceState === "ceasefire", `中盤リカバリー後同盟状態不正: ${state.flags.allianceState}`);
  assert(state.flags.civilianDamage === 1, `中盤リカバリー後一般被害不正: ${state.flags.civilianDamage}`);
}

function buildEndingState(overrides = {}) {
  const state = cloneState();
  state.master.hp = 80;
  state.master.commandSpells = 2;
  state.progress.enemiesDefeated = 5;
  state.servant.trueNameRevealed = false;
  state.flags.rescueUsed = false;
  state.flags.idealPoints = 3;
  state.flags.civilianDamage = 0;
  Object.assign(state.master, overrides.master || {});
  Object.assign(state.progress, overrides.progress || {});
  Object.assign(state.servant, overrides.servant || {});
  Object.assign(state.flags, overrides.flags || {});
  return state;
}

function checkEndingVariants() {
  const expected = [
    { type: "正統勝利", state: buildEndingState() },
    {
      type: "代償勝利",
      state: buildEndingState({
        flags: { idealPoints: 1, civilianDamage: 2 },
        master: { commandSpells: 0 },
      }),
    },
    {
      type: "救済生還",
      state: buildEndingState({
        progress: { enemiesDefeated: 2 },
        servant: { trueNameRevealed: true },
        flags: { rescueUsed: true, idealPoints: 0, civilianDamage: 2 },
        master: { commandSpells: 0 },
      }),
    },
    {
      type: "破滅",
      state: buildEndingState({
        master: { hp: 0, commandSpells: 0 },
        progress: { enemiesDefeated: 0 },
        servant: { trueNameRevealed: true },
        flags: { rescueUsed: true, idealPoints: 0, civilianDamage: 2 },
      }),
    },
  ];

  for (const row of expected) {
    const text = SCENES.endingJudge.text(row.state);
    assert(row.state.flags.endingType === row.type, `エンディング判定不正: expected=${row.type}, got=${row.state.flags.endingType}`);
    assert(typeof text === "string" && text.length > 0, `エンディング本文が空: ${row.type}`);
  }
}

checkChapter1To2Alliance();
checkChapter4Recovery();
checkEndingVariants();

if (errors.length) {
  console.error("Sprint3 D-3 check failed:");
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log("Sprint3 D-3 check passed.");
console.log("- 第1章開始〜第2章同盟分岐: OK");
console.log("- 第4章失敗時リカバリー導線: OK");
console.log("- 第6章到達後の4エンディング出し分け: OK");
