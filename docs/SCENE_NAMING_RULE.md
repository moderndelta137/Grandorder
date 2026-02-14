# 章本文シーン命名ルール（Sprint2 Step D-1）

## 目的
`SCENES` 内の章本文シーンを、検索しやすく置換しやすい名前で統一する。

## 命名フォーマット

`chapter{章番号}_{種別}_{連番}`

- 章番号: `1`〜`6`（例: `chapter1`）
- 種別:
  - `main` : 必須本文
  - `opt` : 任意本文
  - `branch` : 分岐本文
- 連番: 3桁ゼロ埋め（`001`, `002` ...）

例:
- `chapter1_main_001`
- `chapter2_opt_001`
- `chapter4_branch_002`

## 運用ルール
1. 章開始の入口シーンは `getChapterContentEntryScene()` で1つに集約する。
2. Step Dではプレースホルダのみを置き、本文はSprint3で差し替える。
3. プレースホルダ通過時はログにシーンIDを残し、到達確認を容易にする。

## Sprint2で実装した挿入口
- `chapter1_main_001`
- `chapter1_main_002`
- `chapter2_main_001`
- `chapter2_main_002`

