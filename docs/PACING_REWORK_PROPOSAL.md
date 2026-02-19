# 第1〜2章ペース再設計 改修案（作中時間整合版）

最終更新: 現在スレッド  
参照: `docs/GDD.md`, `docs/PLOT_MASTER.md`, `docs/SCENE_NAMING_RULE.md`

---

## 0. 背景（今回の指摘）

- 既存の `dayAction` は「昼行動 → 遭遇判定 → 夜戦/日中イベント結果」という1日単位ループ設計であり、章本文の短時間遷移（例: 10/1 23:12 → 23:24）間に挿入すると、**作中時間が過剰に進む解釈**になりやすい。
- そのため、同日内のテンポ改善で本文を分割したい場合は、`dayAction` ではなく **同日中に完結する強制遭遇イベント層**を使う必要がある。

---

## 1. 設計方針（結論）

### 1.1 レイヤ分離

1. **日次ループ（既存）**
   - `dayAction` / `dayEncounterCheck` / `nightBattle`
   - 原則: 1サイクルで作中日を進める

2. **章内テンポ調整ループ（新設）**
   - 仮称: `chapterEncounter`（強制遭遇）
   - 原則: **同日の数十分〜数時間で完結**し、日付を進めない
   - 役割: 章本文の連続を切り、短い戦闘または情報イベントを挟む

### 1.2 使い分けルール

- 時刻が同日かつ1〜3時間以内で連続する章本文間は `chapterEncounter` を使用。
- 章末や「次行動へ」の明確な区切りのみ `dayAction` へ接続。

---

## 2. 実装案（最小差分）

## 2.1 新規シーン群

`SCENE_NAMING_RULE` に沿い、以下を追加する。

- `chapter1_branch_001`（路地速報後の同日遭遇）
- `chapter1_branch_002`（監視点確認後の同日遭遇）
- `chapter2_branch_001`（交渉姿勢決定後の同日遭遇）
- `chapter2_branch_002`（会談終了後の同日遭遇）

> 種別は `branch` を使用し、章本文 `chapter{n}_main_{nnn}` とは分離する。

## 2.2 処理仕様（chapterEncounter）

- 入力: `chapterEncounterPlan = { chapter, slot, mode, rewardProfile }`
- `mode`:
  - `skirmish`: 強制小規模戦闘（通常夜戦より低ダメージ帯）
  - `intel`: 強制情報イベント（看破/同盟/戦術優位の軽微変動）
- 出力:
  - `s.log` へ「同日遭遇」の記録
  - `chapterContentShown` は既存継続
  - **`nextDay()` は呼ばない**（日付維持）

## 2.3 既存戦闘ロジックとの分離

- `resolveBattle()` は現状どおり日次戦闘専用で維持。
- 章内強制戦闘は新関数 `resolveChapterSkirmish()` を追加して分離。
  - ダメージレンジ・消費魔力を抑制
  - 敵撃破進行 (`enemiesDefeated`) は原則増やさない（進行破綻防止）

---

## 3. 第1〜2章 接続の具体案

## 3.1 第1章

- `chapter1_main_002 -> chapter1_branch_001 -> chapter1_main_003`
- `chapter1_main_004 -> chapter1_branch_002 -> chapter1_main_005`
- `chapter1_main_006 -> dayAction`（章終端のみ日次ループへ）

## 3.2 第2章

- `chapter2_main_002 -> chapter2_branch_001 -> chapter2_main_003`
- `chapter2_main_004 -> chapter2_branch_002 -> chapter2_main_005`
- `chapter2_main_006 -> dayAction`（章終端のみ日次ループへ）

> これにより「本文連続を切る」要件を満たしつつ、作中時間（同日内）を維持できる。

---

## 4. ドキュメント更新案

実装時に以下を同時更新する。

1. `docs/PLOT_MASTER.md`
   - 3.1E / 3.2E に `chapter*_branch_*` を追記
   - 「通常処理」表記を `dayAction` と `chapterEncounter` で明確に分離

2. `docs/SPRINT1_PROGRESS.md`
   - 「2.xx」として、章内強制遭遇レイヤ導入を履歴化

3. `docs/SCENE_NAMING_RULE.md`
   - `branch` 種別の用途に「同日強制遭遇シーン」を追記

---

## 5. 受け入れ条件（本改修案のDone）

1. 第1〜2章で本文3連続以上の区間が解消される。
2. 同日内シーン遷移（時刻表記）が日跨ぎなしで成立する。
3. `dayAction` は章終端または日次遷移点に限定される。
4. 既存回帰（Sprint3/Sprint4）を壊さない。

---

## 6. 回帰チェック

- `node scripts/validate_sprint3_d3.mjs`
- `node scripts/validate_sprint4_d3.mjs`
- `node scripts/count_story_chars.mjs`

必要に応じて追加:
- `scripts/validate_chapter_encounter_timeflow.mjs`（新規、同日遷移専用）

