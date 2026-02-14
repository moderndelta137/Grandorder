import { INITIAL_STATE, SCENES, SERVANT_PROFILES } from "./scenario.js";
import { ENEMY_INTEL_RULES } from "./data/generatedData.js";

const dom = {
  day: document.querySelector("#status-day"),
  phase: document.querySelector("#status-phase"),
  masterHp: document.querySelector("#status-master-hp"),
  masterMana: document.querySelector("#status-master-mana"),
  masterBuild: document.querySelector("#status-master-build"),
  commandSpells: document.querySelector("#status-command-spells"),
  servantClass: document.querySelector("#status-servant-class"),
  servantParams: document.querySelector("#status-servant-params"),
  catalyst: document.querySelector("#status-catalyst"),
  trueName: document.querySelector("#status-true-name"),
  exposure: document.querySelector("#status-exposure"),
  enemies: document.querySelector("#status-enemies"),
  rescue: document.querySelector("#status-rescue"),
  ending: document.querySelector("#status-ending"),
  scenePhase: document.querySelector("#scene-phase"),
  sceneTitle: document.querySelector("#scene-title"),
  sceneText: document.querySelector("#scene-text"),
  enemyIntelPanel: document.querySelector("#enemy-intel-panel"),
  enemyIntelText: document.querySelector("#enemy-intel-text"),
  choices: document.querySelector("#choices"),
  battleLog: document.querySelector("#battle-log"),
  restartButton: document.querySelector("#restart-button"),
  openServantSheet: document.querySelector("#open-servant-sheet"),
  servantSheet: document.querySelector("#servant-sheet"),
  closeServantSheet: document.querySelector("#close-servant-sheet"),
  sheetTabs: document.querySelectorAll(".sheet-tab"),
  sheetClass: document.querySelector("#sheet-class"),
  sheetMaster: document.querySelector("#sheet-master"),
  sheetTrueName: document.querySelector("#sheet-true-name"),
  sheetAlignment: document.querySelector("#sheet-alignment"),
  sheetStats: document.querySelector("#sheet-stats"),
  sheetClassAbilities: document.querySelector("#sheet-class-abilities"),
  sheetSkills: document.querySelector("#sheet-skills"),
  sheetNpName: document.querySelector("#sheet-np-name"),
  sheetNpRank: document.querySelector("#sheet-np-rank"),
  sheetNpDesc: document.querySelector("#sheet-np-desc"),
};

let store = createStore(INITIAL_STATE);
let currentSceneId = "title";
let activeSheetTab = "overview";

dom.restartButton.addEventListener("click", () => {
  store.reset();
  currentSceneId = "title";
  render();
});

dom.openServantSheet.addEventListener("click", () => {
  dom.servantSheet.classList.add("open");
  dom.servantSheet.setAttribute("aria-hidden", "false");
  renderServantSheet(store.getState());
});

dom.closeServantSheet.addEventListener("click", closeServantSheet);

dom.servantSheet.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.dataset.closeSheet === "true") {
    closeServantSheet();
  }
});

dom.sheetTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeSheetTab = tab.dataset.tab || "overview";
    updateSheetTabs();
  });
});

render();

function createStore(initial) {
  let state = structuredClone(initial);
  return {
    getState: () => state,
    update(updater) {
      updater(state);
    },
    reset() {
      state = structuredClone(initial);
    },
  };
}

function render() {
  const state = store.getState();
  const scene = SCENES[currentSceneId];

  if (!scene) {
    dom.sceneTitle.textContent = "シーンエラー";
    dom.sceneText.textContent = `未定義のシーン: ${currentSceneId}`;
    dom.choices.innerHTML = "";
    return;
  }

  renderStatus(state);
  renderScene(state, scene);
  renderLog(state);
  renderEnemyIntel(state, currentSceneId);
  if (dom.servantSheet.classList.contains("open")) renderServantSheet(state);
}

function renderStatus(state) {
  dom.day.textContent = `${state.day}日目`;
  dom.phase.textContent = state.phase;
  dom.masterHp.textContent = floorClamp(state.master.hp);
  dom.masterMana.textContent = floorClamp(state.master.mana);
  dom.masterBuild.textContent = state.master.buildType || "未選択";
  dom.commandSpells.textContent = `${state.master.commandSpells}画`;

  dom.servantClass.textContent = state.servant.className;
  const p = state.servant.params;
  dom.servantParams.textContent = `${p.筋力}/${p.耐久}/${p.敏捷} | ${p.魔力}/${p.幸運}/${p.宝具}`;

  dom.catalyst.textContent = state.summon.catalyst || "未選択";
  dom.trueName.textContent = state.servant.trueNameRevealed ? "露見" : "秘匿";
  dom.exposure.textContent = `${state.flags.trueNameExposure} / 3`;
  dom.enemies.textContent = String(state.factions.filter((f) => f.alive).length);
  dom.rescue.textContent = state.flags.rescueUsed ? "使用済み" : "未使用";
  dom.ending.textContent = state.flags.endingType || "未判定";
}

function renderScene(state, scene) {
  dom.scenePhase.textContent = scene.phase;
  dom.sceneTitle.textContent = scene.title;
  state.phase = scene.phase;

  const text = typeof scene.text === "function" ? scene.text(state) : scene.text;
  dom.sceneText.textContent = text;

  dom.choices.innerHTML = "";
  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      store.update((draft) => {
        if (choice.effect) choice.effect(draft);
      });
      currentSceneId = typeof choice.next === "function" ? choice.next(store.getState()) : choice.next;
      if (currentSceneId === "title") {
        store.reset();
      }
      render();
    });
    dom.choices.appendChild(button);
  });
}

