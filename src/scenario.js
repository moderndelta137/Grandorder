const MASTER_BUILDS = {
  血統型: { 魔力: 2, 交渉: -1, 生存: 0, 情報: 0 },
  現場型: { 魔力: -1, 交渉: 0, 生存: 2, 情報: 0 },
  研究型: { 魔力: 0, 交渉: 0, 生存: -1, 情報: 2 },
};

const CATALYSTS = {
  聖剣の残滓: { saber: 4, lancer: 1, archer: 1 },
  古びた外套の切れ端: { rider: 4, assassin: 1, lancer: 1 },
  異国の魔導書断片: { caster: 4, archer: 1, berserker: 1 },
  朽ちた城門の礫: { archer: 2, saber: 2, berserker: 2, lancer: 1 },
};

const FSN_SERVANTS = [
  { trueName: "アルトリア・ペンドラゴン", className: "セイバー", altClasses: ["ランサー"], stats: { 筋力: 4, 耐久: 4, 敏捷: 4, 魔力: 4, 幸運: 3, 宝具: 5 } },
  { trueName: "エミヤ", className: "アーチャー", altClasses: ["キャスター"], stats: { 筋力: 3, 耐久: 3, 敏捷: 4, 魔力: 4, 幸運: 3, 宝具: 4 } },
  { trueName: "クー・フーリン", className: "ランサー", altClasses: ["バーサーカー"], stats: { 筋力: 4, 耐久: 3, 敏捷: 5, 魔力: 3, 幸運: 4, 宝具: 4 } },
  { trueName: "メドゥーサ", className: "ライダー", altClasses: ["アサシン"], stats: { 筋力: 3, 耐久: 3, 敏捷: 5, 魔力: 3, 幸運: 4, 宝具: 4 } },
  { trueName: "メディア", className: "キャスター", altClasses: ["アサシン"], stats: { 筋力: 1, 耐久: 2, 敏捷: 3, 魔力: 5, 幸運: 4, 宝具: 4 } },
  { trueName: "佐々木小次郎", className: "アサシン", altClasses: ["セイバー"], stats: { 筋力: 3, 耐久: 3, 敏捷: 5, 魔力: 1, 幸運: 2, 宝具: 3 } },
  { trueName: "ヘラクレス", className: "バーサーカー", altClasses: ["アーチャー"], stats: { 筋力: 5, 耐久: 5, 敏捷: 3, 魔力: 2, 幸運: 2, 宝具: 5 } },
];

export const INITIAL_STATE = {
  day: 1,
  phase: "導入",
  master: { name: "名無しの魔術師", hp: 100, mana: 100, buildType: null, commandSpells: 3 },
  servant: {
    className: "未契約",
    trueName: "？？？",
    trueNameRevealed: false,
    params: { 筋力: 0, 耐久: 0, 敏捷: 0, 魔力: 0, 幸運: 0, 宝具: 0 },
    sourceName: null,
    npUsedThisBattle: false,
  },
  summon: { catalyst: null, classShifted: false },
  battle: { lastResult: "none", tacticalAdvantage: 0, currentEnemyId: null },
  progress: { enemiesDefeated: 0, finalUnlocked: false },
  flags: { trueNameExposure: 0, rescueUsed: false, endingType: null },
  factions: [],
  log: ["召喚準備を開始した。"],
};

