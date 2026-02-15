import { CLASS_AFFINITY_TABLE, ENEMY_INTEL_RULES, FSN_SERVANTS, SERVANT_CHECK_TAG_SKILLS, SERVANT_COMBAT_EFFECTS } from "./data/generatedData.js";

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
const CHAPTERS = {
  1: { title: "第1章 序戦『召喚の夜』", objective: "契約方針を固め、初夜戦を突破する。", motif: "召喚儀式と初遭遇" },
  2: { title: "第2章 駆け引き『偽装と同盟』", objective: "交渉で同盟線を確保し、情報優位を築く。", motif: "学園/市街地の二重生活と休戦交渉" },
  3: { title: "第3章 侵攻『工房崩し』", objective: "敵拠点を突き止め、補給線を断つ。", motif: "工房急襲と夜間索敵" },
  4: { title: "第4章 断層『河川決戦』", objective: "公開戦闘の被害を抑えつつ強敵を脱落させる。", motif: "河川/橋梁での対軍宝具級衝突" },
  5: { title: "第5章 収束『裏切りと露見』", objective: "同盟の真偽を見極め、終盤構図を固定する。", motif: "同盟崩壊と真名露見" },
  6: { title: "第6章 終章『聖杯到達』", objective: "願いの是非を選び、最終決戦を完遂する。", motif: "聖杯選択の倫理決断" },
};

const CLASS_POWER_WEIGHTS = {
  セイバー: { 筋力: 0.3, 耐久: 0.25, 敏捷: 0.2, 魔力: 0.15, 幸運: 0.1, 宝具: 0.55 },
  アーチャー: { 筋力: 0.22, 耐久: 0.15, 敏捷: 0.28, 魔力: 0.2, 幸運: 0.15, 宝具: 0.5 },
  ランサー: { 筋力: 0.25, 耐久: 0.2, 敏捷: 0.3, 魔力: 0.1, 幸運: 0.15, 宝具: 0.48 },
  ライダー: { 筋力: 0.2, 耐久: 0.18, 敏捷: 0.27, 魔力: 0.15, 幸運: 0.2, 宝具: 0.52 },
  キャスター: { 筋力: 0.08, 耐久: 0.12, 敏捷: 0.14, 魔力: 0.38, 幸運: 0.28, 宝具: 0.6 },
  アサシン: { 筋力: 0.14, 耐久: 0.12, 敏捷: 0.34, 魔力: 0.12, 幸運: 0.28, 宝具: 0.45 },
  バーサーカー: { 筋力: 0.38, 耐久: 0.3, 敏捷: 0.14, 魔力: 0.06, 幸運: 0.12, 宝具: 0.58 },
};

const ACTION_POWER_BONUS = {
  normal: 5,
  np: 0,
  command: 7,
  retreat: 0,
};

const PLAYER_NP_BURST_SCALE = 0.2;

