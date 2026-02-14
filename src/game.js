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
  sceneDayPhase: document.querySelector("#scene-dayphase"),
  sceneText: document.querySelector("#scene-text"),
  enemyIntelPanel: document.querySelector("#enemy-intel-panel"),
  enemyIntelText: document.querySelector("#enemy-intel-text"),
  choices: document.querySelector("#choices"),
  battleLog: document.querySelector("#battle-log"),
  restartButton: document.querySelector("#restart-button"),
  autoplayToggle: document.querySelector("#autoplay-toggle"),
  readSkipToggle: document.querySelector("#read-skip-toggle"),
  saveStatus: document.querySelector("#save-status"),
  saveSlot1: document.querySelector("#save-slot-1"),
  saveSlot2: document.querySelector("#save-slot-2"),
  saveSlot3: document.querySelector("#save-slot-3"),
  loadSlot1: document.querySelector("#load-slot-1"),
  loadSlot2: document.querySelector("#load-slot-2"),
  loadSlot3: document.querySelector("#load-slot-3"),
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

const SAVE_VERSION = 1;
const SAVE_KEY_PREFIX = "grandorder_save_slot_";

let store = createStore(INITIAL_STATE);
let currentSceneId = "title";
let activeSheetTab = "overview";
let readSkipMode = "off";
let readSkipTimer = null;

let autoplayTimer = null;
let autoplayRunning = false;

store.update((draft) => {
  draft.flags = draft.flags || {};
  draft.flags.readScenes = draft.flags.readScenes || {};
});

if (dom.autoplayToggle) {
  dom.autoplayToggle.addEventListener("click", () => {
    if (autoplayRunning) stopAutoplay();
    else startAutoplay();
  });
}


if (dom.readSkipToggle) {
  dom.readSkipToggle.addEventListener("click", () => {
    readSkipMode = readSkipMode === "off" ? "normal" : readSkipMode === "normal" ? "fast" : "off";
    updateReadSkipUi();
    scheduleReadSkipIfNeeded();
  });
}

[1, 2, 3].forEach((slot) => {
  const saveBtn = dom[`saveSlot${slot}`];
  const loadBtn = dom[`loadSlot${slot}`];
  if (saveBtn) saveBtn.addEventListener("click", () => saveToSlot(slot));
  if (loadBtn) loadBtn.addEventListener("click", () => loadFromSlot(slot));
});

if (dom.restartButton) {
  dom.restartButton.addEventListener("click", () => {
    stopAutoplay();
    clearReadSkipTimer();
    store.reset();
    currentSceneId = "title";
    render();
  });
}

if (dom.openServantSheet && dom.servantSheet) {
  dom.openServantSheet.addEventListener("click", () => {
    dom.servantSheet.classList.add("open");
    dom.servantSheet.setAttribute("aria-hidden", "false");
    renderServantSheet(store.getState());
  });
}

if (dom.closeServantSheet) dom.closeServantSheet.addEventListener("click", closeServantSheet);

if (dom.servantSheet) {
  dom.servantSheet.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.closeSheet === "true") {
      closeServantSheet();
    }
  });
}

dom.sheetTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activeSheetTab = tab.dataset.tab || "overview";
    updateSheetTabs();
  });
});

render();
updateReadSkipUi();
refreshSaveStatus();


function startAutoplay() {
  if (autoplayRunning) return;
  autoplayRunning = true;
  updateAutoplayUi();

  autoplayTimer = setInterval(() => {
    const stepped = runAutoplayStep();
    if (!stepped) {
      stopAutoplay();
      return;
    }

    const state = store.getState();
    if (["endingJudge", "gameOver"].includes(currentSceneId) || state.flags.endingType) {
      stopAutoplay();
    }
  }, 120);
}

function stopAutoplay() {
  autoplayRunning = false;
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
  updateAutoplayUi();
}