function renderLog(state) {
  dom.battleLog.innerHTML = "";
  state.log.slice(-24).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    if (entry.includes("敗北") || entry.includes("失敗") || entry.includes("反撃")) {
      li.classList.add("critical");
    }
    dom.battleLog.appendChild(li);
  });
}

function closeServantSheet() {
  dom.servantSheet.classList.remove("open");
  dom.servantSheet.setAttribute("aria-hidden", "true");
}

function updateSheetTabs() {
  dom.sheetTabs.forEach((tab) => {
    const isActive = tab.dataset.tab === activeSheetTab;
    tab.classList.toggle("active", isActive);
  });

  ["overview", "skills", "np"].forEach((tabName) => {
    const panel = document.querySelector(`#sheet-tab-${tabName}`);
    if (!panel) return;
    panel.classList.toggle("active", tabName === activeSheetTab);
  });
}

function renderServantSheet(state) {
  const profile = SERVANT_PROFILES[state.servant.sourceName] || null;
  const p = state.servant.params;

  dom.sheetClass.textContent = state.servant.className || "未契約";
  dom.sheetMaster.textContent = state.master.name || "名無しの魔術師";
  dom.sheetTrueName.textContent = state.servant.trueNameRevealed ? state.servant.sourceName || "不明" : "？？？（秘匿）";
  dom.sheetAlignment.textContent = profile?.alignment || "不明";

  const statLabels = ["筋力", "耐久", "敏捷", "魔力", "幸運", "宝具"];
  dom.sheetStats.innerHTML = "";
  statLabels.forEach((key) => {
    const value = p[key] || 0;
    const row = document.createElement("div");
    row.className = "sheet-stat";
    row.innerHTML = `<span>${key}</span><div class="sheet-bar"><i style="width:${Math.max(0, Math.min(100, value * 20))}%"></i></div><strong>${toParamRank(value)}</strong>`;
    dom.sheetStats.appendChild(row);
  });

  dom.sheetClassAbilities.innerHTML = "";
  (profile?.classAbilities || []).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<h4>${item.name} : ${item.rank}</h4><p>${item.desc}</p>`;
    dom.sheetClassAbilities.appendChild(li);
  });
  if (!dom.sheetClassAbilities.children.length) {
    dom.sheetClassAbilities.innerHTML = "<li><p>契約成立後にクラス能力が表示されます。</p></li>";
  }

  dom.sheetSkills.innerHTML = "";
  (profile?.skills || []).forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<h4>${item.name}</h4><p>${item.desc}</p>`;
    dom.sheetSkills.appendChild(li);
  });
  if (!dom.sheetSkills.children.length) {
    dom.sheetSkills.innerHTML = "<li><p>契約成立後に固有スキルが表示されます。</p></li>";
  }

  dom.sheetNpName.textContent = profile?.noblePhantasm?.name || "未確認";
  dom.sheetNpRank.textContent = profile?.noblePhantasm?.rank ? `ランク: ${profile.noblePhantasm.rank}` : "ランク: -";
  dom.sheetNpDesc.textContent = profile?.noblePhantasm?.desc || "契約成立後に宝具情報が表示されます。";

  updateSheetTabs();
}

function toParamRank(value) {
  const map = { 5: "A", 4: "B", 3: "C", 2: "D", 1: "E", 0: "-" };
  return map[Math.max(0, Math.min(5, Math.floor(value)))] || "-";
}

function floorClamp(value) {
  return Math.max(0, Math.floor(value));
}


function renderEnemyIntel(state, sceneId) {
  const visibleScenes = new Set(["nightBattle", "finalBattle"]);
  if (!visibleScenes.has(sceneId)) {
    dom.enemyIntelPanel.classList.add("hidden");
    return;
  }

  const enemy = state.factions.find((f) => f.id === state.battle.currentEnemyId && f.alive) || null;
  if (!enemy) {
    dom.enemyIntelPanel.classList.remove("hidden");
    dom.enemyIntelText.textContent = "敵情報なし";
    return;
  }

  dom.enemyIntelPanel.classList.remove("hidden");
  dom.enemyIntelText.textContent = buildEnemyIntelText(enemy);
}

function buildEnemyIntelText(enemy) {
  const intelLevel = enemy.intel?.level || 0;
  const statOrder = ["筋力", "耐久", "敏捷", "魔力", "幸運", "宝具"];
  const rule = ENEMY_INTEL_RULES.find((r) => r.level === intelLevel) || ENEMY_INTEL_RULES[0] || { revealStatsCount: 0, revealSkillCount: 0, revealTrueName: 0, revealNpType: 0, revealNpName: 0 };
  const statRevealCount = rule.revealStatsCount;

  const stats = statOrder
    .map((key, idx) => `${key}: ${idx < statRevealCount ? toParamRank(enemy.params?.[key] || 0) : "???"}`)
    .join(" / ");

  const skillBaseCount = rule.revealSkillCount;
  const seenSkills = enemy.intel?.seenSkills || [];
  const knownSkills = [...new Set([...(enemy.skills || []).slice(0, skillBaseCount), ...seenSkills])];
  const skillText = knownSkills.length ? knownSkills.join("、") : "???";

  const npTypeKnown = Boolean(rule.revealNpType) || enemy.intel?.npSeen;
  const npNameKnown = Boolean(rule.revealNpName) || enemy.intel?.npSeen;
  const trueNameKnown = Boolean(rule.revealTrueName);

  return [
    `対象クラス: ${enemy.className}`,
    `真名: ${trueNameKnown ? enemy.trueName : "???"}`,
    `ステータス: ${stats}`,
    `確認スキル: ${skillText}`,
    `宝具種別: ${npTypeKnown ? enemy.npType : "???"}`,
    `宝具名: ${npNameKnown ? enemy.npName : "???"}`,
    `看破Lv: ${intelLevel} / 4`,
  ].join("\n");
}