export const SCENES = {
  title: {
    phase: "導入",
    title: "召喚の前夜",
    text: "冬の深夜。工房の灯りだけが揺れている。\nあなたは聖杯戦争に挑むマスターとして、召喚儀式を開始する。",
    choices: [{ label: "主人公ビルドを決める", next: "buildSelect" }],
  },
  buildSelect: {
    phase: "導入",
    title: "魔術師としての基盤",
    text: "自分の戦い方を定める。これは以後の判定補正に影響する。",
    choices: [
      { label: "血統型（魔力高）", effect: (s) => applyMasterBuild(s, "血統型"), next: "catalystSelect" },
      { label: "現場型（生存高）", effect: (s) => applyMasterBuild(s, "現場型"), next: "catalystSelect" },
      { label: "研究型（情報高）", effect: (s) => applyMasterBuild(s, "研究型"), next: "catalystSelect" },
    ],
  },
  catalystSelect: {
    phase: "召喚",
    title: "触媒の選択",
    text: "触媒を選び、英霊召喚を実行する。触媒と資質で召喚結果が変化する。",
    choices: [
      { label: "聖剣の残滓を使用する", effect: (s) => pickCatalyst(s, "聖剣の残滓"), next: "summonResult" },
      { label: "古びた外套の切れ端を使用する", effect: (s) => pickCatalyst(s, "古びた外套の切れ端"), next: "summonResult" },
      { label: "異国の魔導書断片を使用する", effect: (s) => pickCatalyst(s, "異国の魔導書断片"), next: "summonResult" },
      { label: "朽ちた城門の礫を使用する", effect: (s) => pickCatalyst(s, "朽ちた城門の礫"), next: "summonResult" },
    ],
  },
  summonResult: {
    phase: "召喚",
    title: "契約成立",
    text: (s) => {
      const shifted = s.summon.classShifted ? "（原典と異なるクラスで現界）" : "（原典準拠クラスで現界）";
      return `令呪が刻まれ、サーヴァントが応じる。\nクラス: ${s.servant.className} ${shifted}\n真名: ？？？\n\n他陣営6組の反応も確認。戦争は既に始まっている。`;
    },
    choices: [{ label: "昼フェーズへ", next: "dayAction" }],
  },
  dayAction: {
    phase: "昼",
    title: "日中行動",
    text: (s) =>
      `Day ${s.day}。行動を選択する。\n残存敵陣営: ${remainingEnemies(s)}組 / 真名看破進行: ${s.flags.trueNameExposure}/3`,
    choices: [
      {
        label: "情報収集（真名看破を進める）",
        effect: (s) => {
          const intel = MASTER_BUILDS[s.master.buildType]?.情報 ?? 0;
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1 + (intel > 0 ? 1 : 0));
          s.master.mana = Math.min(100, s.master.mana + 6);
          s.battle.tacticalAdvantage = 1;
          s.log.push("日中の情報網を展開。敵の行動パターンを把握した。");
        },
        next: "nightBattle",
      },
      {
        label: "工房整備（魔力回復）",
        effect: (s) => {
          s.master.mana = Math.min(100, s.master.mana + 18);
          s.battle.tacticalAdvantage = 0;
          s.log.push("工房を整備し魔力を回復。戦闘準備を優先した。");
        },
        next: "nightBattle",
      },
      {
        label: "先制配置（夜戦補正）",
        effect: (s) => {
          s.master.mana = Math.max(0, s.master.mana - 8);
          s.battle.tacticalAdvantage = 2;
          s.log.push("先制陣地を構築。夜戦に有利な位置を確保した。");
        },
        next: "nightBattle",
      },
    ],
  },
  nightBattle: {
    phase: "夜",
    title: "夜戦フェーズ",
    text: (s) => {
      const enemy = getCurrentEnemy(s);
      return `敵陣営と接敵。対象クラス: ${enemy?.className ?? "不明"}\n令呪: ${s.master.commandSpells}画 / 魔力: ${s.master.mana}\n※宝具は1戦闘1回`;
    },
    choices: [
      { label: "通常攻撃", effect: (s) => resolveBattle(s, "normal"), next: (s) => postBattleScene(s) },
      { label: "宝具解放", effect: (s) => resolveBattle(s, "np"), next: (s) => postBattleScene(s) },
      { label: "令呪で強制突破", effect: (s) => resolveBattle(s, "command_assault"), next: (s) => postBattleScene(s) },
      { label: "令呪で緊急離脱", effect: (s) => resolveBattle(s, "command_escape"), next: (s) => postBattleScene(s) },
      { label: "撤退", effect: (s) => resolveBattle(s, "retreat"), next: (s) => postBattleScene(s) },
    ],
  },
  rescue: {
    phase: "深夜",
    title: "救済導線発動",
    text: "壊滅寸前の局面で、契約維持のための緊急処置を実行。\n代償として霊脈支配権を失い、以降の判定に不利が残る。",
    choices: [
      {
        label: "代償を受け入れて継戦する",
        effect: (s) => {
          s.master.hp = Math.max(20, s.master.hp);
          s.servant.params.耐久 = Math.max(1, s.servant.params.耐久 - 1);
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("救済導線を発動。耐久低下と看破進行を受諾。",);
          nextDay(s);
        },
        next: (s) => (s.progress.finalUnlocked ? "finalBattle" : "dayAction"),
      },
    ],
  },
  finalBattle: {
    phase: "最終夜",
    title: "聖杯到達戦",
    text: (s) =>
      `残る敵陣営は僅少。ここで勝てば聖杯へ到達する。\n真名秘匿: ${s.servant.trueNameRevealed ? "露見" : "維持"} / 令呪: ${s.master.commandSpells}画`,
    choices: [
      { label: "総力戦（通常）", effect: (s) => resolveBattle(s, "final_normal"), next: "endingJudge" },
      { label: "宝具決戦", effect: (s) => resolveBattle(s, "final_np"), next: "endingJudge" },
      { label: "令呪で勝利を確定", effect: (s) => resolveBattle(s, "final_command"), next: "endingJudge" },
    ],
  },
  endingJudge: {
    phase: "結末",
    title: "聖杯の審判",
    text: (s) => {
      decideEnding(s);
      if (s.flags.endingType === "正統勝利") return "あなたは代償を最小限に抑え、聖杯に到達した。正統勝利。";
      if (s.flags.endingType === "代償勝利") return "勝利は掴んだ。だが、救済の代償と露見した情報は未来に禍根を残す。";
      if (s.flags.endingType === "救済生還") return "聖杯には届かなかったが、生き延びた。次の戦いに備える救済生還。";
      return "契約は潰え、すべては夜に沈んだ。破滅エンド。";
    },
    choices: [{ label: "もう一度挑む", next: "title" }],
  },
  gameOver: {
    phase: "敗北",
    title: "マスター死亡",
    text: "魔力回路が断たれ、契約は霧散する。救済導線も既に使い切っていた。",
    choices: [{ label: "タイトルへ戻る", next: "title" }],
  },
  sprint1Complete: {
    phase: "進捗",
    title: "Sprint 1 到達点",
    text: "Sprint 1 の到達条件（召喚〜契約導入）が完了。\n次はSprint 2で判定エンジン強化と夜戦ループを実装する。",
    choices: [{ label: "最初から確認し直す", next: "title" }],
  },
};