function runAutoplayStep() {
  const scene = SCENES[currentSceneId];
  if (!scene || !scene.choices?.length) return false;

  const choice = scene.choices[Math.floor(Math.random() * scene.choices.length)];
  store.update((draft) => {
    if (choice.effect) choice.effect(draft);
  });

  currentSceneId = typeof choice.next === "function" ? choice.next(store.getState()) : choice.next;
  if (currentSceneId === "title") {
    store.reset();
  }
  render();
  return true;
}

function updateAutoplayUi() {
  if (!dom.autoplayToggle) return;
  dom.autoplayToggle.textContent = `Debug自動プレイ: ${autoplayRunning ? "ON" : "OFF"}`;
  dom.autoplayToggle.classList.toggle("autoplay-running", autoplayRunning);
}


function clearReadSkipTimer() {
  if (readSkipTimer) {
    clearTimeout(readSkipTimer);
    readSkipTimer = null;
  }
}

function updateReadSkipUi() {
  if (!dom.readSkipToggle) return;
  if (readSkipMode === "off") dom.readSkipToggle.textContent = "既読スキップ: OFF（等速）";
  if (readSkipMode === "normal") dom.readSkipToggle.textContent = "既読スキップ: ON（等速）";
  if (readSkipMode === "fast") dom.readSkipToggle.textContent = "既読スキップ: ON（高速）";
}

function scheduleReadSkipIfNeeded() {
  clearReadSkipTimer();
  if (readSkipMode === "off") return;
  const state = store.getState();
  const scene = SCENES[currentSceneId];
  if (!scene || !scene.choices?.length) return;
  if (scene.choices.length !== 1) return;

  const readScenes = state.flags.readScenes || {};
  if (!readScenes[currentSceneId]) return;

  const delay = readSkipMode === "fast" ? 80 : 320;
  readSkipTimer = setTimeout(() => {
    const btn = dom.choices.querySelector("button");
    if (btn) btn.click();
  }, delay);
}

function formatSaveState(payload) {
  if (!payload) return "空";
  return `Day${payload.state.day} / ${payload.sceneId} / 令呪${payload.state.master.commandSpells}画`;
}

function refreshSaveStatus(message) {
  if (!dom.saveStatus) return;
  if (message) {
    dom.saveStatus.textContent = message;
    return;
  }
  const summaries = [1, 2, 3].map((slot) => {
    const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
    if (!raw) return `S${slot}:空`;
    try {
      const parsed = JSON.parse(raw);
      if (parsed.version !== SAVE_VERSION) return `S${slot}:旧ver`;
      return `S${slot}:保存済`;
    } catch {
      return `S${slot}:破損`;
    }
  });
  dom.saveStatus.textContent = summaries.join(" / ");
}

function saveToSlot(slot) {
  const payload = {
    version: SAVE_VERSION,
    savedAt: new Date().toISOString(),
    sceneId: currentSceneId,
    readSkipMode,
    state: structuredClone(store.getState()),
  };
  localStorage.setItem(`${SAVE_KEY_PREFIX}${slot}`, JSON.stringify(payload));
  refreshSaveStatus(`SLOT ${slot} に保存: ${formatSaveState(payload)}`);
}

