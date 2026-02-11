export const INITIAL_STATE = {
  day: 1,
  masterHp: 100,
  servantHp: 100,
  servantStats: {
    筋力: 3,
    耐久: 4,
    敏捷: 3,
    魔力: 5,
    幸運: 2,
    宝具: 4,
  },
  flags: {
    trueNameExposed: false,
    usedNoblePhantasm: false,
    canResummon: false,
    allyTrust: 0,
  },
  log: ["聖杯戦争、開幕。"],
};

export const SCENES = {
  title: {
    phase: "導入",
    title: "契約の夜",
    text: "深夜、魔法陣が脈動し、サーヴァントが現界する。\n『我が真名は明かせぬ。勝利まで主従として戦おう』",
    choices: [
      {
        label: "真名を問わず、即座に同盟を誓う",
        effect: (state) => {
          state.flags.allyTrust += 1;
          state.log.push("サーヴァントとの信頼が高まった。");
        },
        next: "dayAction",
      },
      {
        label: "真名を執拗に追及する",
        effect: (state) => {
          state.flags.trueNameExposed = true;
          state.log.push("真名秘匿が破られた。敵に弱点を悟られる危険が増す。");
        },
        next: "dayAction",
      },
    ],
  },
  dayAction: {
    phase: "昼",
    title: "情報戦",
    text: "昼の市街。あなたは行動を決断する。\n夜戦に備えるか、敵マスターを探るか。",
    choices: [
      {
        label: "工房で魔力補給と防御結界の再調整",
        effect: (state) => {
          state.masterHp = Math.min(100, state.masterHp + 10);
          state.log.push("防御結界を強化。マスターHPが回復した。");
        },
        next: "nightBattle",
      },
      {
        label: "敵の拠点を偵察し、先手を狙う",
        effect: (state) => {
          state.flags.allyTrust += 1;
          state.log.push("偵察成功。奇襲の機会を得た。");
        },
        next: "nightBattle",
      },
    ],
  },
  nightBattle: {
    phase: "夜戦",
    title: "邂逅、火花",
    text: "夜の高架橋で敵陣営と接敵。\n宝具を切るか、堅実に立ち回るか――。",
    choices: [
      {
        label: "宝具を解放して一気に決める",
        effect: (state) => {
          const outcome = runBattle(state, true);
          state.log.push(outcome.message);
        },
        next: (state) => resolvePostBattleScene(state),
      },
      {
        label: "スキル連携で堅実に削る",
        effect: (state) => {
          const outcome = runBattle(state, false);
          state.log.push(outcome.message);
        },
        next: (state) => resolvePostBattleScene(state),
      },
    ],
  },
  resummon: {
    phase: "転機",
    title: "再契約の機会",
    text: "サーヴァントは消滅した。しかし令呪に残る微かな縁が、新たな契約を許す。",
    choices: [
      {
        label: "再召喚を行う（最後の賭け）",
        effect: (state) => {
          state.servantHp = 70;
          state.flags.canResummon = false;
          state.log.push("新たなサーヴァントと再契約した。戦線復帰。");
        },
        next: "climax",
      },
      {
        label: "単独で撤退し、戦略を練り直す",
        effect: (state) => {
          state.masterHp -= 20;
          state.log.push("撤退には成功したが、追撃を受け負傷した。");
        },
        next: (state) => (state.masterHp <= 0 ? "gameOver" : "climax"),
      },
    ],
  },
  climax: {
    phase: "終局",
    title: "最後の聖杯問答",
    text: "残る陣営は二つ。あなたの選択が勝敗だけでなく、願いの価値を決める。",
    choices: [
      {
        label: "市街地被害を抑えつつ、敵マスターを無力化",
        effect: (state) => {
          const score = evaluateFinal(state) + 1;
          state.flags.endingScore = score;
          state.log.push("理性を保った戦いを選んだ。");
        },
        next: "ending",
      },
      {
        label: "短期決戦で敵サーヴァントを討ち取る",
        effect: (state) => {
          const score = evaluateFinal(state);
          state.flags.endingScore = score;
          state.log.push("勝利優先の苛烈な選択を取った。");
        },
        next: "ending",
      },
    ],
  },
  ending: {
    phase: "結末",
    title: "聖杯の審判",
    text: (state) => {
      const score = state.flags.endingScore ?? 0;
      if (score >= 4) {
        return "あなたは聖杯戦争を制し、願いを叶える資格を得た。\nだが真名秘匿を守った者だけが知る代償を胸に、夜明けを見上げる。";
      }
      return "あなたは最終局面で敗れ、聖杯は遠のいた。\nそれでも選択の記憶は、次の戦いへの意志として残る。";
    },
    choices: [
      {
        label: "もう一度、聖杯戦争に挑む",
        next: "title",
      },
    ],
  },
  gameOver: {
    phase: "敗北",
    title: "マスター死亡",
    text: "魔力回路が断たれ、契約は霧散する。\nマスター死亡により、この聖杯戦争はここで終わる。",
    choices: [
      {
        label: "タイトルへ戻る",
        next: "title",
      },
    ],
  },
};

function runBattle(state, useNoblePhantasm) {
  const enemyPower = 8 + randomInt(0, 6) + (state.flags.trueNameExposed ? 2 : 0);
  const servantBase =
    state.servantStats.筋力 +
    state.servantStats.敏捷 +
    state.servantStats.耐久 +
    state.flags.allyTrust;

  let playerPower = servantBase + randomInt(0, 6);
  if (useNoblePhantasm && !state.flags.usedNoblePhantasm) {
    playerPower += state.servantStats.宝具 + 4;
    state.flags.usedNoblePhantasm = true;
  }

  if (useNoblePhantasm && state.flags.usedNoblePhantasm && playerPower < enemyPower) {
    state.masterHp -= 15;
  }

  if (playerPower >= enemyPower) {
    state.log.push(`判定成功（${playerPower} vs ${enemyPower}）。`);
    state.day += 1;
    return { result: "win", message: "夜戦に勝利し、敵陣営を後退させた。" };
  }

  const dmgToMaster = randomInt(12, 24);
  const dmgToServant = randomInt(28, 42);
  state.masterHp -= dmgToMaster;
  state.servantHp -= dmgToServant;
  if (state.servantHp <= 0) {
    state.flags.canResummon = true;
  }
  state.log.push(`判定失敗（${playerPower} vs ${enemyPower}）。`);
  return { result: "lose", message: "敵の反撃を受け、戦線が崩れた。" };
}

function resolvePostBattleScene(state) {
  if (state.masterHp <= 0) {
    return "gameOver";
  }
  if (state.servantHp <= 0 && state.flags.canResummon) {
    return "resummon";
  }
  return "climax";
}

function evaluateFinal(state) {
  let score = 0;
  if (state.masterHp > 35) score += 1;
  if (state.servantHp > 0) score += 1;
  if (!state.flags.trueNameExposed) score += 1;
  if (state.flags.usedNoblePhantasm) score += 1;
  return score;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
