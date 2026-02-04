# クイックリファレンス (Quick Reference)

因数分解ゲーム開発のための重要なリンクとルールをまとめた簡易リファレンスです。

## 📌 重要なルール

### 1. セマンティックバージョニング（必須）

すべてのプルリクエストで、必ず `package.json` のバージョンを更新してください。

```
MAJOR.MINOR.PATCH
例: 1.2.3
```

- **MAJOR (X.0.0)**: 破壊的変更
- **MINOR (X.Y.0)**: 後方互換性のある機能追加
- **PATCH (X.Y.Z)**: 後方互換性のあるバグ修正

### 2. バージョン表示（必須）

アプリケーション画面に必ずバージョンを表示してください。

表示場所の例：
- ゲーム画面のフッター
- 設定画面
- About/情報画面

表示形式: `v1.2.3` または `バージョン: 1.2.3`

### 3. テスト（必須）

変更をプッシュする前に、必ず以下を実行してください：

```bash
npm run lint    # リント
npm test        # テスト
npm run build   # ビルド
```

## 📚 ドキュメント

### 開発者向け
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - エージェント向け完全なカスタムインストラクション（必読）
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - 貢献ガイド
- **[TESTING.md](TESTING.md)** - テスト手順の詳細
- **[CHANGELOG.md](CHANGELOG.md)** - バージョン変更履歴

### ユーザー向け
- **[README.md](README.md)** - ゲームの説明とルール

## 🔧 開発フロー（簡易版）

```bash
# 1. ブランチを作成
git checkout -b feature/your-feature

# 2. 変更を実装

# 3. テスト実行
npm run lint && npm test && npm run build

# 4. バージョンを更新
# package.json の version を更新

# 5. CHANGELOGを更新
# CHANGELOG.md に変更内容を記載

# 6. コミット
git add .
git commit -m "feat: 変更内容"

# 7. プッシュ
git push origin feature/your-feature

# 8. GitHub でプルリクエスト作成
```

## 📋 PRチェックリスト（簡易版）

プルリクエスト作成前に確認：

- [ ] `package.json` のバージョンを更新
- [ ] `CHANGELOG.md` を更新
- [ ] リントが通る (`npm run lint`)
- [ ] テストが成功 (`npm test`)
- [ ] ビルドが成功 (`npm run build`)
- [ ] ブラウザで動作確認済み
- [ ] バージョン表示が正しく動作

## 🧪 対応ブラウザ

### デスクトップ
- Chrome（最新版、1つ前）
- Firefox（最新版、1つ前）
- Safari（最新版、1つ前）
- Edge（最新版、1つ前）

### モバイル
- iOS Safari（最新版）
- Android Chrome（最新版）

## 🔗 便利なリンク

- **リポジトリ**: https://github.com/tanashou1/factorization-game
- **本番環境**: https://tanashou1.github.io/factorization-game/
- **Issue**: https://github.com/tanashou1/factorization-game/issues
- **PR**: https://github.com/tanashou1/factorization-game/pulls

## ⚡ よくある質問

**Q: バージョンをどう決めればいい？**
A: 変更内容に応じて：
- APIが変わる、ゲームルールが変わる → MAJOR
- 新機能追加 → MINOR
- バグ修正、ドキュメント更新 → PATCH

**Q: テストがない場合は？**
A: テストインフラがまだない場合は、手動でブラウザテストを実施してください。

**Q: 大きな変更を加えたい場合は？**
A: まず Issue を作成して、提案内容を議論してください。

---

**現在のバージョン**: v1.0.0  
**最終更新日**: 2026-02-04
