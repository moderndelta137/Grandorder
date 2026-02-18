import { INITIAL_STATE, SCENES } from '../src/scenario.js';
import { FSN_SERVANTS } from '../src/data/generatedData.js';

const ACTIONS = [
  { sceneLabel: '情報収集（敵情報を看破）', key: 'intel' },
  { sceneLabel: '工房整備（魔力回復）', key: 'workshop' },
  { sceneLabel: '先制配置（夜戦補正）', key: 'position' },
];

const RUNS_PER_ACTION = 1000;

function cloneState() {
  const state = structuredClone(INITIAL_STATE);
  state.master.buildType = '研究型';
  state.servant.sourceName = 'エミヤ';
  state.progress.chapterIndex = 3;
  state.flags.allianceState = 'none';
  state.flags.rescueUsed = false;
  state.factions = FSN_SERVANTS.filter((s) => s.trueName !== state.servant.sourceName).map((servant, idx) => ({
    id: idx + 1,
    className: servant.className,
    trueName: servant.trueName,
    alive: true,
    intel: { level: 0 },
    hp: 10,
    skills: (servant.skills || []).map((row) => row.name),
    npName: servant.npName,
  }));
  return state;
}

function sceneChoices(scene, state) {
  const raw = typeof scene.choices === 'function' ? scene.choices(state) : scene.choices;
  return Array.isArray(raw) ? raw : [];
}

function chooseByLabel(sceneKey, label, state) {
  const scene = SCENES[sceneKey];
  if (!scene) throw new Error(`scene not found: ${sceneKey}`);
  const choice = sceneChoices(scene, state).find((c) => c.label === label);
  if (!choice) throw new Error(`choice not found: ${sceneKey} -> ${label}`);
  return choice;
}

function runOne(actionLabel) {
  const state = cloneState();

  const actionChoice = chooseByLabel('dayAction', actionLabel, state);
  actionChoice.effect?.(state);

  // D-1 focuses on random-event distribution; force random branch deterministically.
  if (state.dayActionPlan) state.dayActionPlan.nextMode = 'random';

  const resolveChoice = chooseByLabel('dayEncounterCheck', '行動を確定する', state);
  const next = typeof resolveChoice.next === 'function' ? resolveChoice.next(state) : resolveChoice.next;

  if (next !== 'dayRandomEvent') {
    return { ok: false, reason: `unexpected next scene: ${next}`, category: null };
  }

  const category = state.dayEvent?.category || null;
  if (!category) {
    return { ok: false, reason: 'missing dayEvent.category', category: null };
  }
  return { ok: true, reason: null, category };
}

function pct(v, total) {
  return Number(((v / total) * 100).toFixed(2));
}

function main() {
  const globalCounts = { common: 0, playerServant: 0, masterBuild: 0, enemyServant: 0 };
  const perAction = {};
  let failed = 0;

  for (const action of ACTIONS) {
    const counts = { common: 0, playerServant: 0, masterBuild: 0, enemyServant: 0 };
    const failures = [];

    for (let i = 0; i < RUNS_PER_ACTION; i += 1) {
      const result = runOne(action.sceneLabel);
      if (!result.ok) {
        failed += 1;
        failures.push(result.reason);
        continue;
      }
      counts[result.category] = (counts[result.category] || 0) + 1;
      globalCounts[result.category] = (globalCounts[result.category] || 0) + 1;
    }

    perAction[action.key] = {
      total: RUNS_PER_ACTION,
      counts,
      rates: {
        common: pct(counts.common, RUNS_PER_ACTION),
        playerServant: pct(counts.playerServant, RUNS_PER_ACTION),
        masterBuild: pct(counts.masterBuild, RUNS_PER_ACTION),
        enemyServant: pct(counts.enemyServant, RUNS_PER_ACTION),
      },
      failureCount: failures.length,
      failureSample: failures.slice(0, 3),
    };
  }

  const totalRuns = RUNS_PER_ACTION * ACTIONS.length;
  const globalRates = {
    common: pct(globalCounts.common, totalRuns),
    playerServant: pct(globalCounts.playerServant, totalRuns),
    masterBuild: pct(globalCounts.masterBuild, totalRuns),
    enemyServant: pct(globalCounts.enemyServant, totalRuns),
  };

  console.log(`Day-event simulation summary (runs/action=${RUNS_PER_ACTION}, total=${totalRuns})`);
  console.log('Per-action distribution:', JSON.stringify(perAction, null, 2));
  console.log('Global distribution:', { counts: globalCounts, rates: globalRates, failureCount: failed });

  const orderOk = globalCounts.common > globalCounts.playerServant
    && globalCounts.playerServant > globalCounts.masterBuild
    && globalCounts.masterBuild > globalCounts.enemyServant;

  if (failed !== 0) {
    throw new Error(`抽選失敗が発生しました: ${failed}`);
  }
  if (!orderOk) {
    throw new Error(`カテゴリ比率が要件を満たしません: ${JSON.stringify(globalCounts)}`);
  }
}

main();