const ENEMY_ACTION_POWER_SCALE = {
  np: 0.8,
  skill: 0.6,
  normal: 0.45,
  pursuit: 0.5,
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
  summon: { catalyst: null, classShifted: false, debugWeights: [] },
  battle: { lastResult: "none", tacticalAdvantage: 0, currentEnemyId: null, lastAction: null, lastActionWin: null },
  progress: { enemiesDefeated: 0, finalUnlocked: false, chapterIndex: 1, chapterIntroShown: 0 },
  flags: {
    trueNameExposure: 0,
    rescueUsed: false,
    endingType: null,
    idealPoints: 0,
    civilianDamage: 0,
    midgameRecoveryUsed: false,
    allianceState: "none",
    finalLockState: null,
    midgameRecoveryClosed: false,
    chapterContentShown: {},
  },
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
    choices: [{ label: "第1章へ進む", next: "chapterIntro" }],
  },
  chapterIntro: {
    phase: "章間",
    title: "章導入",
    text: (s) => {
      const chapter = getChapterData(s);
      return `${chapter.title}
目的: ${chapter.objective}
参照モチーフ: ${chapter.motif}

理想を掲げるほど遠回りになる。だが、それでも救えるものがある。`;
    },
    choices: [
      {
        label: "作戦会議を終えて行動開始",
        effect: (s) => {
          s.progress.chapterIntroShown = s.progress.chapterIndex;
          if (s.progress.chapterIndex === 5 && !s.flags.finalLockState) {
            s.flags.finalLockState = `露見:${s.flags.trueNameExposure}|同盟:${s.flags.allianceState}|被害:${s.flags.civilianDamage}`;
            s.log.push("終盤固定フラグを確定。ここから分岐は不可逆へ移行。");
          }
          s.log.push(`${getChapterData(s).title} を開始。`);
        },
        next: (s) => getChapterContentEntryScene(s) || "dayAction",
      },
    ],
  },

  chapter1_main_001: {
    phase: "章本文",
    title: "第1章 本文: 契約の温度",
    text: (s) => `召喚陣の残光が床に残る。工房は静かだ。静かすぎて、私の呼吸だけが浮いて聞こえる。

「契約は成立した。次は方針だ」
「先に聞かせて。私は道具として使われるの？」
「使われるかどうかは、君の命令次第だ」
「……なら隠さない。勝つだけなら近道はある。でも、被害は見捨てたくない」
「遅い道だな」
「わかってる。遅くても、守れる数を増やしたい」

${s.servant.className}は短く息を吐いた。
「確認した。今夜はその理想に付き合う」
令呪を握り込む。夜気が窓を鳴らす。ここで決めるのは命令じゃない。覚悟だ。`,
    choices: [
      {
        label: "対等契約で進む（信頼優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_001"] = true;
          s.flags.idealPoints += 1;
          s.master.mana = Math.max(0, s.master.mana - 4);
          s.log.push("契約方針: 対等契約を選択。理想点+1、初動コストで魔力-4。");
        },
        next: "chapter1_main_002",
      },
      {
        label: "指揮重視で進む（統制優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_001"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.log.push("契約方針: 指揮重視を選択。夜戦の戦術優位を確保。");
        },
        next: "chapter1_main_002",
      },
      {
        label: "成果重視で進む（短期決着優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_001"] = true;
          s.master.mana = Math.min(100, s.master.mana + 6);
          s.flags.civilianDamage += 1;
          s.log.push("契約方針: 成果重視を選択。魔力+6、強引な準備で一般被害+1。");
        },
        next: "chapter1_main_002",
      },
    ],
  },
  chapter1_main_002: {
    phase: "章本文",
    title: "第1章 本文: 初夜戦前、灯りの外",
    text: `窓の外で結界が軋む。敵影は見えない。なのに喉の奥だけが先に乾いた。

「来る。距離は近い」
「数は？」
「まだ読めない。だが、こちらを試す気だ」
「真名を隠してる間に先手を取りたい。被害を減らす形は作れる？」
「作れる。ただ、時間は食う」
「時間稼ぎに、一発ぶつける手もある」
「その時は君が決めろ。今夜は最初の夜戦だ」

地図をなぞる。避難路、橋、封鎖できる路地。
被害を抑えるか、早く終わらせるか。先に切る札を決めた。`,
    choices: [
      {
        label: "被害を抑えて索敵する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_002"] = true;
          s.flags.idealPoints += 1;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.log.push("初夜戦方針: 被害回避を優先。理想点+1、索敵により戦術優位+1。");
        },
        next: "dayAction",
      },
      {
        label: "短期決着の準備を進める",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_002"] = true;
          s.master.mana = Math.min(100, s.master.mana + 8);
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("初夜戦方針: 短期決着を選択。魔力+8、準備過程で情報露見+1。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter2_main_001: {
    phase: "章本文",
    title: "第2章 本文: 偽装と同盟の駆け引き",
    text: `昼の校舎は平穏を装っている。けれど視線の温度だけが夜より正直だ。

「監督役から連絡。第三交差点で会談だ」
「休戦提案？」
「表向きはな。実際は探り合いだ」
「罠の匂いは？」
「ある。だが無視すれば向こうに先手を渡す」
「受ければ背中を見せる」
「だから交渉の場で逆に読む。戦場はひとつじゃない」

鞄の中の令呪が熱い。
深呼吸して、得られるものと失うものを書き出した。`,
    choices: [
      {
        label: "会談に応じる（情報優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_001"] = true;
          s.flags.idealPoints += 1;
          s.flags.allianceState = s.flags.allianceState === "betrayed" ? "ceasefire" : "allied";
          s.log.push("第2章交渉: 会談を受諾。理想点+1、同盟状態を調整。");
        },
        next: "chapter2_main_002",
      },
      {
        label: "会談を偽装し監視を敷く（警戒）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_001"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.master.mana = Math.max(0, s.master.mana - 6);
          s.log.push("第2章交渉: 監視網を優先。戦術優位+1、魔力-6。");
        },
        next: "chapter2_main_002",
      },
    ],
  },
  chapter2_main_002: {
    phase: "章本文",
    title: "第2章 本文: 取引の代償",
    text: `第三交差点。街灯の白さだけが、互いの嘘を照らす。

「今夜は刃を引く」
「期限は？」
「明朝までだ」
「短いね」
「長い休戦は、裏切りの準備時間になる」
「つまり、あなたも準備する」
「必要ならな」

握手はした。信頼は近づかない。
帰り道で被害の見積もりを直す。守る範囲を広げれば手は足りない。
「それでも守るのか」
「守る。失う前提で線を引くのは、ここで終わりにする」
それでも、失う前提だけは拒む。`,
    choices: [
      {
        label: "同盟を維持し被害を抑える",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_002"] = true;
          s.flags.idealPoints += 1;
          if (s.flags.allianceState === "none") s.flags.allianceState = "ceasefire";
          s.log.push("第2章方針: 同盟維持を優先。理想点+1。");
        },
        next: "dayAction",
      },
      {
        label: "裏切りを警戒して先制準備する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_002"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("第2章方針: 先制準備を選択。戦術優位+2、情報露見+1。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter3_main_001: {
    phase: "章本文",
    title: "第3章 本文: 工房崩しの前夜",
    text: `夜気の奥で霊脈が脈打つ。敵工房の位置は、ようやく一本の線で結べるところまで来た。

「正面から叩くか、潜って核を潰すか」
「潜入が通れば被害は抑えられる。失敗すれば囲まれる」
「正面突破は？」
「速い。だが、街も巻き込む」

私は地図を折り直した。勝つだけなら答えは単純だ。
問題は、勝った後に何を残すかだった。`,
    choices: [
      {
        label: "潜入経路を選ぶ（被害抑制）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_001"] = true;
          s.flags.idealPoints += 1;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.log.push("第3章侵攻: 潜入経路を選択。理想点+1、戦術優位+1。");
        },
        next: "chapter3_main_002",
      },
      {
        label: "正面突破を選ぶ（速攻）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_001"] = true;
          s.master.mana = Math.max(0, s.master.mana - 10);
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.civilianDamage += 1;
          s.log.push("第3章侵攻: 正面突破を選択。戦術優位+2、魔力-10、一般被害+1。");
        },
        next: "chapter3_main_002",
      },
    ],
  },
  chapter3_main_002: {
    phase: "章本文",
    title: "第3章 本文: 侵攻後の呼吸",
    text: `瓦礫の匂いが残る路地で、私は報告を聞き終える。
敵の補給線は細くなった。けれど、こちらの手札も削れている。

「次は河川域でぶつかる。相手は対軍宝具を切ってくる」
「ここで立て直す。第4章で崩れたら終盤が重くなる」

深呼吸をひとつ。勝利条件だけじゃなく、撤退線まで含めて作戦を引き直した。`,
    choices: [
      {
        label: "第4章へ進む",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_002"] = true;
          s.log.push("第3章本文を通過。河川決戦の準備へ。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter4_main_001: {
    phase: "章本文",
    title: "第4章 本文: 河川決戦の布石",
    text: `橋梁の下を流れる水音だけが妙に澄んでいる。
ここでの選択が、リカバリー可能な最後の境目になる。

「市街地を避ければ時間を失う。強行すれば被害が増える」
「令呪を温存するか、今ここで切るか」

私は住民避難の導線と、退路の確保を同じ紙に書いた。
守るために遅れるか、終盤のために早めるか。判断はもう先送りできない。`,
    choices: [
      {
        label: "市街地回避を優先する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["4_001"] = true;
          s.flags.idealPoints += 1;
          s.master.mana = Math.max(0, s.master.mana - 6);
          s.log.push("第4章決戦: 市街地回避を選択。理想点+1、魔力-6。");
        },
        next: "chapter4_main_002",
      },
      {
        label: "決戦を強行する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["4_001"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.civilianDamage += 1;
          s.log.push("第4章決戦: 強行を選択。戦術優位+2、一般被害+1。");
        },
        next: "chapter4_main_002",
      },
    ],
  },
  chapter4_main_002: {
    phase: "章本文",
    title: "第4章 本文: 終端の宣言",
    text: `決戦後、残った地図には破れた線と、まだ守れた線の両方が残った。

「ここまでだ。次章からは、失敗を取り返せない」
「わかってる。ここで選んだ代償は、最後まで持っていく」

私は記録を閉じる。ここが中盤リカバリーの終端だ。
第5章から先は不可逆。敗北時の再編は失われ、救済はより重い代償を伴う。`,
    choices: [
      {
        label: "終盤へ進む",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["4_002"] = true;
          if (!s.flags.finalLockState) {
            s.flags.finalLockState = `露見:${s.flags.trueNameExposure}|同盟:${s.flags.allianceState}|被害:${s.flags.civilianDamage}`;
          }
          s.flags.midgameRecoveryClosed = true;
          s.log.push("第4章本文を通過。ここから中盤リカバリー不可・終盤不可逆フェーズへ。",);
        },
        next: "dayAction",
      },
    ],
  },
  chapter5_main_001: {
    phase: "章本文",
    title: "第5章 本文: 裏切りと露見",
    text: `終盤の会談は短い。言葉より沈黙の方が多かった。

「同盟はここで解く」
「理由は？」
「聖杯前で背中は預けられない」
「……正直で助かる」

戦況図の上で、関係は一度切り替わる。敵味方の線を引き直す作業に、情は残らない。
私は露見した情報と、まだ伏せられる情報を分けて書き込んだ。`,
    choices: [
      {
        label: "同盟を維持して最終局面へ",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["5_001"] = true;
          s.flags.allianceState = "allied";
          s.flags.idealPoints += 1;
          s.log.push("第5章方針: 同盟維持を選択。理想点+1。",);
        },
        next: "chapter5_main_002",
      },
      {
        label: "先制裏切りで主導権を取る",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["5_001"] = true;
          s.flags.allianceState = "betrayed";
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.civilianDamage += 1;
          s.log.push("第5章方針: 先制裏切りを選択。戦術優位+2、一般被害+1。",);
        },
        next: "chapter5_main_002",
      },
    ],
  },
  chapter5_main_002: {
    phase: "章本文",
    title: "第5章 本文: 決戦構図の固定",
    text: `ここから先はやり直せない。誰を守り、誰を切るかは、もう結果でしか語られない。

「真名露見は避けられない局面が来る」
「なら、露見しても勝てる形を先に作る」

私は記録を閉じる。最終夜までに残るのは、令呪と覚悟だけだ。`,
    choices: [
      {
        label: "最終章へ進む",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["5_002"] = true;
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("第5章本文を通過。最終章へ。",);
        },
        next: "dayAction",
      },
    ],
  },
  chapter6_main_001: {
    phase: "章本文",
    title: "第6章 本文: 聖杯前夜",
    text: `最終夜。街は静まり、足音だけがやけに響く。

「ここで勝っても、願いが正しいとは限らない」
「だから選ぶ。勝ち方だけじゃなく、願いの形まで」

私は残りの令呪を数える。看破情報、関係、被害。
積み上げたものすべてが、最後の選択に重なっていた。`,
    choices: [
      {
        label: "理想を優先する準備を固める",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["6_001"] = true;
          s.flags.idealPoints += 1;
          s.log.push("第6章準備: 理想優先を選択。理想点+1。",);
        },
        next: "chapter6_main_002",
      },
      {
        label: "勝利優先で現実策を取る",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["6_001"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.idealPoints = Math.max(0, s.flags.idealPoints - 1);
          s.log.push("第6章準備: 現実策を選択。戦術優位+2、理想点-1。",);
        },
        next: "chapter6_main_002",
      },
    ],
  },
  chapter6_main_002: {
    phase: "章本文",
    title: "第6章 本文: 願いの選択",
    text: `聖杯は手の届く場所にある。だが、何を願うかで結末の意味は反転する。

「理想を貫くか」
「現実に折り合うか」
「それとも、願いそのものを拒むか」

私は一歩踏み出す。ここから先は、誰のせいにもできない。`,
    choices: [
      {
        label: "理想を貫く",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["6_002"] = true;
          s.flags.idealPoints += 1;
          s.log.push("願い方針: 理想維持を選択。",);
        },
        next: "finalBattle",
      },
      {
        label: "現実と妥協する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["6_002"] = true;
          s.flags.civilianDamage += 1;
          s.log.push("願い方針: 現実妥協を選択。一般被害+1。",);
        },
        next: "finalBattle",
      },
      {
        label: "願いを拒絶する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["6_002"] = true;
          s.master.commandSpells = Math.max(0, s.master.commandSpells - 1);
          s.flags.idealPoints += 1;
          s.log.push("願い方針: 願い拒絶を選択。令呪-1、理想点+1。",);
        },
        next: "finalBattle",
      },
    ],
  },
  dayAction: {
    phase: "昼",
    title: "日中行動",
    text: (s) =>
      `Day ${s.day} / ${getChapterData(s).title}
目的: ${getChapterData(s).objective}
残存敵陣営: ${remainingEnemies(s)}組 / 真名看破進行: ${s.flags.trueNameExposure}/3
理想点: ${s.flags.idealPoints} / 一般被害: ${s.flags.civilianDamage} / 同盟: ${s.flags.allianceState}`,
    choices: [
      {
        label: "情報収集（敵情報を看破）",
        effect: (s) => {
          const intel = MASTER_BUILDS[s.master.buildType]?.情報 ?? 0;
          const intelGain = 1 + (intel > 0 ? 1 : 0);
          collectEnemyIntel(s, intelGain);
          s.master.mana = Math.min(100, s.master.mana + 6);
          s.battle.tacticalAdvantage = 0;
          applyChapterDayEvent(s, "intel");
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
          applyChapterDayEvent(s, "workshop");
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
          applyChapterDayEvent(s, "position");
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
  midgameRecovery: {
    phase: "深夜",
    title: "中盤リカバリー",
    text: "致命的敗北。しかし中盤までは再編の余地がある。\n代償: 一般被害+1 / 同盟状態は停戦へ固定 / HPは35で再開 / 再編はこの周回で1回のみ。",
    choices: [
      {
        label: "代償を払って再編する",
        effect: (s) => {
          s.flags.midgameRecoveryUsed = true;
          s.master.hp = 35;
          s.master.mana = Math.min(100, s.master.mana + 20);
          s.flags.civilianDamage += 1;
          s.flags.allianceState = "ceasefire";
          s.log.push("中盤リカバリーを実行。一般被害+1、同盟状態は停戦へ。");
          nextDay(s);
        },
        next: (s) => (shouldShowChapterIntro(s) ? "chapterIntro" : "dayAction"),
      },
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
          s.flags.rescueUsed = true;
          s.master.hp = Math.max(20, s.master.hp);
          s.servant.params.耐久 = Math.max(1, s.servant.params.耐久 - 1);
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("救済導線を発動。耐久低下と看破進行を受諾。",);
          nextDay(s);
        },
        next: (s) => {
          if (s.progress.finalUnlocked) return "finalBattle";
          return shouldShowChapterIntro(s) ? "chapterIntro" : "dayAction";
        },
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
      if (s.flags.endingType === "正統勝利") return "あなたは被害を抑え、理想を曲げずに聖杯へ到達した。\n失ったものは少なくない。それでも、守れた命の重さが勝利を正統にした。";
      if (s.flags.endingType === "代償勝利") return "勝利には届いた。だが代償は重い。\n露見した情報、破れた契約、残された傷は、次の時代まで尾を引く。";
      if (s.flags.endingType === "救済生還") return "聖杯には届かなかった。けれど生き延びた。\n救済の代償を背負いながら、あなたは次の夜へ備える。";
      return "契約は潰え、願いは届かず、すべては夜に沈んだ。\nここで終わる。だが、この敗北の記録だけは消えない。";
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
  const picked = summonServant(state, catalystName);

  state.summon.classShifted = picked.classShifted;
  state.summon.debugWeights = picked.debugWeights || [];
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
  if (state.summon.debugWeights.length) {
    const top = state.summon.debugWeights.slice(0, 3).map((row) => `${row.trueName}:${row.total.toFixed(2)}`).join(" / ");
    state.log.push(`召喚相性内訳（上位）: ${top}`);
  }
}

function summonServant(state, catalystName) {
  const scored = FSN_SERVANTS.map((servant) => {
    const weights = calculateSummonWeight(state, servant, catalystName);
    return { servant, ...weights };
  }).sort((a, b) => b.total - a.total);

  const picked = weightedPick(scored);
  const classShifted = Math.random() < 0.35;
  if (classShifted && picked.altClasses.length > 0) picked.className = picked.altClasses[0];
  picked.classShifted = classShifted;
  picked.debugWeights = scored.slice(0, 5).map((row) => ({
    trueName: row.servant.trueName,
    className: row.servant.className,
    catalyst: Number(row.catalyst.toFixed(2)),
    build: Number(row.build.toFixed(2)),
    chapter: Number(row.chapter.toFixed(2)),
    alliance: Number(row.alliance.toFixed(2)),
    random: Number(row.random.toFixed(2)),
    total: Number(row.total.toFixed(2)),
  }));
  return picked;
}

function calculateSummonWeight(state, servant, catalystName) {
  const classKey = toClassKey(servant.className);
  const catalystWeights = CATALYSTS[catalystName] || {};
  const catalyst = Number(catalystWeights[classKey] || 1);

  const buildType = state.master.buildType;
  let build = 0;
  if (buildType === "血統型") {
    build += servant.stats.魔力 >= 4 ? 1.8 : 0.4;
    build += servant.stats.幸運 >= 4 ? 0.4 : 0;
  } else if (buildType === "現場型") {
    build += servant.stats.筋力 >= 4 ? 1.2 : 0.3;
    build += servant.stats.耐久 >= 4 ? 1.2 : 0.3;
    build += servant.stats.敏捷 >= 4 ? 0.7 : 0.2;
  } else if (buildType === "研究型") {
    build += servant.stats.魔力 >= 4 ? 1.3 : 0.3;
    build += servant.stats.宝具 >= 4 ? 0.9 : 0.2;
    build += servant.stats.敏捷 >= 4 ? 0.4 : 0;
  }

  const chapterIndex = state.progress?.chapterIndex || 1;
  const chapter = chapterIndex >= 5
    ? (servant.stats.幸運 >= 4 ? 0.6 : 0)
    : (servant.stats.魔力 >= 4 ? 0.35 : 0.1);

  const allianceState = state.flags?.allianceState || "none";
  let alliance = 0;
  if (allianceState === "allied") alliance = servant.stats.幸運 >= 4 ? 0.45 : 0.15;
  if (allianceState === "betrayed") alliance = servant.stats.耐久 >= 4 ? 0.4 : 0.1;
  if (allianceState === "ceasefire") alliance = servant.stats.敏捷 >= 4 ? 0.3 : 0.1;

  const random = Math.random() * 0.9;
  const unclipped = catalyst + build + chapter + alliance + random;
  const total = clamp(unclipped, 1.25, 7.5);

  return { catalyst, build, chapter, alliance, random, total };
}

function weightedPick(scoredRows) {
  const total = scoredRows.reduce((sum, row) => sum + row.total, 0);
  if (total <= 0) return structuredClone(scoredRows[0].servant);

  let roll = Math.random() * total;
  for (const row of scoredRows) {
    roll -= row.total;
    if (roll <= 0) return structuredClone(row.servant);
  }
  return structuredClone(scoredRows[scoredRows.length - 1].servant);
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
  state.battle.lastAction = actionForCheck;
  state.battle.lastActionWin = result.win;
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

  if (state.progress.enemiesDefeated >= 5) state.progress.finalUnlocked = true;
  updateChapterProgress(state);


  if (state.master.hp > 0) nextDay(state);
}

function runCheck(state, enemy, action) {
  const build = MASTER_BUILDS[state.master.buildType] || { 生存: 0, 情報: 0, 魔力: 0 };
  const playerBase = calcClassWeightedPower(state.servant.params, state.servant.className);
  const enemyBase = calcClassWeightedPower(enemy.params, enemy.className);

  const enemyAction = decideEnemyAction(enemy, action);

  const playerCheckTags = getCheckTags(action, enemy);
  const enemyCheckTags = getEnemyCheckTags(enemyAction, state.servant.className);

  const playerPassiveMod = getServantCombatModifierByName(state.servant.sourceName, "passive", action, state.master.hp, "自陣");
  const playerNpMod = action.includes("np") ? getServantCombatModifierByName(state.servant.sourceName, "np", action, state.master.hp, "自陣") : emptyModifier();
  const playerTagMod = getCheckTagModifierByName(state.servant.sourceName, playerCheckTags, "自陣");
  const playerMod = mergeModifiers(mergeModifiers(playerPassiveMod, playerNpMod), playerTagMod);

  const enemyPassiveMod = getServantCombatModifierByName(enemy.trueName, "passive", enemyAction.type, enemy.hp, "敵陣");
  const enemyNpMod = enemyAction.type === "np" ? getServantCombatModifierByName(enemy.trueName, "np", enemyAction.type, enemy.hp, "敵陣") : emptyModifier();
  const enemyTagMod = getCheckTagModifierByName(enemy.trueName, enemyCheckTags, "敵陣");
  const enemyMod = mergeModifiers(mergeModifiers(enemyPassiveMod, enemyNpMod), enemyTagMod);

  const playerAffinity = getClassAffinity(state.servant.className, enemy.className);
  const enemyAffinity = getClassAffinity(enemy.className, state.servant.className);

  const enemyActionBonus = enemyActionPowerBonus(enemy, enemyAction.type);

  const enemyPowerRaw =
    enemyBase +
    randomInt(1, 6) +
    (state.servant.trueNameRevealed ? 2 : 0) +
    enemyAction.powerBonus +
    enemyActionBonus +
    enemyMod.bonus;

  const enemyPower = Math.round(enemyPowerRaw * enemyAffinity.multiplier);

  let bonus = state.battle.tacticalAdvantage + (build.生存 || 0) + playerMod.bonus + ACTION_POWER_BONUS.normal;
  let manaCost = Math.max(1, 8 + playerMod.manaCost);
  let damage = 35 + playerMod.damage;

  state.log.push(`クラス相性: 自陣${state.servant.className}→敵${enemy.className} ${playerAffinity.relation} x${playerAffinity.multiplier.toFixed(2)}`);
  state.log.push(`クラス相性: 敵陣${enemy.className}→自陣${state.servant.className} ${enemyAffinity.relation} x${enemyAffinity.multiplier.toFixed(2)}`);

  playerMod.logs.forEach((entry) => state.log.push(entry));
  enemyMod.logs.forEach((entry) => state.log.push(entry));
  if (enemyAction.log) state.log.push(enemyAction.log);

  if (action === "retreat") {
    const retreatPowerRaw = playerBase + randomInt(1, 6) + bonus + playerMod.retreatBonus + ACTION_POWER_BONUS.retreat;
    const retreatPower = Math.round(retreatPowerRaw * playerAffinity.multiplier);
    const retreatSuccess = retreatPower >= enemyPower;
    if (retreatSuccess) {
      return {
        win: true,
        damage: 0,
        manaCost: 4,
        backlashMaster: 0,
        backlashMana: 0,
        exposureDelta: playerMod.exposureDelta,
        enemyAction,
      };
    }
    return {
      win: false,
      damage: 0,
      manaCost: 5,
      backlashMaster: Math.max(0, 14 + playerMod.backlashMaster + enemyAction.backlashMaster + enemyMod.damage),
      backlashMana: 10,
      exposureDelta: playerMod.exposureDelta,
      enemyAction,
    };
  }

  if (action.includes("np")) {
    bonus += Math.round(npBurstPower(state.servant.params, state.servant.className) * PLAYER_NP_BURST_SCALE) + 2 + ACTION_POWER_BONUS.np;
    damage += 25;
    manaCost = Math.max(1, 20 + playerMod.manaCost);
  }

  if (action.includes("command")) {
    if (state.master.commandSpells <= 0) {
      state.log.push("令呪が尽きている。通常行動として処理。",);
    } else {
      bonus += ACTION_POWER_BONUS.command;
      damage += 15;
      manaCost = Math.max(1, 12 + playerMod.manaCost);
    }
  }

  const myPowerRaw = playerBase + bonus + randomInt(1, 6);
  const myPower = Math.round(myPowerRaw * playerAffinity.multiplier);
  const win = myPower >= enemyPower;

  if (action.startsWith("final")) {
    damage += 10;
  }

  damage = Math.max(0, Math.round(damage * playerAffinity.multiplier));

  if (win) return { win: true, damage, manaCost, backlashMaster: 0, backlashMana: 0, exposureDelta: playerMod.exposureDelta, enemyAction };
  return {
    win: false,
    damage: 0,
    manaCost,
    backlashMaster: Math.max(0, randomInt(12, 22) + playerMod.backlashMaster + enemyAction.backlashMaster + enemyMod.damage),
    backlashMana: randomInt(8, 16),
    exposureDelta: playerMod.exposureDelta,
    enemyAction,
  };
}

function calcClassWeightedPower(params, className) {
  const weights = CLASS_POWER_WEIGHTS[className] || CLASS_POWER_WEIGHTS.セイバー;
  const weighted =
    (params.筋力 || 0) * weights.筋力 +
    (params.耐久 || 0) * weights.耐久 +
    (params.敏捷 || 0) * weights.敏捷 +
    (params.魔力 || 0) * weights.魔力 +
    (params.幸運 || 0) * weights.幸運;
  return Math.round(weighted * 4);
}

function npBurstPower(params, className) {
  const weights = CLASS_POWER_WEIGHTS[className] || CLASS_POWER_WEIGHTS.セイバー;
  return Math.round((params.宝具 || 0) * weights.宝具 * 2.5);
}

function enemyActionPowerBonus(enemy, enemyActionType) {
  const scale = ENEMY_ACTION_POWER_SCALE[enemyActionType] ?? 0;

  if (enemyActionType === "np") {
    return Math.round(npBurstPower(enemy.params, enemy.className) * scale);
  }
  if (enemyActionType === "skill") {
    return Math.round(((enemy.params.魔力 || 0) + (enemy.params.敏捷 || 0)) * scale);
  }
  if (enemyActionType === "normal") {
    return Math.round(((enemy.params.筋力 || 0) + (enemy.params.耐久 || 0)) * scale);
  }
  if (enemyActionType === "pursuit") {
    return Math.round(((enemy.params.敏捷 || 0) + (enemy.params.幸運 || 0)) * scale);
  }
  return 0;
}

function getClassAffinity(attackerClass, defenderClass) {
  const fallback = { multiplier: 1, relation: "等倍" };
  return CLASS_AFFINITY_TABLE?.[attackerClass]?.[defenderClass] || fallback;
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

function getServantCombatModifierByName(sourceName, mode, action, currentHp, actorLabel) {
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

  if (base.lowHpBonus && currentHp <= 50) modifier.bonus += base.lowHpBonus;

  if (mode === "passive" && effect.passiveLabel) {
    modifier.logs.push(`${actorLabel}固有スキル「${effect.passiveLabel}」が機能。`);
  }
  if (mode === "np" && effect.npLabel && action.includes("np")) {
    modifier.logs.push(`${actorLabel}宝具「${effect.npLabel}」を解放。`);
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

function getEnemyCheckTags(enemyAction, playerClassName) {
  const tags = [];

  if (enemyAction.type === "np") tags.push("宝具", "真名解放", "強襲");
  if (enemyAction.type === "skill") tags.push("近接", "決戦");
  if (enemyAction.type === "pursuit") tags.push("撤退", "機動");

  if (playerClassName === "キャスター") tags.push("魔術防御");
  if (playerClassName === "アサシン") tags.push("危機察知");
  if (playerClassName === "ライダー") tags.push("機動");
  if (playerClassName === "バーサーカー") tags.push("継戦");

  return [...new Set(tags)];
}

function getCheckTagModifierByName(sourceName, checkTags, actorLabel) {
  const skills = SERVANT_CHECK_TAG_SKILLS[sourceName] || [];
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
    modifier.logs.push(`${actorLabel}判定タグ[${checkTags.join("/")}]により「${skill.name}」補正が発動。`);
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

  const currentRule = getIntelRule(target.intel.level);
  if (prev < 1 && target.intel.level >= 1) state.log.push(`基礎ステータス（公開数: ${currentRule.revealStatsCount}）を把握した。`);
  if (prev < 2 && target.intel.level >= 2) state.log.push(`保有スキル（公開数: ${currentRule.revealSkillCount}）の一部を把握した。`);
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

  if (remainingEnemies(state) <= 1) {
    state.progress.finalUnlocked = true;
  }
  updateChapterProgress(state);
}

function postBattleScene(state) {
  if (state.master.hp <= 0) {
    if (canUseMidgameRecovery(state)) return "midgameRecovery";
    if (state.progress.chapterIndex >= 5 || state.flags.midgameRecoveryClosed) {
      state.log.push("終盤フェーズのため中盤リカバリーは使用できない。",);
    }
    if (!state.flags.rescueUsed) return "rescue";
    return "gameOver";
  }
  if (state.progress.finalUnlocked) return "finalBattle";
  if (shouldShowChapterIntro(state)) return "chapterIntro";
  return "dayAction";
}

function decideEnding(state) {
  const alive = state.master.hp > 0;
  const score =
    (alive ? 1 : 0) +
    (state.progress.enemiesDefeated >= 5 ? 1 : 0) +
    (!state.servant.trueNameRevealed ? 1 : 0) +
    (state.master.commandSpells >= 1 ? 1 : 0) +
    (!state.flags.rescueUsed ? 1 : 0) +
    (state.flags.idealPoints >= 3 ? 1 : 0) -
    Math.min(2, state.flags.civilianDamage);

  if (score >= 4) state.flags.endingType = "正統勝利";
  else if (score >= 2) state.flags.endingType = "代償勝利";
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


function chapterFromDefeats(defeated) {
  if (defeated >= 5) return 6;
  return Math.min(5, defeated + 1);
}

function getChapterData(state) {
  const idx = state.progress.chapterIndex || 1;
  return CHAPTERS[idx] || CHAPTERS[1];
}

function updateChapterProgress(state) {
  const nextChapter = chapterFromDefeats(state.progress.enemiesDefeated);
  if (nextChapter > state.progress.chapterIndex) {
    state.progress.chapterIndex = nextChapter;
    state.log.push(`${CHAPTERS[nextChapter].title} へ進行。`);
  }
}


function getChapterContentEntryScene(state) {
  const chapter = state.progress.chapterIndex;
  const shown = state.flags.chapterContentShown || {};
  if (chapter === 1 && !shown["1_001"]) return "chapter1_main_001";
  if (chapter === 2 && !shown["2_001"]) return "chapter2_main_001";
  if (chapter === 3 && !shown["3_001"]) return "chapter3_main_001";
  if (chapter === 4 && !shown["4_001"]) return "chapter4_main_001";
  if (chapter === 5 && !shown["5_001"]) return "chapter5_main_001";
  if (chapter === 6 && !shown["6_001"]) return "chapter6_main_001";
  return null;
}

function shouldShowChapterIntro(state) {
  return state.progress.chapterIntroShown < state.progress.chapterIndex;
}

function canUseMidgameRecovery(state) {
  return state.progress.chapterIndex <= 4 && !state.flags.midgameRecoveryUsed && !state.flags.midgameRecoveryClosed;
}

function applyChapterDayEvent(state, actionType) {
  const chapter = state.progress.chapterIndex;
  if (chapter === 2 && actionType === "intel") {
    state.flags.allianceState = Math.random() < 0.65 ? "allied" : "none";
    if (state.flags.allianceState === "allied") {
      state.flags.idealPoints += 1;
      state.log.push("交渉が実り、同盟線を確保。理想点+1。");
    } else {
      state.log.push("交渉は決裂。次章の連戦リスクが増す。");
    }
  }

  if (chapter === 3 && actionType === "position") {
    state.battle.tacticalAdvantage += 1;
    state.log.push("敵工房への侵攻準備が整い、夜戦補正が強化された。");
  }

  if (chapter === 4) {
    if (actionType === "workshop") {
      state.flags.civilianDamage += 1;
      state.log.push("河川戦の余波で一般被害が拡大。一般被害+1。");
    }
    if (actionType === "intel") {
      state.flags.idealPoints += 1;
      state.log.push("避難誘導を優先。理想点+1。");
    }
  }

  if (chapter >= 5 && actionType === "intel" && state.flags.allianceState === "allied") {
    state.flags.allianceState = "betrayed";
    state.log.push("終盤で同盟が崩壊。裏切りフラグが成立。");
  }
}

function remainingEnemies(state) {
  return state.factions.filter((f) => f.alive).length;
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

function getIntelRule(level) {
  const fallback = ENEMY_INTEL_RULES[0] || { level: 0, revealStatsCount: 0, revealSkillCount: 0, revealTrueName: 0, revealNpType: 0, revealNpName: 0 };
  return ENEMY_INTEL_RULES.find((rule) => rule.level === level) || fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min, max) {
  const lower = Math.ceil(min);
  const upper = Math.floor(max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}


export const __internal = { summonServantForTest: summonServant };
