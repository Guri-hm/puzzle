# 9マスパズル

Next.js で作成された画像パズルゲームです。画像を正しい順序に並べ替えることでクリアできます。

## 機能

- ⏱️ タイマー機能
- 🚶 手数カウント
- 💡 ヒント機能（A*アルゴリズム）
- 🏆 ローカルストレージでベストタイム記録
- 🎉 クリア時のアニメーション
- 📱 レスポンシブデザイン
- 🔗 OGP対応

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build
```

## 新しいパズルの追加方法

1. `public/puzzles/` に新しいフォルダを作成（例：`0002`）
2. フォルダ内に `tile_1.png` から `tile_9.png` までの画像を配置
   - 画像は3×3グリッドの各タイルに対応
   - 推奨サイズ：正方形（例：300x300px）
3. `src/app/page.tsx` の `PUZZLE_SETS` 配列に新しいパズルを追加

```typescript
const PUZZLE_SETS = [
  { id: '0001', name: 'サンプルパズル1', description: '最初のパズル' },
  { id: '0002', name: '新しいパズル', description: '説明文' },
]
```

4. Git にコミット＆プッシュで自動デプロイ

## デプロイ

GitHub Actions により、`main` ブランチへのプッシュで自動的に GitHub Pages にデプロイされます。

## ライセンス

MIT
