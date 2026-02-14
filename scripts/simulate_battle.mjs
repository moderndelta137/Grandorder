import { INITIAL_STATE, SCENES } from '../src/scenario.js';
import { FSN_SERVANTS } from '../src/data/generatedData.js';

const ACTION_LABELS = ['通常攻撃', '宝具解放', '令呪で強制突破', '撤退'];

const TARGET_RATE = {
  通常攻撃: { min: 0.45, max: 0.6 },
  宝具解放: { min: 0.65, max: 0.82 },
  令呪で強制突破: { min: 0.8, max: 0.95 },
  撤退: { min: 0.55, max: 0.75 },
};

function cloneState() {
  return structuredClone(INITIAL_STATE);
}

function pickChoice(sceneKey, label) {
  const scene = SCENES[sceneKey];
  if (!scene) throw new Error(`scene not found: ${sceneKey}`);
  const choice = scene.choices?.find((c) => c.label === label);
  if (!choice) throw new Error(`choice not found: ${sceneKey} -> ${label}`);
  return choice;
}

function runChoice(state, sceneKey, label) {
  const choice = pickChoice(sceneKey, label);
  choice.effect?.(state);
  const next = typeof choice.next === 'function' ? choice.next(state) : choice.next;
  return next;
}


function forceBenchmarkServant(state) {
  const benchmark = FSN_SERVANTS.find((s) => s.trueName === 'エミヤ') || FSN_SERVANTS[0];
  state.servant.className = benchmark.className;
  state.servant.sourceName = benchmark.trueName;
  state.servant.params = structuredClone(benchmark.stats);
  state.log.push(`回帰テスト固定: ${benchmark.trueName}（${benchmark.className}）で評価。`);
}

function setupToNightBattle(state) {
  runChoice(state, 'title', '主人公ビルドを決める');
  runChoice(state, 'buildSelect', '研究型（情報高）');
  runChoice(state, 'catalystSelect', '異国の魔導書断片を使用する');
  runChoice(state, 'summonResult', '第1章へ進む');
  forceBenchmarkServant(state);
  runChoice(state, 'chapterIntro', '作戦会議を終えて行動開始');
  runChoice(state, 'dayAction', '先制配置（夜戦補正）');
}

function validateState(state, actionLabel) {
  const nums = [state.master.hp, state.master.mana, state.master.commandSpells];
  if (nums.some((v) => Number.isNaN(v))) {
    throw new Error(`NaN detected after ${actionLabel}`);
  }

  const affinityLogs = state.log.filter((line) => line.includes('クラス相性:'));
  if (affinityLogs.length < 2) {
    throw new Error(`affinity logs missing after ${actionLabel}`);
  }
}

function runOne(actionLabel) {
  const state = cloneState();
  setupToNightBattle(state);

  const before = {
    hp: state.master.hp,
    mana: state.master.mana,
    commands: state.master.commandSpells,
  };

  runChoice(state, 'nightBattle', actionLabel);
  validateState(state, actionLabel);

  const masterDamaged = state.master.hp < before.hp;
  const commandUsed = state.master.commandSpells < before.commands;
  const manaSpent = state.master.mana < before.mana;
  const success = Boolean(state.battle.lastActionWin);

  return {
    enemyDamaged: success,
    masterDamaged,
    commandUsed,
    manaSpent,
    success,
  };
}

function main() {
  const ITERATIONS = 400;
  const summary = {};

  for (const label of ACTION_LABELS) {
    summary[label] = { enemyDamaged: 0, masterDamaged: 0, commandUsed: 0, manaSpent: 0, success: 0 };
    for (let i = 0; i < ITERATIONS; i += 1) {
      const result = runOne(label);
      Object.keys(summary[label]).forEach((k) => {
        if (result[k]) summary[label][k] += 1;
      });
    }
  }

  console.log('Battle regression summary (iterations per action =', ITERATIONS, ')');
  let failed = false;
  for (const label of ACTION_LABELS) {
    const row = summary[label];
    const rate = row.success / ITERATIONS;
    const range = TARGET_RATE[label];
    const within = rate >= range.min && rate <= range.max;
    if (!within) failed = true;
    console.log(label, { ...row, successRate: rate.toFixed(3), target: `${range.min}-${range.max}`, withinRange: within });
  }

  if (failed) {
    throw new Error('勝率レンジ外の行動があります。係数調整を継続してください。');
  }
}

main();
