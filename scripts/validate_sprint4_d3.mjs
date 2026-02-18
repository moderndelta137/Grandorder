import { spawnSync } from 'node:child_process';
import { INITIAL_STATE, SCENES } from '../src/scenario.js';

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function cloneState() {
  return structuredClone(INITIAL_STATE);
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
    { type: '正統勝利', state: buildEndingState() },
    {
      type: '代償勝利',
      state: buildEndingState({
        flags: { idealPoints: 1, civilianDamage: 2 },
        master: { commandSpells: 0 },
      }),
    },
    {
      type: '救済生還',
      state: buildEndingState({
        progress: { enemiesDefeated: 2 },
        servant: { trueNameRevealed: true },
        flags: { rescueUsed: true, idealPoints: 0, civilianDamage: 2 },
        master: { commandSpells: 0 },
      }),
    },
    {
      type: '破滅',
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
    assert(typeof text === 'string' && text.length > 0, `エンディング本文が空: ${row.type}`);
  }
}

function checkSprint3BaselineStillPasses() {
  const result = spawnSync(process.execPath, ['scripts/validate_sprint3_d3.mjs'], { encoding: 'utf-8' });
  if (result.status !== 0) {
    errors.push(`Sprint3 D-3 baseline failed:\n${result.stdout}\n${result.stderr}`);
  }
}

checkSprint3BaselineStillPasses();
checkEndingVariants();

if (errors.length) {
  console.error('Sprint4 D-3 check failed:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Sprint4 D-3 check passed.');
console.log('- Sprint3 D-3 baseline regression: OK');
console.log('- 4エンディング出し分け判定: OK');
