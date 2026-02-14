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

const SERVANT_COMBAT_EFFECTS = {
  "アルトリア・ペンドラゴン": {
    passiveLabel: "直感A",
    npLabel: "約束された勝利の剣",
    passive: { bonus: 2, damage: 8 },
    np: { damage: 20 },
  },
  エミヤ: {
    passiveLabel: "千里眼",
    npLabel: "無限の剣製",
    passive: { bonus: 1, enemyPower: -1 },
    np: { bonus: 1, exposureDelta: -1 },
  },
  "クー・フーリン": {
    passiveLabel: "戦闘続行",
    npLabel: "刺し穿つ死棘の槍",
    passive: { lowHpBonus: 3, backlashMaster: -4 },
    np: { bonus: 2 },
  },
  "メドゥーサ": {
    passiveLabel: "騎乗・機動戦",
    npLabel: "騎英の手綱",
    passive: { retreatBonus: 3, manaCost: -1 },
    np: { damage: 10 },
  },
  "メディア": {
    passiveLabel: "高速神言",
    npLabel: "破戒すべき全ての符",
    passive: { manaCost: -3 },
    np: { bonus: 2, damage: 5, exposureDelta: -1 },
  },
  "佐々木小次郎": {
    passiveLabel: "宗和の心得",
    npLabel: "燕返し",
    passive: { enemyPower: -2 },
    np: { bonus: 3 },
  },
  "ヘラクレス": {
    passiveLabel: "狂化・耐久",
    npLabel: "射殺す百頭",
    passive: { bonus: 1, backlashMaster: -6 },
    np: { damage: 15, backlashMaster: -4 },
  },
};

const SERVANT_CHECK_TAG_SKILLS = {
  "アルトリア・ペンドラゴン": [
    { name: "直感A", checkTags: ["先制", "危機察知"], passiveModifiers: { bonus: 2 } },
    { name: "対魔力A", checkTags: ["魔術防御"], passiveModifiers: { enemyPower: -1 } },
  ],
  エミヤ: [
    { name: "千里眼", checkTags: ["情報戦", "先制"], passiveModifiers: { bonus: 1 } },
    { name: "単独行動B", checkTags: ["継戦", "撤退"], passiveModifiers: { retreatBonus: 1 } },
  ],
  "クー・フーリン": [
    { name: "戦闘続行A", checkTags: ["継戦", "近接"], passiveModifiers: { backlashMaster: -3 } },
    { name: "ルーン", checkTags: ["魔術攻撃", "魔術防御"], passiveModifiers: { bonus: 1 } },
  ],
  "メドゥーサ": [
    { name: "騎乗A+", checkTags: ["機動", "撤退"], passiveModifiers: { retreatBonus: 2 } },
    { name: "魔眼", checkTags: ["制圧", "情報戦"], passiveModifiers: { enemyPower: -1 } },
  ],
  "メディア": [
    { name: "高速神言", checkTags: ["魔術攻撃", "宝具"], passiveModifiers: { manaCost: -2 } },
    { name: "陣地作成A", checkTags: ["工房", "継戦"], passiveModifiers: { bonus: 1 } },
  ],
  "佐々木小次郎": [
    { name: "宗和の心得", checkTags: ["近接", "先制"], passiveModifiers: { bonus: 2 } },
    { name: "気配遮断", checkTags: ["奇襲", "撤退"], passiveModifiers: { retreatBonus: 1, enemyPower: -1 } },
  ],
  "ヘラクレス": [
    { name: "狂化B", checkTags: ["近接", "強襲"], passiveModifiers: { bonus: 2, backlashMaster: -2 } },
    { name: "神性A", checkTags: ["継戦", "対魔術"], passiveModifiers: { enemyPower: -1 } },
  ],
};

