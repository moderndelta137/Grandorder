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
  {
    trueName: "アルトリア・ペンドラゴン",
    className: "セイバー",
    altClasses: ["ランサー"],
    stats: { 筋力: 4, 耐久: 4, 敏捷: 4, 魔力: 4, 幸運: 3, 宝具: 5 },
  },
  {
    trueName: "エミヤ",
    className: "アーチャー",
    altClasses: ["キャスター"],
    stats: { 筋力: 3, 耐久: 3, 敏捷: 4, 魔力: 4, 幸運: 3, 宝具: 4 },
  },
  {
    trueName: "クー・フーリン",
    className: "ランサー",
    altClasses: ["バーサーカー"],
    stats: { 筋力: 4, 耐久: 3, 敏捷: 5, 魔力: 3, 幸運: 4, 宝具: 4 },
  },
  {
    trueName: "メドゥーサ",
    className: "ライダー",
    altClasses: ["アサシン"],
    stats: { 筋力: 3, 耐久: 3, 敏捷: 5, 魔力: 3, 幸運: 4, 宝具: 4 },
  },
  {
    trueName: "メディア",
    className: "キャスター",
    altClasses: ["アサシン"],
    stats: { 筋力: 1, 耐久: 2, 敏捷: 3, 魔力: 5, 幸運: 4, 宝具: 4 },
  },
  {
    trueName: "佐々木小次郎",
    className: "アサシン",
    altClasses: ["セイバー"],
    stats: { 筋力: 3, 耐久: 3, 敏捷: 5, 魔力: 1, 幸運: 2, 宝具: 3 },
  },
  {
    trueName: "ヘラクレス",
    className: "バーサーカー",
    altClasses: ["アーチャー"],
    stats: { 筋力: 5, 耐久: 5, 敏捷: 3, 魔力: 2, 幸運: 2, 宝具: 5 },
  },
];

export const INITIAL_STATE = {
  day: 1,
  phase: "導入",
  master: {
    name: "名無しの魔術師",
    hp: 100,
    mana: 100,
    buildType: null,
    commandSpells: 3,
  },
  servant: {
    className: "未契約",
    trueName: "？？？",
    trueNameRevealed: false,
    params: { 筋力: 0, 耐久: 0, 敏捷: 0, 魔力: 0, 幸運: 0, 宝具: 0 },
  },
  summon: {
    catalyst: null,
    sourceServant: null,
    classShifted: false,
  },
  flags: {
    trueNameExposure: 0,
    rescueUsed: false,
  },
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
      {
        label: "血統型（魔力高）",
        effect: (state) => applyMasterBuild(state, "血統型"),
        next: "catalystSelect",
      },
      {
        label: "現場型（生存高）",
        effect: (state) => applyMasterBuild(state, "現場型"),
        next: "catalystSelect",
      },
      {
        label: "研究型（情報高）",
        effect: (state) => applyMasterBuild(state, "研究型"),
        next: "catalystSelect",
      },
    ],
  },
  catalystSelect: {
    phase: "召喚",
    title: "触媒の選択",
    text: "触媒を選び、英霊召喚を実行する。触媒と資質で召喚結果が変化する。",
    choices: [
      {
        label: "聖剣の残滓を使用する",
        effect: (state) => pickCatalyst(state, "聖剣の残滓"),
        next: "summonResult",
      },
      {
        label: "古びた外套の切れ端を使用する",
        effect: (state) => pickCatalyst(state, "古びた外套の切れ端"),
        next: "summonResult",
      },
      {
        label: "異国の魔導書断片を使用する",
        effect: (state) => pickCatalyst(state, "異国の魔導書断片"),
        next: "summonResult",
      },
      {
        label: "朽ちた城門の礫を使用する",
        effect: (state) => pickCatalyst(state, "朽ちた城門の礫"),
        next: "summonResult",
      },
    ],
  },
  summonResult: {
    phase: "召喚",
    title: "契約成立",
    text: (state) => {
      const source = state.summon.sourceServant;
      const classLabel = state.servant.className;
      const shifted = state.summon.classShifted
        ? "（原典と異なるクラスで現界）"
        : "（原典準拠クラスで現界）";
      return `令呪が刻まれ、サーヴァントが応じる。\nクラス: ${classLabel} ${shifted}\n真名: ？？？\n\n※内部設定: ${source} を召喚済み。`;
    },
    choices: [
      {
        label: "契約を受諾し、第一夜へ進む",
        effect: (state) => state.log.push("主従契約を締結。第一夜に向けて出撃準備。"),
        next: "firstNight",
      },
    ],
  },
  firstNight: {
    phase: "第一夜",
    title: "接敵前偵察",
    text: (state) =>
      `敵性反応を感知。魔力流は不安定だが、戦闘は回避可能ではない。\n現在クラス: ${state.servant.className} / 令呪残数: ${state.master.commandSpells}`,
    choices: [
      {
        label: "慎重に撤退し、情報を優先する",
        effect: (state) => {
          state.day += 1;
          state.master.mana = Math.min(100, state.master.mana + 8);
          state.log.push("撤退成功。情報優位を確保。次夜へ。",);
        },
        next: "sprint1Complete",
      },
      {
        label: "短時間で交戦し、戦力を測る",
        effect: (state) => simulateSkirmish(state),
        next: "sprint1Complete",
      },
    ],
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
  const servant = summonServant(catalystName, state.master.buildType);

  state.summon.sourceServant = servant.trueName;
  state.summon.classShifted = servant.classShifted;

  state.servant.className = servant.className;
  state.servant.trueName = "？？？";
  state.servant.trueNameRevealed = false;
  state.servant.params = servant.stats;

  state.log.push(`触媒「${catalystName}」を使用。${state.servant.className} が現界。`);
}

function summonServant(catalystName, buildType) {
  const weights = CATALYSTS[catalystName] || {};
  const scored = FSN_SERVANTS.map((s) => {
    const classKey = toClassKey(s.className);
    const buildBonus = buildType === "血統型" && s.stats.魔力 >= 4 ? 1 : 0;
    return {
      servant: s,
      score: (weights[classKey] || 1) + buildBonus + Math.random() * 1.2,
    };
  }).sort((a, b) => b.score - a.score);

  const picked = structuredClone(scored[0].servant);
  const classShifted = Math.random() < 0.35;
  if (classShifted && picked.altClasses.length > 0) {
    picked.className = picked.altClasses[0];
  }
  picked.classShifted = classShifted;
  return picked;
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
