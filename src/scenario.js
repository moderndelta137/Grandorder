import { CLASS_AFFINITY_TABLE, DAY_EVENTS, ENEMY_INTEL_RULES, FSN_SERVANTS, SERVANT_CHECK_TAG_SKILLS, SERVANT_COMBAT_EFFECTS } from "./data/generatedData.js";

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
    dayEventSeen: {},
    lastDayEventId: null,
  },
  dayEvent: {
    id: null,
    category: null,
    text: null,
    hasChoices: false,
    active: null,
    resultText: null,
    deltaSummary: null,
  },
  dayActionPlan: null,
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

  // Writer note (non-player): Chapter1 is split into short beats (導入→状況→選択→戦況→最終判断→出撃).
  // This note is for maintenance only and is not rendered to players.

  chapter1_main_001: {
    phase: "章本文",
    title: "第1章 本文: 残光",
    text: (s) => `10月1日 23:00。召喚陣の熱がまだ床に残っている。
地図には避難導線、監視札、工房防壁の更新予定。どれも今夜の生存率に直結する。

「${s.servant.className}、確認する。今夜の優先は二つだ。民間被害を抑えること、そして初戦を生き残ること」
「了解です、マスター。どちらかを誤れば、明日の交渉で主導権を失います」
「つまり、最初の判断が後の戦場全部に響く」
「ええ。だから今、指揮系を固めます」`,
    choices: [
      {
        label: "方針確認を進める",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_001"] = true;
        },
        next: "chapter1_main_002",
      },
    ],
  },
  chapter1_main_002: {
    phase: "章本文",
    title: "第1章 本文: 地図の上",
    text: (s) => `10月1日 23:12。作戦机で北区画の監視線を拡大する。
点滅しているのは、弱いが連続した干渉反応。様子見の敵がこちらの初動を測っている。

「${s.servant.className}、敵の狙いは」
「契約直後の遅れです。判断が遅い陣営を翌夜の標的にします」
「なら受け身は悪手だ。先に動いて、測られる側から外れる」
「はい。移動中の接触を前提に組みます」`,
    choices: [
      {
        label: "敵反応の速報を確認する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_002"] = true;
        },
        next: "dayAction",
      },
    ],
  },
  chapter1_main_003: {
    phase: "章本文",
    title: "第1章 本文: 最初の札",
    text: (s) => `10月1日 23:24。路地の監視札が弾け、敵斥候の接触ログが確定する。
ここで方針を決めなければ、夜戦直前に露見か被害のどちらかを受け入れることになる。

「${s.servant.className}、契約運用を固定する。今決める」
「承知。方針で失うものが変わります、マスター」
「代償は受ける。未決定のまま進む方が高くつく」`,
    choices: [
      {
        label: "対等契約で進む（信頼優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_003"] = true;
          s.flags.idealPoints += 1;
          s.master.mana = Math.max(0, s.master.mana - 4);
          s.log.push("契約方針: 対等契約を選択。理想点+1、初動コストで魔力-4。");
        },
        next: "dayAction",
      },
      {
        label: "指揮重視で進む（統制優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_003"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.log.push("契約方針: 指揮重視を選択。夜戦の戦術優位を確保。");
        },
        next: "dayAction",
      },
      {
        label: "成果重視で進む（短期決着優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_003"] = true;
          s.master.mana = Math.min(100, s.master.mana + 6);
          s.flags.civilianDamage += 1;
          s.log.push("契約方針: 成果重視を選択。魔力+6、強引な準備で一般被害+1。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter1_main_004: {
    phase: "章本文",
    title: "第1章 本文: 夜は動き出す",
    text: (s) => `10月2日 19:10。翌日更新後の病院外周。避難導線は生きているが、敵前衛の圧力が一段上がっている。
守る範囲を曖昧にすれば、前哨接敵で導線ごと崩される。

「マスター、相手は被害誘発を狙っています」
「狙いは分かってる。こちらは守る範囲を先に固定する」
「固定できれば、次の衝突で主導権を残せます」`,
    choices: [
      {
        label: "初夜戦前の最終判断へ",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_004"] = true;
        },
        next: "dayAction",
      },
    ],
  },
  chapter1_main_005: {
    phase: "章本文",
    title: "第1章 本文: 代償の秤",
    text: (s) => `10月2日 19:40。前哨接敵の余波で封鎖線の余裕が削れた。
ここで決めるのは感情ではなく運用だ。被害抑制を取るか、短期決着で先手を取るか。

「${s.servant.className}、最終確認だ。今夜は何を守り、何を捨てる」
「被害を守れば時間を失い、短期決着を取れば露見が進みます」
「了解。今夜の代償はここで確定させる」`,
    choices: [
      {
        label: "被害を抑えて索敵する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_005"] = true;
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
          s.flags.chapterContentShown["1_005"] = true;
          s.master.mana = Math.min(100, s.master.mana + 8);
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("初夜戦方針: 短期決着を選択。魔力+8、準備過程で情報露見+1。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter1_main_006: {
    phase: "章本文",
    title: "第1章 本文: 出撃",
    text: (s) => `10月2日 20:05。接敵導線。令呪の熱が脈と同期する。
この一戦で固定されるのは勝敗だけではない。明日の交渉余地、被害評価、露見進行もここから始まる。

「行くぞ、${s.servant.className}。先に当たって流れを取る」
「はい、マスター。方針どおりに戦えば、明朝までの損耗を抑えられます」
「崩れたら即切り替え。生存と導線維持を優先」
「了解。初夜戦へ入ります」`,
    choices: [
      {
        label: "夜戦へ出る",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["1_006"] = true;
          s.log.push("第1章本文を通過。初夜戦フェーズへ移行。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter2_main_001: {
    phase: "章本文",
    title: "第2章 本文: 学園の昼、打診",
    text: (s) => `10月2日 13:10。学園本棟の廊下は平穏を装っている。
だが、昨日の夜戦を知る者の視線だけが妙に鋭い。

「サーヴァント、監督役から連絡だ。第三交差点で会談したいらしい」
「休戦提案の形を取った探りですね、マスター」
「だろうな。受けても罠、断っても不利だ」`,
    choices: [
      {
        label: "監督役室へ向かい、条件を確認する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_001"] = true;
        },
        next: "chapter2_main_002",
      },
    ],
  },
  chapter2_main_002: {
    phase: "章本文",
    title: "第2章 本文: 監督役室の温度差",
    text: (s) => `10月2日 13:40。監督役室は静かすぎて、紙の擦れる音まで響いた。

「会談は18時40分、第三交差点。期限付き休戦を議題にする」
「期限は？」
「明朝まで。双方、違反時は即時交戦再開」

「サーヴァント、どう見る」
「短い休戦です。情報を拾うには十分、信用するには短すぎます」`,
    choices: [
      {
        label: "会談に応じる（情報優先）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_002"] = true;
          s.flags.idealPoints += 1;
          s.flags.allianceState = s.flags.allianceState === "betrayed" ? "ceasefire" : "allied";
          s.log.push("第2章交渉: 会談を受諾。理想点+1、同盟状態を調整。");
        },
        next: "dayAction",
      },
      {
        label: "会談を偽装し監視を敷く（警戒）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_002"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.master.mana = Math.max(0, s.master.mana - 6);
          s.log.push("第2章交渉: 監視網を優先。戦術優位+1、魔力-6。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter2_main_003: {
    phase: "章本文",
    title: "第2章 本文: 夕刻への移動",
    text: (s) => `10月2日 16:50。学園裏門を出て、市街地を南へ下る。
交差点に近づくほど人通りは減り、代わりに監視の気配が増えた。

「サーヴァント、尾行は？」
「二組。直接介入はしない、観測優先です」
「こちらの構えを見に来てるわけか」
「ええ。会談前に怖じるかどうかを試しています」`,
    choices: [
      {
        label: "第三交差点へ入り、会談を開始する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_003"] = true;
        },
        next: "dayAction",
      },
    ],
  },
  chapter2_main_004: {
    phase: "章本文",
    title: "第2章 本文: 第三交差点の休戦",
    text: `10月2日 18:40。第三交差点の街灯が、互いの嘘だけを白く照らす。

「今夜は刃を引く」
「期限は明朝まで、だったな」
「長い休戦は、裏切りの準備時間になる」
「つまり、あなたも準備する」
「必要ならな」

握手はした。信頼は近づかない。
だが、何を守るかの優先順位だけは、ここで決めて持ち帰る必要があった。`,
    choices: [
      {
        label: "会談を終え、学園方面へ撤収する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_004"] = true;
        },
        next: "dayAction",
      },
    ],
  },
  chapter2_main_005: {
    phase: "章本文",
    title: "第2章 本文: 帰路の再評価",
    text: (s) => `10月2日 20:15。学園裏門へ戻る坂道で、私は被害見積もりを引き直す。
守る範囲を広げれば手は足りない。先に勝てば、別の誰かが遅れる。

「サーヴァント、ここで方針を固める」
「はい、マスター。休戦は短い。今夜の準備が明日の主導権を決めます」`,
    choices: [
      {
        label: "同盟を維持し被害を抑える",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_005"] = true;
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
          s.flags.chapterContentShown["2_005"] = true;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.trueNameExposure = Math.min(3, s.flags.trueNameExposure + 1);
          s.log.push("第2章方針: 先制準備を選択。戦術優位+2、情報露見+1。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter2_main_006: {
    phase: "章本文",
    title: "第2章 本文: 夜への持ち越し",
    text: (s) => `10月2日 21:05。工房へ戻ると、机の上には新しい監視ログが積まれていた。
休戦は続いている。だが、静かな夜ほど次の裏切りは近い。

「行こう、サーヴァント。明日は会談の言葉じゃなく、行動で答えが出る」
「はい、マスター。今夜の準備をそのまま明朝へ繋げます」`,
    choices: [
      {
        label: "第2章を終え、次行動へ",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["2_006"] = true;
          s.log.push("第2章本文を通過。次の行動フェーズへ。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter3_main_001: {
    phase: "章本文",
    title: "第3章 本文: 旧工業区の入口",
    text: (s) => `10月3日 19:15。旧工業区の外縁に着くころ、空気の温度が一段落ちた。
敵工房は近い。遠くで鳴る金属音だけが、妙に規則的だ。

「サーヴァント、ここから先は気配を切る」
「了解です、マスター。まず監視の目を数えましょう」`,
    choices: [
      {
        label: "観測を優先して迂回路を探る",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_001"] = true;
        },
        next: "chapter3_main_002",
      },
    ],
  },
  chapter3_main_002: {
    phase: "章本文",
    title: "第3章 本文: 外周観測",
    text: (s) => `10月3日 19:45。工業区外周の高架下で、監視札の反応を重ねる。
北側に巡回二組、西側に結界杭。中央路は最短だが、読まれやすい。

「正面から叩くか、潜って核を潰すか」
「潜入が通れば被害は抑えられます。失敗すれば囲まれます、マスター」`,
    choices: [
      {
        label: "侵入前に補給線の位置を確定する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_002"] = true;
        },
        next: "chapter3_main_003",
      },
    ],
  },
  chapter3_main_003: {
    phase: "章本文",
    title: "第3章 本文: 最初の侵攻判断",
    text: (s) => `10月3日 20:20。補給路の刻印が、廃倉庫の裏手で一本に繋がった。
ここで選ぶ方針が、今夜の被害と明日の余力を決める。

「サーヴァント、侵攻方法を決める」
「はい、マスター。速さを取るか、損失を抑えるかです」`,
    choices: [
      {
        label: "潜入経路を選ぶ（被害抑制）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_003"] = true;
          s.flags.idealPoints += 1;
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 1);
          s.log.push("第3章侵攻: 潜入経路を選択。理想点+1、戦術優位+1。");
        },
        next: "chapter3_main_004",
      },
      {
        label: "正面突破を選ぶ（速攻）",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_003"] = true;
          s.master.mana = Math.max(0, s.master.mana - 10);
          s.battle.tacticalAdvantage = Math.max(s.battle.tacticalAdvantage || 0, 2);
          s.flags.civilianDamage += 1;
          s.log.push("第3章侵攻: 正面突破を選択。戦術優位+2、魔力-10、一般被害+1。");
        },
        next: "chapter3_main_004",
      },
    ],
  },
  chapter3_main_004: {
    phase: "章本文",
    title: "第3章 本文: 侵攻後の断片",
    text: (s) => `10月3日 22:05。侵攻後の路地は、焦げた匂いと粉塵で視界が薄い。
敵の補給線は細くなったが、こちらも余裕を削られた。

「マスター、河川域への移動は避けられません」
「わかってる。ここで立て直さないと、次で崩れる」`,
    choices: [
      {
        label: "工房へ一度戻り、撤退線を再設定する",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_004"] = true;
        },
        next: "chapter3_main_005",
      },
    ],
  },
  chapter3_main_005: {
    phase: "章本文",
    title: "第3章 本文: 夜半の再設計",
    text: (s) => `10月3日 23:30。工房へ戻り、撤退線と避難導線を重ねて引き直す。
勝利条件だけを残せば、次の夜で誰かを取りこぼす。

「サーヴァント、次は河川橋梁。対軍宝具が来る前提で組む」
「了解です、マスター。守る順序を先に固定しましょう」`,
    choices: [
      {
        label: "第4章へ進む準備を終える",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_005"] = true;
        },
        next: "chapter3_main_006",
      },
    ],
  },
  chapter3_main_006: {
    phase: "章本文",
    title: "第3章 本文: 河川域への移送",
    text: (s) => `10月3日 23:55。必要最低限の装備だけを持ち、河川域へ向かう車列に乗る。
車窓の街灯が流れていくたび、次の戦いの輪郭だけがはっきりしていった。

「行くぞ、サーヴァント」
「はい、マスター。次は守る線を折りません」`,
    choices: [
      {
        label: "第3章を終え、次行動へ",
        effect: (s) => {
          s.flags.chapterContentShown = s.flags.chapterContentShown || {};
          s.flags.chapterContentShown["3_002"] = true;
          s.flags.chapterContentShown["3_006"] = true;
          s.log.push("第3章本文を通過。河川決戦の準備へ。");
        },
        next: "dayAction",
      },
    ],
  },
  chapter4_main_001: {
    phase: "章本文",
    title: "第4章 本文: 河川決戦の布石",
    text: `10月4日 20:10。河川橋梁の下を流れる水音だけが妙に澄んでいる。
ここでの選択が、リカバリー可能な最後の境目になる。

「サーヴァント、市街地を避ければ時間を失う。強行すれば被害が増える」
「はい、マスター。どちらを選んでも終盤へ響きます」
「令呪は温存すべきか？」
「切るなら、勝ち筋より退路に使うべきです」

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
    text: `10月5日 00:40。決戦後、残った地図には破れた線と、まだ守れた線の両方が残った。

「ここまでだ、サーヴァント。ここから先は、失敗を取り返せない」
「承知しています、マスター。ここで払った代償は最後まで残ります」

私は記録を閉じる。中盤のリカバリーはここで終わる。
次に失う時は、もっと重い形で返ってくる。`,
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
    text: `10月5日 19:20。終盤会談の場は古い礼拝堂跡。言葉より沈黙の方が多い。

「同盟はここで解く」
「理由は？」
「聖杯前で背中は預けられない」
「……正直で助かる」

夜風の中で、戦況図の線を引き直す。敵味方の境界は、もう感情で保てない。
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
    text: `10月5日 23:55。礼拝堂跡から工房へ戻る道で、街の灯りがひとつずつ落ちていく。
ここから先はやり直せない。誰を守り、誰を切るかは結果でしか語られない。

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
    text: `10月6日 23:10。聖杯到達領域の手前、街は静まり、足音だけがやけに響く。

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
    text: `10月7日 00:02。聖杯は手の届く場所にある。だが、何を願うかで結末の意味は反転する。

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
        effect: (s) => prepareDayAction(s, "intel"),
        next: "dayEncounterCheck",
      },
      {
        label: "工房整備（魔力回復）",
        effect: (s) => prepareDayAction(s, "workshop"),
        next: "dayEncounterCheck",
      },
      {
        label: "先制配置（夜戦補正）",
        effect: (s) => prepareDayAction(s, "position"),
        next: "dayEncounterCheck",
      },
    ],
  },
  dayEncounterCheck: {
    phase: "昼",
    title: "行動解決",
    text: (s) => {
      const actionLabel = s.dayActionPlan?.actionType === "intel"
        ? "情報収集"
        : s.dayActionPlan?.actionType === "workshop"
          ? "工房整備"
          : "先制配置";
      const mode = s.dayActionPlan?.nextMode === "battle" ? "戦闘発生" : "ランダムイベント発生";
      return `選択行動: ${actionLabel}
解決結果: ${mode}`;
    },
    choices: [
      {
        label: "行動を確定する",
        next: (s) => resolveDayEncounter(s),
      },
    ],
  },
  dayRandomEvent: {
    phase: "昼",
    title: "日中ランダムイベント",
    text: (s) => {
      const event = s.dayEvent?.active;
      if (!event) return "イベントデータが見つからない。";
      return `${event.text || event.id}
カテゴリ: ${event.category}`;
    },
    choices: (s) => {
      const event = s.dayEvent?.active;
      if (!event || !event.options?.length) {
        return [{ label: "次へ", next: "dayRandomEventResult" }];
      }
      return event.options.map((option) => ({
        label: option.label,
        effect: (draft) => applyDayEventOption(draft, option),
        next: "dayRandomEventResult",
      }));
    },
  },
  dayRandomEventResult: {
    phase: "昼",
    title: "日中イベント結果",
    text: (s) => {
      const base = s.dayEvent?.resultText || "特筆すべき変化はなかった。";
      const summary = s.dayEvent?.deltaSummary;
      return summary ? `${base}\n${summary}` : base;
    },
    choices: [
      {
        label: "次の日中行動を選ぶ",
        effect: (s) => {
          s.dayEvent.active = null;
          s.dayEvent.deltaSummary = null;
          s.dayActionPlan = null;
        },
        next: "dayAction",
      },
    ],
  },
  nightBattle: {
    phase: "夜",
    title: "夜戦フェーズ",
    text: (s) => {
      const enemy = getCurrentEnemy(s);
      const dayEventSummary = s.dayEvent?.id
        ? `直前の日中イベント: ${s.dayEvent.text || s.dayEvent.id}（${s.dayEvent.category}）`
        : "直前の日中イベント: なし";
      return `敵陣営と接敵。対象クラス: ${enemy?.className ?? "不明"}\n令呪: ${s.master.commandSpells}画 / 魔力: ${s.master.mana}\n${dayEventSummary}\n※宝具は1戦闘1回`;
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
  const chapterSceneKeys = {
    1: ["1_001", "1_002", "1_003", "1_004", "1_005", "1_006"],
    2: ["2_001", "2_002", "2_003", "2_004", "2_005", "2_006"],
    3: ["3_001", "3_002", "3_003", "3_004", "3_005", "3_006"],
    4: ["4_001", "4_002"],
    5: ["5_001", "5_002"],
    6: ["6_001", "6_002"],
  };
  const keys = chapterSceneKeys[chapter] || [];
  for (const key of keys) {
    if (!shown[key]) return `chapter${chapter}_main_${key.split("_")[1]}`;
  }
  return null;
}

function shouldShowChapterIntro(state) {
  return state.progress.chapterIntroShown < state.progress.chapterIndex || Boolean(getChapterContentEntryScene(state));
}

function canUseMidgameRecovery(state) {
  return state.progress.chapterIndex <= 4 && !state.flags.midgameRecoveryUsed && !state.flags.midgameRecoveryClosed;
}


const DAY_EVENT_CATEGORY_WEIGHTS = {
  common: 50,
  playerServant: 25,
  masterBuild: 15,
  enemyServant: 10,
};

const DAY_ACTION_ENCOUNTER_RATE = {
  intel: { battle: 0.5, randomCategoryBias: { common: 1.0, playerServant: 1.0, masterBuild: 1.0, enemyServant: 1.0 } },
  workshop: { battle: 0.25, randomCategoryBias: { common: 0.8, playerServant: 1.5, masterBuild: 1.7, enemyServant: 1.0 } },
  position: { battle: 0.72, randomCategoryBias: { common: 1.1, playerServant: 0.9, masterBuild: 0.8, enemyServant: 1.2 } },
};

const DAY_EVENT_OPTION_TEMPLATES = {
  common_public_praise_001: [
    { label: "支援申し出を受け入れる", apply: ["idealPoints+1", "mana+2"], resultText: "支援網を取り込み、理想点と魔力に追い風が生まれた。" },
    { label: "露出を避けて辞退する", apply: ["tacticalAdvantage+1"], resultText: "露出を抑え、夜戦向けの布陣に集中した。" },
  ],
  build_research_decode_001: [
    { label: "解析結果を看破へ回す", apply: ["intel+1"], resultText: "解析成果を即時看破へ転用した。" },
    { label: "解析結果を防御術式へ回す", apply: ["mana+5"], resultText: "工房術式の効率が上がり魔力余剰を得た。" },
  ],
  build_bloodline_vow_002: [
    { label: "契約維持の同調を優先する", apply: ["mana+5", "idealPoints+1"], resultText: "誓約術式が安定し、契約の信頼と魔力効率が同時に改善した。" },
    { label: "戦術導線へ回路を偏重する", apply: ["tacticalAdvantage+1", "hp-2"], resultText: "夜戦優位を得たが、回路負荷で体力を消耗した。" },
  ],
  build_field_network_002: [
    { label: "避難導線の再編を優先", apply: ["hp+4", "civilianDamage-1"], resultText: "現場連携が噛み合い、被害と負傷の拡大を抑え込んだ。" },
    { label: "奇襲用の経路確保を優先", apply: ["tacticalAdvantage+1", "mana-3"], resultText: "侵攻経路は確保したが、現場調整で魔力を消耗した。" },
  ],
  build_research_counterplan_002: [
    { label: "解析結果を実戦配置へ即時反映", apply: ["intel+1", "tacticalAdvantage+1"], resultText: "対策の反映が成功し、情報優位と布陣優位を確保した。" },
    { label: "解析結果を安定運用に回す", apply: ["mana+5", "idealPoints+1"], resultText: "安全側の運用へ切り替え、継戦魔力と統制評価を維持した。" },
  ],
  player_servant_pride_001: [
    { label: "共闘方針で士気を高める", apply: ["tacticalAdvantage+1", "idealPoints+1"], resultText: "連携訓練が噛み合い、戦術優位と理想の両立に成功。" },
    { label: "単独偵察を任せる", apply: ["intel+1", "civilianDamage+1"], resultText: "情報は得たが、囮行動の余波で一般被害が増えた。" },
  ],
  player_artoria_oath_crossing_001: [
    { label: "避難導線を最優先する", apply: ["civilianDamage-1", "idealPoints+1"], resultText: "「良い判断だ、マスター」騎士王は民間人の盾となった。" },
    { label: "敵指揮系統を先に断つ", apply: ["tacticalAdvantage+1", "mana-4"], resultText: "勝機は近づいたが、王の視線はどこか厳しい。" },
  ],
  player_emiya_unsung_shift_001: [
    { label: "補給と導線の整備を任せる", apply: ["mana+7"], resultText: "「英雄譚には載らないが、こういうのが効く」継戦態勢が整った。" },
    { label: "危険区画の単独偵察を命じる", apply: ["intel+1", "hp-4"], resultText: "情報は得た。だが彼のコートには新しい裂傷が増えた。" },
  ],
  player_cu_geis_checkpoint_001: [
    { label: "約定地点の救援を優先する", apply: ["idealPoints+1", "hp-3"], resultText: "「そう来ると思ったぜ」負傷と引き換えに信頼を繋いだ。" },
    { label: "主戦場の勝率を優先する", apply: ["tacticalAdvantage+1", "civilianDamage+1"], resultText: "勝ち筋は太くなったが、置き去りにした悲鳴が残った。" },
  ],
  player_medea_trust_workshop_001: [
    { label: "判断を彼女に委ねる", apply: ["mana+8"], resultText: "「ええ、では上品に片付けましょう」術式循環が洗練された。" },
    { label: "手段不問で敵術式を潰す", apply: ["intel+1", "idealPoints-1"], resultText: "成果は高い。だが魔女の微笑には温度がなかった。" },
  ],
  player_medusa_blindside_escort_001: [
    { label: "二人で追跡し、無理をさせない", apply: ["intel+1"], resultText: "「……了解」短い返答のあと、気配だけが敵の背後に現れた。" },
    { label: "魔眼圧で即時排除を優先", apply: ["tacticalAdvantage+1", "mana-5"], resultText: "接敵前に排除成功。だが封印の反動で魔力が削れた。" },
  ],
  player_kojirou_gate_bond_001: [
    { label: "正面を託し、背後を守る", apply: ["tacticalAdvantage+1"], resultText: "「背を預けるとは風流だ」門前の主導権を奪った。" },
    { label: "陽動で敵列を崩させる", apply: ["intel+1", "mana-2"], resultText: "敵の癖を見抜いたが、仕掛けの維持で魔力を消耗した。" },
  ],
  player_heracles_roar_vector_001: [
    { label: "護衛優先で抑制運用する", apply: ["hp+6"], resultText: "咆哮は壁となり、撤収路の全員が生還した。" },
    { label: "突破優先で前線を粉砕する", apply: ["tacticalAdvantage+1", "civilianDamage+1"], resultText: "戦線は割れた。代わりに市街地の損耗が増えた。" },
  ],
};

function prepareDayAction(state, actionType) {
  state.dayActionPlan = {
    actionType,
    nextMode: null,
    selectedEventId: null,
    selectedEventCategory: null,
  };

  if (actionType === "intel") {
    const intel = MASTER_BUILDS[state.master.buildType]?.情報 ?? 0;
    const intelGain = 1 + (intel > 0 ? 1 : 0);
    collectEnemyIntel(state, intelGain);
    state.master.mana = Math.min(100, state.master.mana + 6);
    state.battle.tacticalAdvantage = 0;
  }

  if (actionType === "workshop") {
    state.master.mana = Math.min(100, state.master.mana + 18);
    state.battle.tacticalAdvantage = 0;
    state.log.push("工房を整備し魔力を回復。戦闘準備を優先した。");
  }

  if (actionType === "position") {
    state.master.mana = Math.max(0, state.master.mana - 8);
    state.battle.tacticalAdvantage = 2;
    state.log.push("先制陣地を構築。夜戦に有利な位置を確保した。");
  }

  const rate = DAY_ACTION_ENCOUNTER_RATE[actionType] || DAY_ACTION_ENCOUNTER_RATE.intel;
  state.dayActionPlan.nextMode = Math.random() < rate.battle ? "battle" : "random";
}

function resolveDayEncounter(state) {
  const actionType = state.dayActionPlan?.actionType || "intel";

  if (state.dayActionPlan?.nextMode === "battle") {
    applyChapterDayEvent(state, actionType);
    runNpcFactionPhase(state);
    state.dayEvent.active = null;
    state.dayEvent.resultText = null;
  state.dayEvent.deltaSummary = null;
    state.dayActionPlan = null;
    return "nightBattle";
  }

  const event = selectDayEvent(state, actionType);
  if (!event) {
    state.log.push("日中ランダムイベント: 候補不足。通常進行へフォールバック。");
    state.dayActionPlan = null;
    return "dayAction";
  }

  const options = buildDayEventOptions(event);
  state.dayEvent.id = event.id;
  state.dayEvent.category = event.category;
  state.dayEvent.text = event.text || null;
  state.dayEvent.hasChoices = options.length > 1;
  state.dayEvent.active = {
    id: event.id,
    category: event.category,
    text: event.text || event.id,
    options,
  };
  state.dayEvent.resultText = null;
  state.dayEvent.deltaSummary = null;
  state.flags.lastDayEventId = event.id;

  state.dayActionPlan.selectedEventId = event.id;
  state.dayActionPlan.selectedEventCategory = event.category;

  state.log.push(`日中イベント発生: ${event.text || event.id}`);
  return "dayRandomEvent";
}

function buildDayEventOptions(event) {
  const template = DAY_EVENT_OPTION_TEMPLATES[event.id];
  if (template && template.length > 0) return template;

  return [
    {
      label: "対応する",
      apply: event.apply || [],
      resultText: event.log || "状況は静かに推移した。",
      oncePerRun: event.oncePerRun,
    },
  ];
}

function applyDayEventOption(state, option) {
  const deltaSummary = applyDayEventOutcome(state, option.apply || []);
  state.dayEvent.resultText = option.resultText || "変化はなかった。";
  state.dayEvent.deltaSummary = deltaSummary || null;
  if (state.dayEvent.active?.id) {
    state.flags.lastDayEventId = state.dayEvent.active.id;
  }

  const currentId = state.dayEvent.active?.id;
  const sourceEvent = currentId ? DAY_EVENTS.find((e) => e.id === currentId) : null;
  const shouldMarkOnce = Boolean(option.oncePerRun) || Boolean(sourceEvent?.oncePerRun);
  if (shouldMarkOnce && currentId) {
    state.flags.dayEventSeen = state.flags.dayEventSeen || {};
    state.flags.dayEventSeen[currentId] = true;
  }

  if (state.dayEvent.resultText) state.log.push(`日中イベント結果: ${state.dayEvent.resultText}`);
}

function selectDayEvent(state, actionType = "intel") {
  const chapter = state.progress.chapterIndex || 1;
  const candidates = DAY_EVENTS.filter((event) => {
    if (chapter < (event.minChapter || 1) || chapter > (event.maxChapter || 6)) return false;
    if (event.oncePerRun && state.flags.dayEventSeen?.[event.id]) return false;
    if (!evaluateEventConditions(state, event.requires || [])) return false;
    if ((event.excludes || []).length > 0 && evaluateEventConditions(state, event.excludes || [])) return false;
    return true;
  });

  const byCategory = {
    common: candidates.filter((e) => e.category === "common"),
    playerServant: candidates.filter((e) => e.category === "playerServant"),
    masterBuild: candidates.filter((e) => e.category === "masterBuild"),
    enemyServant: candidates.filter((e) => e.category === "enemyServant"),
  };

  const bias = DAY_ACTION_ENCOUNTER_RATE[actionType]?.randomCategoryBias || DAY_ACTION_ENCOUNTER_RATE.intel.randomCategoryBias;
  const availableCategoryWeights = {};
  for (const [category, list] of Object.entries(byCategory)) {
    if (list.length > 0) {
      availableCategoryWeights[category] = (DAY_EVENT_CATEGORY_WEIGHTS[category] || 0) * (bias[category] || 1);
    }
  }

  const selectedCategory = weightedPickByNumber(availableCategoryWeights);
  if (selectedCategory) {
    const picked = weightedPickDayEvent(byCategory[selectedCategory]);
    if (picked) return picked;
  }

  const fallback = candidates.find((e) => e.id === "common_noop_001")
    || weightedPickDayEvent(byCategory.common)
    || weightedPickDayEvent(candidates);

  if (!fallback) state.log.push("日中ランダムイベント: fallback候補が存在しない。");
  return fallback || null;
}

function weightedPickDayEvent(events) {
  if (!events || !events.length) return null;
  const weights = Object.fromEntries(events.map((event) => [event.id, Math.max(0, Number(event.weight || 0))]));
  const pickedId = weightedPickByNumber(weights);
  return events.find((event) => event.id === pickedId) || events[0];
}

function weightedPickByNumber(weightMap) {
  const entries = Object.entries(weightMap || {}).filter(([, weight]) => Number(weight) > 0);
  if (!entries.length) return null;
  const total = entries.reduce((sum, [, weight]) => sum + Number(weight), 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= Number(weight);
    if (roll <= 0) return key;
  }
  return entries[0][0];
}

function evaluateEventConditions(state, conditions) {
  return (conditions || []).every((cond) => evaluateOneCondition(state, cond));
}

function evaluateOneCondition(state, conditionRaw) {
  const condition = (conditionRaw || "").trim();
  if (!condition) return true;

  if (condition === "rescueUsed") return Boolean(state.flags.rescueUsed);
  if (condition === "playerServantKnown=true") return Boolean(state.servant.sourceName);

  const playerServantMatch = condition.match(/^playerServant=(.+)$/);
  if (playerServantMatch) return state.servant.sourceName === playerServantMatch[1];

  const enemyServantMatch = condition.match(/^enemyServant=(.+)$/);
  if (enemyServantMatch) return state.factions.some((f) => f.alive && f.trueName === enemyServantMatch[1]);

  const enemyAliveMatch = condition.match(/^enemyAlive>=(\d+)$/);
  if (enemyAliveMatch) return remainingEnemies(state) >= Number(enemyAliveMatch[1]);

  const masterBuildMatch = condition.match(/^masterBuild=(.+)$/);
  if (masterBuildMatch) return state.master.buildType === masterBuildMatch[1];

  const allianceMatch = condition.match(/^allianceState=(.+)$/);
  if (allianceMatch) return state.flags.allianceState === allianceMatch[1];

  return false;
}

function applyDayEventOutcome(state, effects) {
  const before = {
    intel: state.flags.trueNameExposure,
    mana: state.master.mana,
    hp: state.master.hp,
    idealPoints: state.flags.idealPoints,
    civilianDamage: state.flags.civilianDamage,
    tacticalAdvantage: state.battle.tacticalAdvantage,
    allianceState: state.flags.allianceState,
  };

  for (const token of effects || []) {
    const effect = (token || "").trim();
    if (!effect) continue;

    if (effect.startsWith("allianceState=")) {
      state.flags.allianceState = effect.split("=")[1] || state.flags.allianceState;
      continue;
    }

    const match = effect.match(/^(intel|mana|hp|idealPoints|civilianDamage|tacticalAdvantage)([+-])(\d+)$/);
    if (!match) continue;

    const [, key, op, valueText] = match;
    const value = Number(valueText);
    const delta = op === "+" ? value : -value;

    if (key === "intel") {
      state.flags.trueNameExposure = clamp(state.flags.trueNameExposure + delta, 0, 3);
      continue;
    }
    if (key === "mana") {
      state.master.mana = clamp(state.master.mana + delta, 0, 100);
      continue;
    }
    if (key === "hp") {
      state.master.hp = clamp(state.master.hp + delta, 0, 100);
      continue;
    }
    if (key === "idealPoints") {
      state.flags.idealPoints = Math.max(0, state.flags.idealPoints + delta);
      continue;
    }
    if (key === "civilianDamage") {
      state.flags.civilianDamage = Math.max(0, state.flags.civilianDamage + delta);
      continue;
    }
    if (key === "tacticalAdvantage") {
      state.battle.tacticalAdvantage = Math.max(0, state.battle.tacticalAdvantage + delta);
    }
  }

  const after = {
    intel: state.flags.trueNameExposure,
    mana: state.master.mana,
    hp: state.master.hp,
    idealPoints: state.flags.idealPoints,
    civilianDamage: state.flags.civilianDamage,
    tacticalAdvantage: state.battle.tacticalAdvantage,
    allianceState: state.flags.allianceState,
  };

  const diffParts = [];
  const pushNumDiff = (label, beforeVal, afterVal) => {
    const diff = afterVal - beforeVal;
    if (diff === 0) return;
    const sign = diff > 0 ? "+" : "";
    diffParts.push(`${label}${sign}${diff}`);
  };

  pushNumDiff("看破", before.intel, after.intel);
  pushNumDiff("魔力", before.mana, after.mana);
  pushNumDiff("HP", before.hp, after.hp);
  pushNumDiff("理想", before.idealPoints, after.idealPoints);
  pushNumDiff("被害", before.civilianDamage, after.civilianDamage);
  pushNumDiff("布陣", before.tacticalAdvantage, after.tacticalAdvantage);

  if (before.allianceState !== after.allianceState) {
    diffParts.push(`同盟:${before.allianceState}→${after.allianceState}`);
  }

  if (!diffParts.length) return null;
  const summary = `変動: ${diffParts.join(" / ")}`;
  state.log.push(`日中イベント変動: ${summary}`);
  return summary;
}


function applyChapterDayEvent(state, actionType) {
  const chapter = state.progress.chapterIndex;
  if (chapter === 2 && actionType === "intel") {
    state.flags.allianceState = Math.random() < 0.65 ? "allied" : "none";
    if (state.flags.allianceState === "allied") {
      state.flags.idealPoints += 1;
      state.log.push("交渉が実り、同盟線を確保。理想点+1。");
    } else {
      state.log.push("交渉は決裂。翌日以降の連戦リスクが増す。");
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

  if (chapter === 5) {
    if (actionType === "intel") {
      const prev = state.flags.trueNameExposure;
      state.flags.trueNameExposure = Math.min(3, state.flags.trueNameExposure + 1);
      if (state.flags.trueNameExposure > prev) {
        state.log.push("露見局面の情報戦が進行。真名看破進行+1。");
      }
    }
    if (actionType === "workshop") {
      state.master.commandSpells = Math.max(0, state.master.commandSpells - 1);
      state.master.mana = Math.min(100, state.master.mana + 8);
      state.log.push("終盤の継戦を優先し令呪を消費。令呪-1 / 魔力+8。");
    }
    if (actionType === "position") {
      state.battle.tacticalAdvantage += 1;
      state.flags.civilianDamage += 1;
      state.log.push("強行配置で決戦有利を確保。夜戦補正+1 / 一般被害+1。");
    }
  }

  if (chapter === 6) {
    if (actionType === "intel") {
      if (state.flags.trueNameExposure >= 2) {
        state.flags.idealPoints += 1;
        state.log.push("最終局面の被害抑止策を優先。理想点+1。");
      } else {
        state.flags.trueNameExposure = Math.min(3, state.flags.trueNameExposure + 1);
        state.log.push("終章の追加偵察で看破を進展。真名看破進行+1。");
      }
    }
    if (actionType === "workshop") {
      state.master.mana = Math.min(100, state.master.mana + 10);
      state.flags.idealPoints = Math.max(0, state.flags.idealPoints - 1);
      state.log.push("決戦準備を優先し現実策へ転換。魔力+10 / 理想点-1。");
    }
    if (actionType === "position") {
      state.battle.tacticalAdvantage += 1;
      state.log.push("聖杯戦終局の布陣を固定。夜戦補正+1。");
    }
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
