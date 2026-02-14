import { INITIAL_STATE } from '../src/scenario.js';

const CATALYSTS = ['聖剣の残滓', '古びた外套の切れ端', '異国の魔導書断片', '朽ちた城門の礫'];
const BUILDS = ['血統型', '現場型', '研究型'];
const RUNS = 1000;

function cloneState(buildType) {
  const state = structuredClone(INITIAL_STATE);
  state.master.buildType = buildType;
  return state;
}

function chooseFromWeights(weights) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  let roll = Math.random() * total;
  for (const [k, v] of Object.entries(weights)) {
    roll -= v;
    if (roll <= 0) return k;
  }
  return Object.keys(weights)[0];
}

function toClassKey(className) {
  const map = {
    セイバー: 'saber',
    アーチャー: 'archer',
    ランサー: 'lancer',
    ライダー: 'rider',
    キャスター: 'caster',
    アサシン: 'assassin',
    バーサーカー: 'berserker',
  };
  return map[className] || 'saber';
}

function runOne(state, catalystName) {
  const options = state.summon.debugWeights;
  const totals = Object.fromEntries(options.map((o) => [o.trueName, o.total]));
  return chooseFromWeights(totals);
}

async function main() {
  // Import lazily to avoid circular eval timing issues in some runtimes
  const scenario = await import('../src/scenario.js');

  const pickCatalyst = (state, catalystName) => {
    state.summon.catalyst = catalystName;
    const picked = scenario.__internal?.summonServantForTest
      ? scenario.__internal.summonServantForTest(state, catalystName)
      : null;
    if (picked) {
      state.summon.debugWeights = picked.debugWeights || [];
      state.servant.className = picked.className;
      state.servant.sourceName = picked.trueName;
      return;
    }

    // fallback: run through real scene effect path
    const choice = scenario.SCENES.catalystSelect.choices.find((c) => c.label.includes(catalystName));
    if (!choice) throw new Error(`choice not found: ${catalystName}`);
    choice.effect(state);
  };

  const report = {};

  for (const buildType of BUILDS) {
    report[buildType] = {};
    for (const catalyst of CATALYSTS) {
      const counts = {};
      const classMatch = { match: 0, total: 0 };

      for (let i = 0; i < RUNS; i += 1) {
        const state = cloneState(buildType);
        pickCatalyst(state, catalyst);

        const selectedName = state.servant.sourceName || runOne(state, catalyst);
        counts[selectedName] = (counts[selectedName] || 0) + 1;

        const top = state.summon.debugWeights?.[0];
        if (top) {
          const topClassKey = toClassKey(top.className);
          const weights = {
            saber: catalyst === '聖剣の残滓' ? 4 : catalyst === '朽ちた城門の礫' ? 2 : 1,
            archer: catalyst === '聖剣の残滓' ? 1 : catalyst === '異国の魔導書断片' ? 1 : catalyst === '朽ちた城門の礫' ? 2 : 1,
            lancer: catalyst === '聖剣の残滓' ? 1 : catalyst === '古びた外套の切れ端' ? 1 : catalyst === '朽ちた城門の礫' ? 1 : 1,
            rider: catalyst === '古びた外套の切れ端' ? 4 : 1,
            caster: catalyst === '異国の魔導書断片' ? 4 : 1,
            assassin: catalyst === '古びた外套の切れ端' ? 1 : 1,
            berserker: catalyst === '異国の魔導書断片' ? 1 : catalyst === '朽ちた城門の礫' ? 2 : 1,
          };
          const strongest = Object.entries(weights).sort((a, b) => b[1] - a[1])[0][0];
          classMatch.total += 1;
          if (topClassKey === strongest) classMatch.match += 1;
        }
      }

      const ordered = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      report[buildType][catalyst] = {
        top3: ordered,
        catalystLeadRate: Number((classMatch.match / Math.max(1, classMatch.total)).toFixed(3)),
      };
    }
  }

  console.log('Summon distribution summary (runs=', RUNS, ')');
  for (const buildType of BUILDS) {
    console.log(`\n[${buildType}]`);
    for (const catalyst of CATALYSTS) {
      const row = report[buildType][catalyst];
      console.log(catalyst, row);
      if (row.catalystLeadRate < 0.45) {
        throw new Error(`触媒主導率が低すぎます: ${buildType} / ${catalyst} = ${row.catalystLeadRate}`);
      }
    }
  }
}

main();
