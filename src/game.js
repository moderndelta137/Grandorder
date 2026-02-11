import { INITIAL_STATE, SCENES } from "./scenario.js";

const dom = {
  day: document.querySelector("#status-day"),
  masterHp: document.querySelector("#status-master-hp"),
  servantHp: document.querySelector("#status-servant-hp"),
  strDurAgi: document.querySelector("#status-str-dur-agi"),
  manaLuckNp: document.querySelector("#status-mana-luck-np"),
  trueName: document.querySelector("#status-true-name"),
  scenePhase: document.querySelector("#scene-phase"),
  sceneTitle: document.querySelector("#scene-title"),
  sceneText: document.querySelector("#scene-text"),
  choices: document.querySelector("#choices"),
  battleLog: document.querySelector("#battle-log"),
  restartButton: document.querySelector("#restart-button"),
};

let state = newState();
let currentSceneId = "title";

dom.restartButton.addEventListener("click", () => {
  state = newState();
  currentSceneId = "title";
  render();
});

render();

function render() {
  const scene = SCENES[currentSceneId];
  if (!scene) {
    dom.sceneTitle.textContent = "シーンエラー";
    dom.sceneText.textContent = `未定義のシーン: ${currentSceneId}`;
    dom.choices.innerHTML = "";
    return;
  }

  renderStatus();
  renderScene(scene);
  renderLog();
}

function renderStatus() {
  dom.day.textContent = `${state.day}日目`;
  dom.masterHp.textContent = clampFloor(state.masterHp);
  dom.servantHp.textContent = clampFloor(state.servantHp);

  const stats = state.servantStats;
  dom.strDurAgi.textContent = `${stats.筋力} / ${stats.耐久} / ${stats.敏捷}`;
  dom.manaLuckNp.textContent = `${stats.魔力} / ${stats.幸運} / ${stats.宝具}`;
  dom.trueName.textContent = state.flags.trueNameExposed ? "露見" : "維持";
}

function renderScene(scene) {
  dom.scenePhase.textContent = scene.phase;
  dom.sceneTitle.textContent = scene.title;

  const text = typeof scene.text === "function" ? scene.text(state) : scene.text;
  dom.sceneText.textContent = text;

  dom.choices.innerHTML = "";
  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;

    button.addEventListener("click", () => {
      if (choice.effect) {
        choice.effect(state);
      }
      state.masterHp = clampFloor(state.masterHp);
      state.servantHp = clampFloor(state.servantHp);
      currentSceneId = typeof choice.next === "function" ? choice.next(state) : choice.next;

      if (currentSceneId === "title") {
        state = newState();
      }

      render();
    });

    dom.choices.appendChild(button);
  });
}

function renderLog() {
  dom.battleLog.innerHTML = "";
  state.log.slice(-18).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    if (entry.includes("失敗") || entry.includes("死亡")) {
      li.classList.add("critical");
    }
    dom.battleLog.appendChild(li);
  });
}

function newState() {
  return structuredClone(INITIAL_STATE);
}

function clampFloor(value) {
  return Math.max(0, Math.floor(value));
}