function loadFromSlot(slot) {
  const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slot}`);
  if (!raw) {
    refreshSaveStatus(`SLOT ${slot} は空です。`);
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    refreshSaveStatus(`SLOT ${slot} のデータが破損しています。`);
    return;
  }

  if (parsed.version !== SAVE_VERSION) {
    refreshSaveStatus(`SLOT ${slot} は互換外データです（ver ${parsed.version ?? "?"}）。`);
    return;
  }

  store = createStore(INITIAL_STATE);
  store.update((draft) => {
    Object.assign(draft, structuredClone(parsed.state));
    draft.flags = draft.flags || {};
    draft.flags.readScenes = draft.flags.readScenes || {};
  });
  currentSceneId = parsed.sceneId || "title";
  readSkipMode = parsed.readSkipMode || "off";
  updateReadSkipUi();
  render();
  refreshSaveStatus(`SLOT ${slot} から読込: ${formatSaveState(parsed)}`);
}

function createStore(initial) {
  let state = structuredClone(initial);
  return {
    getState: () => state,
    update(updater) {
      updater(state);
    },
    reset() {
      state = structuredClone(initial);
      state.flags = state.flags || {};
      state.flags.readScenes = {};
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
  if (dom.servantSheet?.classList.contains("open")) renderServantSheet(state);
  scheduleReadSkipIfNeeded();
}

function renderMeter(value, max, type) {
  const safeMax = Math.max(1, max || 100);
  const safeValue = floorClamp(Math.max(0, value));
  const ratio = Math.max(0, Math.min(100, (safeValue / safeMax) * 100));
  return `<div class="meter-row"><span>${safeValue} / ${safeMax}</span><span>${Math.round(ratio)}%</span></div><div class="meter-track"><div class="meter-fill ${type}" style="width:${ratio}%"></div></div>`;
}

function paramRank(value) {
  if (value >= 5) return "A";
  if (value >= 4) return "B";
  if (value >= 3) return "C";
  if (value >= 2) return "D";
  return "E";
}

function renderParamGrid(params) {
  const labels = ["筋力", "耐久", "敏捷", "魔力", "幸運", "宝具"];
  return labels
    .map((key) => {
      const value = floorClamp(params[key] || 0);
      const width = Math.max(8, Math.min(100, value * 20));
      return `<div class="param-row"><span>${key}</span><span class="rank">${paramRank(value)}</span><span class="param-bar"><span class="param-bar-fill" style="width:${width}%"></span></span></div>`;
    })
    .join("");
}

function renderStatus(state) {
  dom.day.textContent = `${state.day}日目`;
  dom.phase.textContent = state.phase;
  dom.masterHp.innerHTML = renderMeter(state.master.hp, 100, "hp");
  dom.masterMana.innerHTML = renderMeter(state.master.mana, 100, "mana");
  dom.masterBuild.textContent = state.master.buildType || "未選択";
  dom.commandSpells.textContent = `${state.master.commandSpells}画`;

  dom.servantClass.textContent = state.servant.className;
  const p = state.servant.params;
  dom.servantParams.innerHTML = renderParamGrid(p);

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
  if (dom.sceneDayPhase) dom.sceneDayPhase.textContent = `${state.day}日目`;
  state.phase = scene.phase;

  const text = typeof scene.text === "function" ? scene.text(state) : scene.text;
  dom.sceneText.textContent = text;

  dom.choices.innerHTML = "";
  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      clearReadSkipTimer();
      const prevSceneId = currentSceneId;
      store.update((draft) => {
        draft.flags.readScenes = draft.flags.readScenes || {};
        draft.flags.readScenes[prevSceneId] = true;
        if (choice.effect) choice.effect(draft);
      });
      currentSceneId = typeof choice.next === "function" ? choice.next(store.getState()) : choice.next;
      if (currentSceneId === "title") {
        stopAutoplay();
        store.reset();
      }
      render();
    });
    dom.choices.appendChild(button);
  });
}

function renderLog(state) {
  const nearBottom = dom.battleLog.scrollHeight - dom.battleLog.scrollTop - dom.battleLog.clientHeight < 24;
  dom.battleLog.innerHTML = "";
  state.log.slice(-24).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    if (entry.includes("敗北") || entry.includes("失敗") || entry.includes("反撃")) {
      li.classList.add("critical");
    }
    dom.battleLog.appendChild(li);
  });
  if (nearBottom || dom.battleLog.scrollTop === 0) {
    dom.battleLog.scrollTop = dom.battleLog.scrollHeight;
  }
}

function closeServantSheet() {
  if (!dom.servantSheet) return;
  dom.servantSheet.classList.remove("open");
  dom.servantSheet.setAttribute("aria-hidden", "true");
}

function updateSheetTabs() {
  if (!dom.sheetTabs.length) return;
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
  if (!dom.sheetClass || !dom.sheetMaster || !dom.sheetTrueName || !dom.sheetAlignment || !dom.sheetStats || !dom.sheetClassAbilities || !dom.sheetSkills || !dom.sheetNpName || !dom.sheetNpRank || !dom.sheetNpDesc) return;
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
  if (!dom.enemyIntelPanel || !dom.enemyIntelText) return;
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