function applyMasterBuild(state, buildType) {
  state.master.buildType = buildType;
  state.log.push(`主人公ビルドを ${buildType} に確定。`);
}

function pickCatalyst(state, catalystName) {
  state.summon.catalyst = catalystName;
  const picked = summonServant(catalystName, state.master.buildType);

  state.summon.classShifted = picked.classShifted;
  state.servant.className = picked.className;
  state.servant.trueName = "？？？";
  state.servant.trueNameRevealed = false;
  state.servant.params = picked.stats;
  state.servant.sourceName = picked.trueName;

  state.factions = FSN_SERVANTS.filter((s) => s.trueName !== picked.trueName).map((s, idx) => ({
    id: idx + 1,
    trueName: s.trueName,
    className: s.className,
    hp: 100,
    alive: true,
  }));

  state.log.push(`触媒「${catalystName}」で ${state.servant.className} を召喚。敵6陣営を確認。`);
}

function summonServant(catalystName, buildType) {
  const weights = CATALYSTS[catalystName] || {};
  const scored = FSN_SERVANTS.map((s) => {
    const classKey = toClassKey(s.className);
    const buildBonus = buildType === "血統型" && s.stats.魔力 >= 4 ? 1 : 0;
    return { servant: s, score: (weights[classKey] || 1) + buildBonus + Math.random() * 1.2 };
  }).sort((a, b) => b.score - a.score);

  const picked = structuredClone(scored[0].servant);
  const classShifted = Math.random() < 0.35;
  if (classShifted && picked.altClasses.length > 0) picked.className = picked.altClasses[0];
  picked.classShifted = classShifted;
  return picked;
}

function resolveBattle(state, action) {
  const enemy = getCurrentEnemy(state);
  if (!enemy) {
    state.progress.finalUnlocked = true;
    state.log.push("全敵陣営が排除済み。最終局面へ。",);
    return;
  }

  const result = runCheck(state, enemy, action);
  if (result.win) {
    enemy.hp -= result.damage;
    state.log.push(`${enemy.className} へ ${result.damage} ダメージ。`);
    if (enemy.hp <= 0) {
      enemy.alive = false;
      state.progress.enemiesDefeated += 1;
      state.log.push(`敵陣営を撃破（${state.progress.enemiesDefeated}/6）。`);
    }
  } else {
    state.master.hp -= result.backlashMaster;
    state.master.mana = Math.max(0, state.master.mana - result.backlashMana);
    state.log.push(`反撃で被害。マスターHP -${result.backlashMaster}。`);
  }

  if (action.includes("np")) {
    state.flags.trueNameExposure = Math.min(3, state.flags.trueNameExposure + 1);
    state.servant.npUsedThisBattle = true;
    if (state.flags.trueNameExposure >= 3) {
      state.servant.trueNameRevealed = true;
      state.log.push("真名看破が確定。以後は秘匿優位を失う。",);
    }
  }

  if (action.startsWith("command") || action === "final_command") {
    state.master.commandSpells = Math.max(0, state.master.commandSpells - 1);
  }

  if (action === "command_escape") {
    state.log.push("令呪で強制離脱。敵撃破はできなかった。",);
  }

  state.master.mana = Math.max(0, state.master.mana - result.manaCost);

  if (state.progress.enemiesDefeated >= 3) state.progress.finalUnlocked = true;

  if (state.master.hp <= 0 && !state.flags.rescueUsed) {
    state.flags.rescueUsed = true;
  }

  if (state.master.hp > 0) nextDay(state);
}

