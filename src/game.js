import { INITIAL_STATE, SCENES } from "./scenario.js";

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
  scenePhase: document.querySelector("#scene-phase"),
  sceneTitle: document.querySelector("#scene-title"),
  sceneText: document.querySelector("#scene-text"),
  choices: document.querySelector("#choices"),
  battleLog: document.querySelector("#battle-log"),
  restartButton: document.querySelector("#restart-button"),
};

let store = createStore(INITIAL_STATE);
let currentSceneId = "title";

dom.restartButton.addEventListener("click", () => {
  store.reset();
  currentSceneId = "title";
  render();
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
        if (choice.effect) {
          choice.effect(draft);
        }
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
  state.log.slice(-20).forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    if (entry.includes("敗北") || entry.includes("失敗")) {
      li.classList.add("critical");
    }
    dom.battleLog.appendChild(li);
  });
}

function floorClamp(value) {
  return Math.max(0, Math.floor(value));
}
