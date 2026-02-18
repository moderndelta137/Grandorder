import { INITIAL_STATE, SCENES } from '../src/scenario.js';

const SAVE_VERSION = 1;

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function cloneInitial() {
  return structuredClone(INITIAL_STATE);
}

function loadPayloadLikeGame(parsed) {
  if (parsed.version !== SAVE_VERSION) return { ok: false, reason: 'version_mismatch' };

  const state = cloneInitial();
  Object.assign(state, structuredClone(parsed.state || {}));
  state.flags = state.flags || {};
  state.flags.readScenes = state.flags.readScenes || {};

  return {
    ok: true,
    sceneId: parsed.sceneId || 'title',
    readSkipMode: parsed.readSkipMode || 'off',
    state,
  };
}

function checkCurrentRoundTrip() {
  const payload = {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    sceneId: 'dayRandomEventResult',
    readSkipMode: 'fast',
    state: cloneInitial(),
  };

  const serialized = JSON.stringify(payload);
  const parsed = JSON.parse(serialized);
  const loaded = loadPayloadLikeGame(parsed);

  assert(loaded.ok, '現行セーブデータが読込失敗した');
  assert(loaded.sceneId === 'dayRandomEventResult', `sceneId復元不正: ${loaded.sceneId}`);
  assert(loaded.readSkipMode === 'fast', `readSkipMode復元不正: ${loaded.readSkipMode}`);
  assert(typeof loaded.state.dayEvent?.deltaSummary !== 'undefined', 'dayEvent.deltaSummary が欠落');
  assert(typeof loaded.state.flags.readScenes === 'object', 'flags.readScenes が初期化されない');
}

function checkBackwardCompatibilityForOlderPayload() {
  const olderState = cloneInitial();
  // emulate pre-C-2 save shape
  delete olderState.dayEvent.deltaSummary;
  delete olderState.flags.readScenes;

  const payload = {
    version: SAVE_VERSION,
    sceneId: 'dayRandomEventResult',
    readSkipMode: undefined,
    state: olderState,
  };

  const loaded = loadPayloadLikeGame(payload);
  assert(loaded.ok, '旧形状セーブデータの読込が失敗した');
  assert(loaded.readSkipMode === 'off', `旧形状readSkipModeフォールバック不正: ${loaded.readSkipMode}`);
  assert(typeof loaded.state.flags.readScenes === 'object', '旧形状でflags.readScenes補完失敗');

  // must not throw even if deltaSummary is absent
  const resultText = SCENES.dayRandomEventResult.text(loaded.state);
  assert(typeof resultText === 'string' && resultText.length > 0, '旧形状でdayRandomEventResult描画失敗');
}

function checkVersionMismatchRejected() {
  const payload = {
    version: SAVE_VERSION + 1,
    sceneId: 'title',
    state: cloneInitial(),
  };

  const loaded = loadPayloadLikeGame(payload);
  assert(!loaded.ok && loaded.reason === 'version_mismatch', '互換外versionが拒否されない');
}

checkCurrentRoundTrip();
checkBackwardCompatibilityForOlderPayload();
checkVersionMismatchRejected();

if (errors.length) {
  console.error('Sprint4 D-2 check failed:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Sprint4 D-2 check passed.');
console.log('- 現行セーブJSON round-trip: OK');
console.log('- 旧形状（deltaSummary/readScenes欠落）読込互換: OK');
console.log('- 互換外version拒否: OK');