function runCheck(state, enemy, action) {
  const build = MASTER_BUILDS[state.master.buildType] || { 生存: 0, 情報: 0, 魔力: 0 };
  const base = state.servant.params.筋力 + state.servant.params.敏捷 + state.servant.params.耐久;
  const enemyPower = classPower(enemy.className) + randomInt(1, 6) + (state.servant.trueNameRevealed ? 2 : 0);

  let bonus = state.battle.tacticalAdvantage + (build.生存 || 0);
  let manaCost = 8;
  let damage = 35;

  if (action === "retreat") {
    const retreatSuccess = base + randomInt(1, 6) + bonus >= enemyPower;
    if (retreatSuccess) {
      return { win: true, damage: 0, manaCost: 4, backlashMaster: 0, backlashMana: 0 };
    }
    return { win: false, damage: 0, manaCost: 5, backlashMaster: 14, backlashMana: 10 };
  }

  if (action.includes("np")) {
    bonus += state.servant.params.宝具 + 2;
    damage = 60;
    manaCost = 20;
  }

  if (action.includes("command")) {
    if (state.master.commandSpells <= 0) {
      state.log.push("令呪が尽きている。通常行動として処理。",);
    } else {
      bonus += 4;
      damage = 75;
      manaCost = 12;
    }
  }

  const myPower = base + bonus + randomInt(1, 6);
  const win = myPower >= enemyPower;

  if (action.startsWith("final")) {
    damage += 10;
  }

  if (win) return { win: true, damage, manaCost, backlashMaster: 0, backlashMana: 0 };
  return { win: false, damage: 0, manaCost, backlashMaster: randomInt(12, 22), backlashMana: randomInt(8, 16) };
}

function postBattleScene(state) {
  if (state.master.hp <= 0) {
    if (state.flags.rescueUsed) return "rescue";
    return "gameOver";
  }
  if (state.progress.finalUnlocked) return "finalBattle";
  return "dayAction";
}

function decideEnding(state) {
  const alive = state.master.hp > 0;
  const score =
    (alive ? 1 : 0) +
    (state.progress.enemiesDefeated >= 4 ? 1 : 0) +
    (!state.servant.trueNameRevealed ? 1 : 0) +
    (state.master.commandSpells >= 1 ? 1 : 0) +
    (!state.flags.rescueUsed ? 1 : 0);

  if (score >= 4) state.flags.endingType = "正統勝利";
  else if (score >= 3) state.flags.endingType = "代償勝利";
  else if (alive) state.flags.endingType = "救済生還";
  else state.flags.endingType = "破滅";
}

function getCurrentEnemy(state) {
  if (state.battle.currentEnemyId) {
    const current = state.factions.find((f) => f.id === state.battle.currentEnemyId && f.alive);
    if (current) return current;
  }
  const alive = state.factions.filter((f) => f.alive);
  if (!alive.length) return null;
  const pick = alive[Math.floor(Math.random() * alive.length)];
  state.battle.currentEnemyId = pick.id;
  return pick;
}

function nextDay(state) {
  state.day += 1;
  state.battle.currentEnemyId = null;
  state.battle.tacticalAdvantage = 0;
  state.servant.npUsedThisBattle = false;
  state.master.mana = Math.min(100, state.master.mana + 4);
}

function remainingEnemies(state) {
  return state.factions.filter((f) => f.alive).length;
}

function classPower(className) {
  const map = { セイバー: 13, アーチャー: 12, ランサー: 12, ライダー: 11, キャスター: 11, アサシン: 10, バーサーカー: 14 };
  return map[className] || 11;
}

function toClassKey(className) {
  const map = {
    セイバー: "saber",
    アーチャー: "archer",
    ランサー: "lancer",
    ライダー: "rider",
    キャスター: "caster",
    アサシン: "assassin",
    バーサーカー: "berserker",
  };
  return map[className] || "saber";
}

function simulateSkirmish(state) {
  const build = MASTER_BUILDS[state.master.buildType] || {};
  const base = state.servant.params.筋力 + state.servant.params.敏捷 + (build.生存 || 0);
  const enemy = 7 + Math.floor(Math.random() * 6);
  const power = base + Math.floor(Math.random() * 6);

  if (power >= enemy) {
    state.day += 1;
    state.master.mana = Math.max(0, state.master.mana - 10);
    state.log.push(`小競り合い勝利（${power} vs ${enemy}）。`);
    return;
  }

  state.master.hp = Math.max(1, state.master.hp - 18);
  state.master.mana = Math.max(0, state.master.mana - 16);
  state.log.push(`小競り合い敗北（${power} vs ${enemy}）。撤退。`);
}
