# ImageBatchProcessor プラグイン

## 概要
converter_sourceフォルダの画像を一括で透過処理して、converter_distフォルダにPNG画像として出力するプラグインです。

## 前提条件
- `ImageAlphaProcessor.js` プラグインが有効になっている必要があります
- 両方のプラグインを有効にする順序: **ImageAlphaProcessor → ImageBatchProcessor**

## 使用方法

### 1. 基本的な使い方
1. `converter_source` フォルダにJPEG画像を配置
2. プラグインコマンド「batchConvert」を実行
3. `converter_dist` フォルダにPNG画像が自動ダウンロードされる

### 2. プリセット処理
特定の背景色に特化した処理が可能：
- 白背景: `batchConvertPreset` で `white` を選択
- 赤背景: `batchConvertPreset` で `red` を選択
- 緑背景: `batchConvertPreset` で `green` を選択
- 青背景: `batchConvertPreset` で `blue` を選択
- 黒背景: `batchConvertPreset` で `black` を選択

### 3. JavaScript からの呼び出し

```javascript
// 基本的なバッチ処理
const result = await ImageBatchProcessor.convertAll({
  threshold: 8,        // Lab色差閾値
  smooth: true,        // スムージング有効
  featherRadius: 1.5,  // フェザー半径
  preset: 'white'      // プリセット指定
});

// 特定色背景の一括処理
const redBgResult = await ImageBatchProcessor.convertWithPreset('red', {
  threshold: 12
});

// 処理状況の確認
const status = ImageBatchProcessor.getBatchState();
console.log('処理中:', status.isProcessing);
console.log('進捗:', status.processedCount, '/', status.totalFiles);
```

## パラメータ設定

| パラメータ | 説明 | デフォルト値 |
|-----------|------|-------------|
| sourceDirectory | ソースディレクトリ名 | converter_source |
| outputDirectory | 出力ディレクトリ名 | converter_dist |
| defaultThreshold | デフォルト Lab色差閾値 | 8 |
| defaultSmooth | デフォルト スムージング有効 | true |
| defaultFeatherRadius | デフォルト フェザー半径 | 1.5 |
| autoDownload | 自動ダウンロード有効 | true |
| maxFiles | 最大処理ファイル数 | 20 |

## プラグインコマンド

### batchConvert
基本的なバッチ処理を実行します。

**引数:**
- `threshold`: Lab色差閾値 (1-50)
- `smooth`: スムージング有効 (true/false)
- `featherRadius`: フェザー半径 (0-10)
- `preset`: 色プリセット (auto/white/red/green/blue/black/gray/cyan/magenta/yellow)

### batchConvertPreset
指定した色プリセットでバッチ処理を実行します。

**引数:**
- `preset`: 色プリセット

### batchStatus
現在のバッチ処理状況を確認します。

### clearCache
処理済みファイルのキャッシュをクリアします。

## ファイル検索機能

### File System Access API対応
Chrome等の対応ブラウザでは、File System Access APIを使用してディレクトリを直接選択できます。

### フォールバック機能
API非対応の場合は、事前定義されたファイル名パターンで検索を行います：
- sample1.jpg, sample2.jpg, ...
- character1.jpg, character2.jpg, ...
- ai_generated1.jpg, stable_diffusion.jpg, ...
- その他多数のパターン

## 技術仕様

### 対応ファイル形式
- **入力**: JPEG (.jpg, .jpeg)
- **出力**: PNG (透過情報付き)

### 処理性能
- 最大20ファイルまで一度に処理可能（設定で変更可能）
- バッチ処理中は進捗状況を表示
- エラーファイルは詳細ログを記録

### 色プリセット詳細

| プリセット | 対象色 | 閾値 | 特徴 |
|-----------|--------|------|------|
| auto | 自動検出 | 8 | 四隅サンプリング方式 |
| white | #FFFFFF | 8 | 厳密な白色判定 |
| red | #FF0000 | 12 | 赤系背景 |
| green | #00FF00 | 12 | 緑系背景（グリーンバック） |
| blue | #0000FF | 12 | 青系背景（ブルーバック） |
| black | #000000 | 15 | 黒系背景（陰影考慮） |
| gray | #808080 | 20 | グレー背景 |
| cyan | #00FFFF | 10 | シアン背景 |
| magenta | #FF00FF | 10 | マゼンタ背景 |
| yellow | #FFFF00 | 12 | 黄色背景 |

## トラブルシューティング

### エラー: "ImageAlphaProcessor.js プラグインが読み込まれていません"
**解決方法**: ImageAlphaProcessor.js を先に有効にしてください。

### ファイルが見つからない
**解決方法**: 
1. converter_sourceフォルダが存在することを確認
2. ファイル名が対応パターンに含まれているか確認
3. File System Access API を使用してディレクトリを手動選択

### 処理が重い
**解決方法**:
1. maxFiles パラメータを小さく設定
2. 大きな画像ファイルの場合は事前にリサイズ
3. smooth を false に設定してスムージングを無効化

### ダウンロードされない
**解決方法**:
1. autoDownload パラメータが true になっているか確認
2. ブラウザのダウンロード設定を確認
3. ポップアップブロッカーを無効化

## ライセンス
このプラグインはMIT ライセンスの下で提供されています。
