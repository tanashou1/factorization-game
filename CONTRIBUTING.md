# 貢献ガイド (Contributing Guide)

因数分解ゲーム（Factorization Game）プロジェクトへの貢献に興味を持っていただき、ありがとうございます！

このガイドでは、プロジェクトに貢献する方法について説明します。

## 📋 目次
- [行動規範](#行動規範)
- [はじめに](#はじめに)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [貢献の方法](#貢献の方法)
- [開発ワークフロー](#開発ワークフロー)
- [コーディング規約](#コーディング規約)
- [テスト](#テスト)
- [プルリクエスト](#プルリクエスト)

---

## 🤝 行動規範

このプロジェクトに参加するすべての人は、尊重と協力の精神を持って行動することが期待されます。

---

## 🚀 はじめに

### 貢献できること

- **バグ報告**: バグを発見したら報告してください
- **機能提案**: 新機能や改善のアイデアを提案してください
- **コード貢献**: バグ修正や新機能の実装
- **ドキュメント**: ドキュメントの改善や翻訳
- **テスト**: テストケースの追加や改善
- **デザイン**: UIデザインの改善提案

### 貢献前の確認

1. [Issue](https://github.com/tanashou1/factorization-game/issues)を確認して、既に報告されていないか確認
2. [プルリクエスト](https://github.com/tanashou1/factorization-game/pulls)を確認して、既に作業中でないか確認
3. 大きな変更の場合は、まずIssueで提案して議論

---

## 💻 開発環境のセットアップ

### 必要な環境

- Node.js 18.x以降
- npm 9.x以降
- Git

### セットアップ手順

```bash
# リポジトリをフォーク後、クローン
git clone https://github.com/YOUR_USERNAME/factorization-game.git
cd factorization-game

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# 別のターミナルでテストを実行
npm test
```

---

## 🔧 貢献の方法

### 1. バグ報告

バグを発見した場合：

1. [バグ報告Issue](https://github.com/tanashou1/factorization-game/issues/new?template=bug_report.md)を作成
2. テンプレートに従って情報を記入
3. 再現手順を明確に記載
4. スクリーンショットを添付（可能であれば）

### 2. 機能提案

新機能を提案する場合：

1. [機能リクエストIssue](https://github.com/tanashou1/factorization-game/issues/new?template=feature_request.md)を作成
2. テンプレートに従って提案内容を記入
3. 実装方法のアイデアがあれば記載

### 3. コード貢献

コードを貢献する場合：

1. Issueを確認または作成
2. フォークしてブランチを作成
3. コードを実装
4. テストを追加
5. プルリクエストを作成

---

## 🔄 開発ワークフロー

### ブランチ戦略

```
main
  └── feature/機能名      # 新機能
  └── bugfix/バグ名       # バグ修正
  └── hotfix/緊急修正名   # 緊急修正
  └── docs/ドキュメント名 # ドキュメント
```

### 作業手順

1. **フォークとクローン**
   ```bash
   # GitHubでフォーク後
   git clone https://github.com/YOUR_USERNAME/factorization-game.git
   cd factorization-game
   ```

2. **リモートの追加**
   ```bash
   git remote add upstream https://github.com/tanashou1/factorization-game.git
   ```

3. **ブランチの作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **変更の実装**
   ```bash
   # コードを編集
   # テストを追加
   ```

5. **テストの実行**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

6. **コミット**
   ```bash
   git add .
   git commit -m "feat: 新機能の説明"
   ```

7. **プッシュ**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **プルリクエストの作成**
   - GitHubでプルリクエストを作成
   - テンプレートに従って記入

---

## 📝 コーディング規約

詳細は [`.github/copilot-instructions.md`](.github/copilot-instructions.md) を参照してください。

### 基本ルール

- **TypeScript**: strictモードを使用
- **インデント**: 2スペース
- **クォート**: シングルクォート優先
- **セミコロン**: 必須
- **命名規則**:
  - 変数・関数: `camelCase`
  - コンポーネント: `PascalCase`
  - 定数: `UPPER_SNAKE_CASE`

### コミットメッセージ

[Conventional Commits](https://www.conventionalcommits.org/)に従う：

```
<type>: <description>

[optional body]

[optional footer]
```

**タイプ**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（フォーマット等）
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

**例**:
```
feat: タイル移動のアニメーション速度を調整可能に

ユーザーがアニメーション速度を3段階で選択できるようにした。
設定画面から変更可能。

Closes #123
```

---

## 🧪 テスト

### テストの種類

1. **ユニットテスト**: 個別の関数をテスト
2. **統合テスト**: コンポーネント間の連携をテスト
3. **E2Eテスト**: ユーザーの操作フローをテスト

詳細は [`TESTING.md`](TESTING.md) を参照してください。

### テストの実行

```bash
# すべてのテストを実行
npm test

# カバレッジレポート生成
npm run test:coverage

# 特定のテストファイルのみ実行
npm test -- path/to/test.spec.ts
```

### テストの追加

- 新機能には必ずテストを追加
- バグ修正には回帰テストを追加
- カバレッジ70%以上を目標

---

## 📤 プルリクエスト

### PRを作成する前に

- [ ] リントが通る（`npm run lint`）
- [ ] すべてのテストが成功（`npm test`）
- [ ] ビルドが成功（`npm run build`）
- [ ] **バージョン番号を更新**（`package.json`）
- [ ] **CHANGELOG.mdを更新**
- [ ] ブラウザで動作確認済み
- [ ] コードレビューを受ける準備ができている

### セマンティックバージョニング

**必須**: プルリクエストを作成する際は、必ずバージョン番号を更新してください。

- **MAJOR** (X.0.0): 破壊的変更
- **MINOR** (X.Y.0): 後方互換性のある機能追加
- **PATCH** (X.Y.Z): 後方互換性のあるバグ修正

詳細は [`.github/copilot-instructions.md`](.github/copilot-instructions.md#バージョン管理) を参照してください。

### PRテンプレート

プルリクエストを作成すると、自動的にテンプレートが表示されます。
すべての項目を埋めてください。

### レビュープロセス

1. PRを作成するとメンテナーに通知される
2. メンテナーがコードレビューを実施
3. 必要に応じて修正を依頼
4. 承認後、メンテナーがマージ

### マージ後

- ブランチは自動的に削除される場合があります
- デプロイが自動的に実行されます
- GitHub Pagesで変更を確認できます

---

## 🎯 優良なPRの例

### 良い例 ✅

```markdown
## 変更内容
タイル移動時のアニメーション速度を調整可能にした

## バージョン変更
- [x] MINOR (1.3.0) - 新機能追加

変更後のバージョン: `1.3.0`

## 更新したファイル
- [x] package.jsonのバージョンを更新
- [x] CHANGELOG.mdに変更内容を記録
- [x] バージョン表示が正しく動作することを確認

## テスト実施状況
- [x] ユニットテスト実施・成功
- [x] Chrome, Firefox, Safariで動作確認
- [x] モバイルでの動作確認

## スクリーンショット
[設定画面のスクリーンショット]

Closes #123
```

### 改善が必要な例 ❌

```markdown
いろいろ直した
```

**問題点**:
- バージョンが更新されていない
- 変更内容が不明確
- テスト状況が不明
- Issue番号がない

---

## 📚 参考資料

- [セマンティックバージョニング](https://semver.org/lang/ja/)
- [Conventional Commits](https://www.conventionalcommits.org/ja/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ❓ 質問がある場合

- [Discussions](https://github.com/tanashou1/factorization-game/discussions)で質問
- [Issue](https://github.com/tanashou1/factorization-game/issues)でバグ報告や機能提案

---

## 🙏 謝辞

このプロジェクトに貢献してくださるすべての方に感謝します！

---

**最終更新日**: 2026-02-04
**バージョン**: 1.0.0
