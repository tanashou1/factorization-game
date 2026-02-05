# Changelog

このファイルには、因数分解ゲーム（Factorization Game）プロジェクトのすべての重要な変更が記録されます。

このプロジェクトは [Semantic Versioning](https://semver.org/spec/v2.0.0.html) に準拠しています。

## [Unreleased]

### 予定されている変更
- なし

---

## [1.4.0] - 2026-02-05

### Added
- **チャレンジモード**: 新しいゲームモードを追加
  - レベルが素数の順番に進行（2 → 3 → 5 → 7 → 11...）
  - 各レベルの目標スコアは「レベルの2乗」（レベル2は4点、レベル3は9点）
  - 使える数字（最大素数p）がレベルに応じて自動的に増加
  - レベルアップ時のアニメーション通知
- **モード選択画面**: ゲーム開始時にフリーモードまたはチャレンジモードを選択
  - カード型の美しいUI
  - 各モードの説明とアイコン表示
- **チャレンジ情報パネル**: 現在のレベル、目標スコア、残りスコアを表示
- **メニューに戻る機能**: ゲーム中にモード選択画面に戻ることが可能
- 数学ユーティリティに`getNextPrime()`関数を追加

### Changed
- フリーモードのUIをチャレンジモードと区別するために調整
- チャレンジモード中はパラメータ調整を無効化（自動管理）
- バージョン表示を1.4.0に更新

---

## [1.0.2] - 2026-02-04

### Fixed
- GitHub Actions CI/CDワークフローのNode.jsバージョンを18から20に更新
- Vite 7.3.1の要件（Node.js 20.19+または22.12+）に対応
- CI実行時の「failed to load config from vite.config.ts」エラーを解決

---

## [1.0.1] - 2026-02-04

### Fixed
- CI/CDワークフローで発生していた依存関係ロックファイルエラーを修正
- `.gitignore`から`package-lock.json`を除外し、再現可能なビルドを保証

### Changed
- `package-lock.json`をバージョン管理に追加

---

## [1.0.0] - 2026-02-04

### Added
- ブラウザゲーム開発のための標準的な作業手順を定義したカスタムインストラクション
- セマンティックバージョニング（SemVer）のガイドライン
- バージョン表示要件の定義
- 包括的なブラウザゲームテスト手順
- プルリクエスト作成時のチェックリスト
- コーディング規約
- デプロイメントガイドライン
- 初期プロジェクト構成（package.json）
- このCHANGELOG.md

### Changed
- なし

### Deprecated
- なし

### Removed
- なし

### Fixed
- なし

### Security
- なし

---

## バージョン番号の解説

バージョン番号は `MAJOR.MINOR.PATCH` の形式です：

- **MAJOR**: 互換性のない変更を行った場合に増加
- **MINOR**: 後方互換性のある機能追加の場合に増加
- **PATCH**: 後方互換性のあるバグ修正の場合に増加

詳細は [Semantic Versioning](https://semver.org/) を参照してください。

---

## リンク

- [Unreleased]: https://github.com/tanashou1/factorization-game/compare/v1.4.0...HEAD
- [1.4.0]: https://github.com/tanashou1/factorization-game/compare/v1.0.2...v1.4.0
- [1.0.2]: https://github.com/tanashou1/factorization-game/compare/v1.0.1...v1.0.2
- [1.0.1]: https://github.com/tanashou1/factorization-game/compare/v1.0.0...v1.0.1
- [1.0.0]: https://github.com/tanashou1/factorization-game/releases/tag/v1.0.0
