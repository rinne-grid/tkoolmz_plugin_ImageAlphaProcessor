# バッチ処理用フォルダ構造

このファイルは、ImageBatchProcessor プラグインで使用するフォルダ構造について説明します。

## フォルダ構成

```
ImageAlphaProcessor/
├── converter_source/          # 処理対象のJPEG画像を配置
│   ├── sample1.jpg           # 処理したいJPEG画像
│   ├── sample2.jpg           # 
│   ├── character.jpg         # 
│   └── ...                   # その他のJPEG画像
│
├── converter_dist/           # 処理済みPNG画像の出力先
│   ├── sample1.png          # 透過処理済みPNG（自動生成）
│   ├── sample2.png          # 
│   ├── character.png        # 
│   └── ...                  # その他の出力PNG
│
└── js/plugins/
    ├── ImageAlphaProcessor.js    # 透過処理エンジン
    └── ImageBatchProcessor.js    # バッチ処理機能
```

## 使用手順

### 1. 画像の配置
1. 透過処理したいJPEG画像を `converter_source` フォルダに配置します
2. ファイル名は以下のパターンが自動検出されます：
   - sample1.jpg, sample2.jpg, sample3.jpg, ...
   - character1.jpg, character2.jpg, character.jpeg
   - background1.jpg, background2.jpg, background.jpeg
   - item1.jpg, item2.jpg, item.jpeg
   - test1.jpg, test2.jpg, test.jpeg
   - ai_generated1.jpg, stable_diffusion.jpg, midjourney.jpg
   - その他多数のパターン

### 2. バッチ処理の実行
1. RPGツクールMZでプラグインコマンド「batchConvert」を実行
2. または、JavaScript で `ImageBatchProcessor.convertAll()` を呼び出し

### 3. 結果の確認
1. 処理が完了すると、透過処理済みのPNG画像が自動ダウンロードされます
2. ファイル名は元のJPEGファイル名の拡張子をPNGに変更したもの

## サポートされるファイル名パターン

### 基本パターン
- sample[数字].jpg
- character[数字].jpg/.jpeg
- background[数字].jpg/.jpeg
- item[数字].jpg/.jpeg
- test[数字].jpg/.jpeg
- portrait[数字].jpg
- landscape.jpg
- sprite[数字].jpg
- texture.jpg

### AI生成画像パターン
- ai_generated[数字].jpg
- ai_image.jpg
- stable_diffusion.jpg
- stablediffusion.jpg
- midjourney.jpg
- dalle.jpg, dalle2.jpg, dalle3.jpg
- generated_image.jpg
- output.jpg
- result.jpg

## カスタムファイル名を使用する場合

上記のパターンに含まれていないファイル名を使用する場合は、以下の方法があります：

### 方法1: File System Access API（Chrome推奨）
1. バッチ処理実行時に、ディレクトリ選択ダイアログが表示されます
2. converter_source フォルダを選択します
3. フォルダ内の全JPEGファイルが自動検出されます

### 方法2: ファイル名を変更
処理したいファイルを、サポートされているパターンの名前に変更します。

### 方法3: プラグインコードの修正
`ImageBatchProcessor.js` の `findJpegFilesLegacy` 関数で、`commonJpegNames` 配列にファイル名を追加します。

## パフォーマンス考慮事項

### 推奨画像サイズ
- 幅・高さ: 2048px以下
- ファイルサイズ: 5MB以下

### 一度に処理するファイル数
- デフォルト: 最大20ファイル
- プラグインパラメータ `maxFiles` で調整可能

### 処理時間の目安
- 512x512px: 約1-2秒/ファイル
- 1024x1024px: 約3-5秒/ファイル
- 2048x2048px: 約10-15秒/ファイル

## トラブルシューティング

### Q: ファイルが検出されない
A: 以下を確認してください：
1. ファイルがconverter_sourceフォルダに配置されているか
2. ファイル名がサポートパターンに含まれているか
3. ファイルが破損していないか

### Q: 処理が遅い・重い
A: 以下を試してください：
1. 画像サイズを小さくする
2. maxFilesパラメータを小さくする
3. スムージング機能を無効にする

### Q: 透過がうまくいかない
A: 以下を調整してください：
1. threshold値を変更（小さくすると厳密、大きくすると緩い）
2. 適切な色プリセットを選択
3. 元画像の背景色が単色に近いか確認

## 注意事項

1. **ブラウザ制限**: 大量のファイルダウンロードに対してブラウザが警告を表示する場合があります
2. **メモリ使用量**: 大きな画像や大量のファイル処理では、メモリ使用量が増加します
3. **ファイル上書き**: 同名のPNGファイルが存在する場合、上書きダウンロードされます

## 推奨ワークフロー

1. **準備**: converter_sourceフォルダを作成し、JPEG画像を配置
2. **テスト**: 1-2枚の画像で設定をテスト
3. **調整**: threshold や featherRadius を調整して最適な結果を得る
4. **バッチ実行**: 設定が決まったら全ファイルをバッチ処理
5. **確認**: 出力されたPNG画像を確認・検証