export const SERVANT_PROFILES = {
  "アルトリア・ペンドラゴン": {
    alignment: "秩序・善",
    classAbilities: [
      { name: "対魔力", rank: "A", desc: "大半の現代魔術を大幅に軽減し、正面衝突に強い。" },
      { name: "騎乗", rank: "B", desc: "移動戦・追撃で安定した戦術展開が可能。" },
    ],
    skills: [
      { name: "直感A", desc: "戦場で最適解を掴み、攻防の判断精度が上がる。" },
      { name: "魔力放出A", desc: "瞬間的に火力を引き上げ、強襲時の決定力を増す。" },
    ],
    noblePhantasm: {
      name: "約束された勝利の剣",
      rank: "A++",
      desc: "高威力の対軍宝具。真名解放は戦局を一変させるが情報露見リスクを伴う。",
    },
  },
  エミヤ: {
    alignment: "中立・中庸",
    classAbilities: [
      { name: "対魔力", rank: "D", desc: "簡易的な魔術妨害に耐性を持つ。" },
      { name: "単独行動", rank: "B", desc: "マスター支援が薄い局面でも行動を継続できる。" },
    ],
    skills: [
      { name: "千里眼", desc: "敵挙動の先読みで被弾リスクを抑える。" },
      { name: "心眼（真）", desc: "不利局面でも勝機を拾う防御的技量。" },
    ],
    noblePhantasm: {
      name: "無限の剣製",
      rank: "E〜A+",
      desc: "投影兵装を展開して継続戦闘能力を高める固有結界型宝具。",
    },
  },
  "クー・フーリン": {
    alignment: "秩序・中庸",
    classAbilities: [
      { name: "対魔力", rank: "C", desc: "近代魔術を受け流しつつ前線維持が可能。" },
      { name: "戦闘続行", rank: "A", desc: "致命傷級でも短時間戦闘継続する粘り強さを持つ。" },
    ],
    skills: [
      { name: "ルーン魔術", desc: "状況に応じて攻守補助を付与する。" },
      { name: "仕切り直し", desc: "不利局面の立て直しに長ける。" },
    ],
    noblePhantasm: {
      name: "刺し穿つ死棘の槍",
      rank: "B",
      desc: "因果逆転の一撃。回避困難で終盤の切り札として機能する。",
    },
  },
  "メドゥーサ": {
    alignment: "混沌・善",
    classAbilities: [
      { name: "対魔力", rank: "B", desc: "高水準の魔術耐性で撤退戦にも強い。" },
      { name: "騎乗", rank: "A+", desc: "機動戦・追撃・離脱を高精度で実行できる。" },
    ],
    skills: [
      { name: "魔眼", desc: "視線制圧で敵の行動を鈍らせる。" },
      { name: "怪力", desc: "近接戦での瞬間火力を強化する。" },
    ],
    noblePhantasm: {
      name: "騎英の手綱",
      rank: "A+",
      desc: "機動力と突破力を兼ね備えた突撃宝具。敵陣を崩す能力が高い。",
    },
  },
  "メディア": {
    alignment: "中立・悪",
    classAbilities: [
      { name: "陣地作成", rank: "A", desc: "工房・神殿化により魔術性能を大幅に底上げする。" },
      { name: "道具作成", rank: "A", desc: "戦術に応じた魔術礼装を素早く用意できる。" },
    ],
    skills: [
      { name: "高速神言", desc: "詠唱短縮で魔力効率を大きく改善する。" },
      { name: "金羊の皮", desc: "限定的な守護術式で被害を緩和する。" },
    ],
    noblePhantasm: {
      name: "破戒すべき全ての符",
      rank: "C",
      desc: "契約・術式を断ち切る対魔術宝具。情報戦にも強く影響する。",
    },
  },
  "佐々木小次郎": {
    alignment: "中立・中庸",
    classAbilities: [
      { name: "気配遮断", rank: "C", desc: "一撃離脱と奇襲展開に適性を持つ。" },
      { name: "宗和の心得", rank: "B", desc: "間合い管理に優れ、対一での安定度が高い。" },
    ],
    skills: [
      { name: "心眼（偽）", desc: "経験則に基づく読みで敵の意図を外す。" },
      { name: "透化", desc: "短時間の気配希薄化で初動を取りやすい。" },
    ],
    noblePhantasm: {
      name: "燕返し",
      rank: "C",
      desc: "同時三連斬撃。近接域で高い決定力を持つ。",
    },
  },
  "ヘラクレス": {
    alignment: "混沌・狂",
    classAbilities: [
      { name: "狂化", rank: "B", desc: "理性と引き換えに圧倒的身体能力を獲得する。" },
      { name: "神性", rank: "A", desc: "神話由来の高い存在強度を有する。" },
    ],
    skills: [
      { name: "勇猛", desc: "威圧を無効化し、攻撃意思を維持する。" },
      { name: "心眼（偽）", desc: "本能的な危機回避により生存力を高める。" },
    ],
    noblePhantasm: {
      name: "射殺す百頭",
      rank: "A",
      desc: "多重攻撃型の対軍宝具。押し切り性能が非常に高い。",
    },
  },
};


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
        label: "情報収集（敵情報を看破）",
        effect: (s) => {
          const intel = MASTER_BUILDS[s.master.buildType]?.情報 ?? 0;
          const intelGain = 1 + (intel > 0 ? 1 : 0);
          collectEnemyIntel(s, intelGain);
          s.master.mana = Math.min(100, s.master.mana + 6);
          s.battle.tacticalAdvantage = 0;
          runNpcFactionPhase(s);
        },
        next: "nightBattle",
      },
      {
        label: "工房整備（魔力回復）",
        effect: (s) => {
          s.master.mana = Math.min(100, s.master.mana + 18);
          s.battle.tacticalAdvantage = 0;
          s.log.push("工房を整備し魔力を回復。戦闘準備を優先した。");
          runNpcFactionPhase(s);
        },
        next: "nightBattle",
      },
      {
        label: "先制配置（夜戦補正）",
        effect: (s) => {
          s.master.mana = Math.max(0, s.master.mana - 8);
          s.battle.tacticalAdvantage = 2;
          s.log.push("先制陣地を構築。夜戦に有利な位置を確保した。");
          runNpcFactionPhase(s);
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

  state.factions = FSN_SERVANTS.filter((s) => s.trueName !== picked.trueName).map((s, idx) => {
    const profile = SERVANT_PROFILES[s.trueName] || {};
    return {
      id: idx + 1,
      trueName: s.trueName,
      className: s.className,
      hp: 100,
      alive: true,
      params: structuredClone(s.stats),
      skills: (profile.skills || []).map((skill) => skill.name),
      classSkills: (profile.classAbilities || []).map((skill) => skill.name),
      npName: profile.noblePhantasm?.name || "不明宝具",
      npType: profile.noblePhantasm?.type || "対軍",
      intel: {
        level: 0,
        seenSkills: [],
        npSeen: false,
      },
    };
  });

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

  let actionForCheck = action;
  if (action.includes("np") && state.servant.npUsedThisBattle) {
    state.log.push("宝具はこの戦闘では既に解放済み。通常攻撃に切り替え。",);
    actionForCheck = action.startsWith("final") ? "final_normal" : "normal";
  }

  const result = runCheck(state, enemy, actionForCheck);
  applyEnemyIntelFromBattle(state, enemy, result);

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

  if (actionForCheck.includes("np")) {
    const exposureDelta = Math.max(0, 1 + (result.exposureDelta || 0));
    state.flags.trueNameExposure = Math.min(3, state.flags.trueNameExposure + exposureDelta);
    state.servant.npUsedThisBattle = true;
    if (state.flags.trueNameExposure >= 3) {
      state.servant.trueNameRevealed = true;
      state.log.push("真名看破が確定。以後は秘匿優位を失う。",);
    }
  }

  if (actionForCheck.startsWith("command") || actionForCheck === "final_command") {
    state.master.commandSpells = Math.max(0, state.master.commandSpells - 1);
  }

  if (actionForCheck === "command_escape") {
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

  const checkTags = getCheckTags(action, enemy);
  const passiveMod = getServantCombatModifier(state, "passive", action);
  const npMod = action.includes("np") ? getServantCombatModifier(state, "np", action) : emptyModifier();
  const tagMod = getCheckTagModifier(state, checkTags);
  const mod = mergeModifiers(mergeModifiers(passiveMod, npMod), tagMod);
  const enemyAction = decideEnemyAction(enemy, action);

  const enemyPower =
    classPower(enemy.className) +
    randomInt(1, 6) +
    (state.servant.trueNameRevealed ? 2 : 0) +
    mod.enemyPower +
    enemyAction.powerBonus;

  let bonus = state.battle.tacticalAdvantage + (build.生存 || 0) + mod.bonus;
  let manaCost = Math.max(1, 8 + mod.manaCost);
  let damage = 35 + mod.damage;

  mod.logs.forEach((entry) => state.log.push(entry));
  if (enemyAction.log) state.log.push(enemyAction.log);

  if (action === "retreat") {
    const retreatSuccess = base + randomInt(1, 6) + bonus + mod.retreatBonus >= enemyPower;
    if (retreatSuccess) {
      return {
        win: true,
        damage: 0,
        manaCost: 4,
        backlashMaster: 0,
        backlashMana: 0,
        exposureDelta: mod.exposureDelta,
        enemyAction,
      };
    }
    return {
      win: false,
      damage: 0,
      manaCost: 5,
      backlashMaster: Math.max(0, 14 + mod.backlashMaster + enemyAction.backlashMaster),
      backlashMana: 10,
      exposureDelta: mod.exposureDelta,
      enemyAction,
    };
  }

  if (action.includes("np")) {
    bonus += state.servant.params.宝具 + 2;
    damage += 25;
    manaCost = Math.max(1, 20 + mod.manaCost);
  }

  if (action.includes("command")) {
    if (state.master.commandSpells <= 0) {
      state.log.push("令呪が尽きている。通常行動として処理。",);
    } else {
      bonus += 4;
      damage += 15;
      manaCost = Math.max(1, 12 + mod.manaCost);
    }
  }

  const myPower = base + bonus + randomInt(1, 6);
  const win = myPower >= enemyPower;

  if (action.startsWith("final")) {
    damage += 10;
  }

  if (win) return { win: true, damage, manaCost, backlashMaster: 0, backlashMana: 0, exposureDelta: mod.exposureDelta, enemyAction };
  return {
    win: false,
    damage: 0,
    manaCost,
    backlashMaster: Math.max(0, randomInt(12, 22) + mod.backlashMaster + enemyAction.backlashMaster),
    backlashMana: randomInt(8, 16),
    exposureDelta: mod.exposureDelta,
    enemyAction,
  };
}

function emptyModifier() {
  return { bonus: 0, damage: 0, manaCost: 0, enemyPower: 0, backlashMaster: 0, retreatBonus: 0, exposureDelta: 0, logs: [] };
}

function mergeModifiers(a, b) {
  return {
    bonus: a.bonus + b.bonus,
    damage: a.damage + b.damage,
    manaCost: a.manaCost + b.manaCost,
    enemyPower: a.enemyPower + b.enemyPower,
    backlashMaster: a.backlashMaster + b.backlashMaster,
    retreatBonus: a.retreatBonus + b.retreatBonus,
    exposureDelta: a.exposureDelta + b.exposureDelta,
    logs: [...a.logs, ...b.logs],
  };
}

function getServantCombatModifier(state, mode, action) {
  const sourceName = state.servant.sourceName;
  const effect = SERVANT_COMBAT_EFFECTS[sourceName];
  if (!effect) return emptyModifier();

  const base = mode === "np" ? effect.np : effect.passive;
  if (!base) return emptyModifier();

  const modifier = {
    bonus: base.bonus || 0,
    damage: base.damage || 0,
    manaCost: base.manaCost || 0,
    enemyPower: base.enemyPower || 0,
    backlashMaster: base.backlashMaster || 0,
    retreatBonus: base.retreatBonus || 0,
    exposureDelta: base.exposureDelta || 0,
    logs: [],
  };

  if (base.lowHpBonus && state.master.hp <= 50) modifier.bonus += base.lowHpBonus;

  if (mode === "passive" && effect.passiveLabel) {
    modifier.logs.push(`固有スキル「${effect.passiveLabel}」が機能。`);
  }
  if (mode === "np" && effect.npLabel && action.includes("np")) {
    modifier.logs.push(`宝具「${effect.npLabel}」を解放。`);
  }

  return modifier;
}


function getCheckTags(action, enemy) {
  const tags = [];

  if (action.includes("np")) tags.push("宝具", "真名解放", "強襲");
  if (action.includes("command")) tags.push("令呪", "強襲");
  if (action === "retreat") tags.push("撤退", "機動");
  if (action.includes("normal")) tags.push("近接");
  if (action.startsWith("final")) tags.push("決戦");

  if (enemy.className === "キャスター") tags.push("魔術防御");
  if (enemy.className === "アサシン") tags.push("危機察知");
  if (enemy.className === "ライダー") tags.push("機動");
  if (enemy.className === "バーサーカー") tags.push("継戦");

  return [...new Set(tags)];
}

function getCheckTagModifier(state, checkTags) {
  const skills = SERVANT_CHECK_TAG_SKILLS[state.servant.sourceName] || [];
  if (!skills.length || !checkTags.length) return emptyModifier();

  const modifier = emptyModifier();

  skills.forEach((skill) => {
    const hit = skill.checkTags?.some((tag) => checkTags.includes(tag));
    if (!hit) return;

    modifier.bonus += skill.passiveModifiers?.bonus || 0;
    modifier.damage += skill.passiveModifiers?.damage || 0;
    modifier.manaCost += skill.passiveModifiers?.manaCost || 0;
    modifier.enemyPower += skill.passiveModifiers?.enemyPower || 0;
    modifier.backlashMaster += skill.passiveModifiers?.backlashMaster || 0;
    modifier.retreatBonus += skill.passiveModifiers?.retreatBonus || 0;
    modifier.exposureDelta += skill.passiveModifiers?.exposureDelta || 0;
    modifier.logs.push(`判定タグ[${checkTags.join("/")}]により「${skill.name}」補正が発動。`);
  });

  return modifier;
}


function collectEnemyIntel(state, points) {
  const candidates = state.factions.filter((f) => f.alive);
  if (!candidates.length) return;

  const minLevel = Math.min(...candidates.map((f) => f.intel?.level ?? 0));
  const pool = candidates.filter((f) => (f.intel?.level ?? 0) === minLevel);
  const target = pool[Math.floor(Math.random() * pool.length)];
  const prev = target.intel.level;
  target.intel.level = Math.min(4, target.intel.level + points);

  state.log.push(`情報収集で敵${target.className}陣営を追跡（看破Lv ${prev} → ${target.intel.level}）。`);

  if (prev < 1 && target.intel.level >= 1) state.log.push("基礎ステータスの一部を把握した。");
  if (prev < 2 && target.intel.level >= 2) state.log.push("保有スキルの一部を把握した。");
  if (prev < 3 && target.intel.level >= 3) state.log.push("真名候補と宝具種別を把握した。");
  if (prev < 4 && target.intel.level >= 4) state.log.push("真名と宝具の核心情報を看破した。");
}

function decideEnemyAction(enemy, playerAction) {
  if (playerAction === "retreat") {
    return { type: "pursuit", powerBonus: 1, backlashMaster: 0, log: `${enemy.className} が追撃態勢を取る。` };
  }

  const roll = Math.random();
  if (roll < 0.18) {
    return {
      type: "np",
      powerBonus: 4,
      backlashMaster: 3,
      npName: enemy.npName,
      log: `${enemy.className} が宝具の兆候を見せる。`,
    };
  }

  if (roll < 0.5) {
    const skillName = enemy.skills?.length ? enemy.skills[Math.floor(Math.random() * enemy.skills.length)] : "戦技";
    return {
      type: "skill",
      powerBonus: 2,
      backlashMaster: 1,
      skillName,
      log: `${enemy.className} がスキルを展開。`,
    };
  }

  return { type: "normal", powerBonus: 0, backlashMaster: 0, log: `${enemy.className} は通常戦闘を選択。` };
}

function applyEnemyIntelFromBattle(state, enemy, result) {
  const action = result.enemyAction;
  if (!action) return;

  if (action.type === "skill" && action.skillName) {
    if (!enemy.intel.seenSkills.includes(action.skillName)) {
      enemy.intel.seenSkills.push(action.skillName);
      state.log.push(`敵スキル「${action.skillName}」の情報を記録した。`);
    }
  }

  if (action.type === "np") {
    if (!enemy.intel.npSeen) {
      enemy.intel.npSeen = true;
      state.log.push(`敵宝具「${enemy.npName}」が観測され、情報が公開された。`);
    }
  }
}


function runNpcFactionPhase(state) {
  const alive = state.factions.filter((f) => f.alive);
  if (alive.length <= 1) {
    state.log.push("他陣営は動きを見せず、夜を待っている。",);
    return;
  }

  const skirmishCount = Math.min(2, Math.max(1, Math.floor(Math.random() * 3)));

  for (let i = 0; i < skirmishCount; i += 1) {
    const actors = state.factions.filter((f) => f.alive);
    if (actors.length <= 1) break;

    const actor = actors[Math.floor(Math.random() * actors.length)];
    const targets = actors.filter((f) => f.id !== actor.id);
    const target = targets[Math.floor(Math.random() * targets.length)];
    const roll = Math.random();

    if (roll < 0.2) {
      state.log.push(`他陣営: ${actor.className}陣営は潜伏を選択。戦闘は発生しなかった。`,);
      continue;
    }

    if (roll < 0.35) {
      actor.hp = Math.min(100, actor.hp + 8);
      state.log.push(`他陣営: ${actor.className}陣営は同盟工作に成功し、戦力を立て直した。`,);
      continue;
    }

    const damage = randomInt(16, 34);
    target.hp -= damage;
    state.log.push(`他陣営交戦: ${actor.className}陣営が ${target.className}陣営へ ${damage} ダメージ。`,);

    if (target.hp <= 0) {
      target.alive = false;
      target.hp = 0;
      if (state.battle.currentEnemyId === target.id) state.battle.currentEnemyId = null;
      state.log.push(`他陣営結果: ${target.className}陣営が脱落。`,);
    }
  }

  if (remainingEnemies(state) <= 3) {
    state.progress.finalUnlocked = true;
  }
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

function randomInt(min, max) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}
