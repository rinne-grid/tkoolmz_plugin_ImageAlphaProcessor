//=============================================================================
// ImageBatchProcessor.js
// 画像バッチ透過処理プラグイン
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] 画像バッチ透過処理プラグイン
 * @author rinne-grid (coding by Claude Sonnet 4)
 * @url
 * @help ImageBatchProcessor.js
 *
 * converter_sourceフォルダの画像を一括で透過処理して、
 * converter_distフォルダにPNG画像として出力するプラグインです。
 *
 * 【前提条件】
 * - ImageAlphaProcessor.js プラグインが有効になっている必要があります
 * - converter_source フォルダに処理したいJPEG画像を配置してください
 * - 処理結果は converter_dist フォルダに自動保存されます
 *
 * 【使用方法】
 * 1. converter_sourceフォルダにJPEG画像を配置
 * 2. プラグインコマンド「batchConvert」を実行
 * 3. converter_distフォルダにPNG画像が出力される
 *
 * 【使用例コード】
 * // JavaScript側からの呼び出し
 * const result = await ImageBatchProcessor.convertAll({
 *   threshold: 8,        // Lab色差閾値
 *   smooth: true,        // スムージング有効
 *   featherRadius: 1.5,  // フェザー半径
 *   preset: 'white'      // プリセット指定
 * });
 *
 * // 特定色背景の一括処理
 * const redBgResult = await ImageBatchProcessor.convertWithPreset('red', {
 *   threshold: 12
 * });
 *
 * @param sourceDirectory
 * @text ソースディレクトリ名
 * @desc 処理対象画像が置かれるディレクトリ名
 * @type string
 * @default converter_source
 *
 * @param outputDirectory
 * @text 出力ディレクトリ名
 * @desc 処理済み画像を保存するディレクトリ名
 * @type string
 * @default converter_dist
 *
 * @param defaultThreshold
 * @text デフォルト Lab色差閾値
 * @desc バッチ処理でのデフォルト透過判定閾値
 * @type number
 * @min 1
 * @max 100
 * @default 8
 *
 * @param defaultSmooth
 * @text デフォルト スムージング有効
 * @desc バッチ処理でエッジスムージングを行うか
 * @type boolean
 * @default true
 *
 * @param defaultFeatherRadius
 * @text デフォルト フェザー半径
 * @desc バッチ処理でのフェザー効果の半径
 * @type number
 * @min 0
 * @max 10
 * @decimals 1
 * @default 1.5
 *
 * @param autoDownload
 * @text 自動ダウンロード有効
 * @desc 処理完了後に自動でダウンロードするか
 * @type boolean
 * @default true
 *
 * @param maxFiles
 * @text 最大処理ファイル数
 * @desc 一度に処理する最大ファイル数（性能調整用）
 * @type number
 * @min 1
 * @max 100
 * @default 20
 *
 * @command batchConvert
 * @text バッチ透過処理実行
 * @desc converter_sourceフォルダの画像を一括透過処理
 *
 * @arg threshold
 * @text Lab色差閾値
 * @desc 透過判定の閾値（小さいほど厳密）
 * @type number
 * @min 1
 * @max 100
 * @default 8
 *
 * @arg smooth
 * @text スムージング有効
 * @desc エッジスムージングを行うか
 * @type boolean
 * @default true
 *
 * @arg featherRadius
 * @text フェザー半径
 * @desc フェザー効果の半径
 * @type number
 * @min 0
 * @max 10
 * @decimals 1
 * @default 1.5
 *
 * @arg preset
 * @text 色プリセット
 * @desc 使用する色プリセット（白背景の場合は空欄）
 * @type select
 * @option 自動検出
 * @value auto
 * @option 白背景
 * @value white
 * @option 赤背景
 * @value red
 * @option 緑背景
 * @value green
 * @option 青背景
 * @value blue
 * @option 黒背景
 * @value black
 * @option グレー背景
 * @value gray
 * @option シアン背景
 * @value cyan
 * @option マゼンタ背景
 * @value magenta
 * @option 黄色背景
 * @value yellow
 * @default auto
 *
 * @command batchConvertPreset
 * @text プリセット指定バッチ処理
 * @desc 指定した色プリセットでバッチ処理を実行
 *
 * @arg preset
 * @text 色プリセット
 * @desc 使用する色プリセット
 * @type select
 * @option 自動検出
 * @value auto
 * @option 白背景
 * @value white
 * @option 赤背景
 * @value red
 * @option 緑背景
 * @value green
 * @option 青背景
 * @value blue
 * @option 黒背景
 * @value black
 * @option グレー背景
 * @value gray
 * @option シアン背景
 * @value cyan
 * @option マゼンタ背景
 * @value magenta
 * @option 黄色背景
 * @value yellow
 * @default white
 *
 * @command batchStatus
 * @text バッチ処理状況確認
 * @desc 現在のバッチ処理状況を確認
 *
 * @command clearCache
 * @text キャッシュクリア
 * @desc 処理済みファイルのキャッシュをクリア
 */

(() => {
  "use strict";

  const pluginName = "ImageBatchProcessor";
  const parameters = PluginManager.parameters(pluginName);

  // パラメータ読み込み
  const sourceDirectory = parameters["sourceDirectory"] || "converter_source";
  const outputDirectory = parameters["outputDirectory"] || "converter_dist";
  const defaultThreshold = parseInt(parameters["defaultThreshold"]) || 8;
  const defaultSmooth = parameters["defaultSmooth"] === "true";
  const defaultFeatherRadius =
    parseFloat(parameters["defaultFeatherRadius"]) || 1.5;
  const autoDownload = parameters["autoDownload"] === "true";
  const maxFiles = parseInt(parameters["maxFiles"]) || 20;

  // バッチ処理状態管理
  let batchState = {
    isProcessing: false,
    currentFile: null,
    processedCount: 0,
    totalFiles: 0,
    errors: [],
    results: [],
  };

  /**
   * ImageBatchProcessor メインクラス
   */
  window.ImageBatchProcessor = class {
    /**
     * 全ファイルのバッチ変換を実行
     * @param {object} options - 処理オプション
     * @returns {Promise<object>} 処理結果
     */
    static async convertAll(options = {}) {
      // ImageAlphaProcessor の存在チェック
      if (!window.loadJpegPseudoAlphaChannel) {
        throw new Error(
          "ImageAlphaProcessor.js プラグインが読み込まれていません"
        );
      }

      const config = {
        threshold: options.threshold || defaultThreshold,
        smooth: options.smooth !== undefined ? options.smooth : defaultSmooth,
        featherRadius: options.featherRadius || defaultFeatherRadius,
        preset: options.preset || "auto",
        sourceDir: options.sourceDir || sourceDirectory,
        outputDir: options.outputDir || outputDirectory,
      };

      console.log("🚀 ImageBatchProcessor: バッチ処理開始");
      console.log("📝 設定:", config);

      try {
        // 処理状態をリセット
        this.resetBatchState();
        batchState.isProcessing = true;

        // ソースディレクトリ内のJPEGファイルを検索
        const jpegFiles = await this.findJpegFiles(config.sourceDir);

        if (jpegFiles.length === 0) {
          return {
            success: false,
            message: `${config.sourceDir} フォルダにJPEGファイルが見つかりません`,
            processedFiles: [],
            errors: [],
          };
        }

        // ファイル数制限チェック
        const filesToProcess = jpegFiles.slice(0, maxFiles);
        if (jpegFiles.length > maxFiles) {
          console.warn(
            `⚠️ ファイル数が上限(${maxFiles})を超えています。最初の${maxFiles}個のファイルのみ処理します。`
          );
        }

        batchState.totalFiles = filesToProcess.length;
        console.log(`📋 処理対象: ${filesToProcess.length}個のファイル`);

        // 各ファイルを順次処理
        const results = [];
        for (let i = 0; i < filesToProcess.length; i++) {
          const fileName = filesToProcess[i];
          batchState.currentFile = fileName;
          batchState.processedCount = i;

          try {
            console.log(
              `🔄 処理中 (${i + 1}/${filesToProcess.length}): ${fileName}`
            );

            const result = await this.processFile(fileName, config);
            results.push(result);
            batchState.results.push(result);

            console.log(`✅ 完了: ${fileName} → ${result.outputFileName}`);

            // UI更新のための小さな遅延
            await this.sleep(100);
          } catch (fileError) {
            console.error(`❌ エラー: ${fileName}`, fileError);
            const errorResult = {
              inputFile: fileName,
              outputFileName: null,
              success: false,
              error: fileError.message,
            };
            results.push(errorResult);
            batchState.errors.push(errorResult);
          }
        }

        // 処理完了
        batchState.isProcessing = false;
        batchState.processedCount = filesToProcess.length;

        const successCount = results.filter((r) => r.success).length;
        const errorCount = results.length - successCount;

        console.log(`🎉 バッチ処理完了！`);
        console.log(`✅ 成功: ${successCount}個`);
        console.log(`❌ エラー: ${errorCount}個`);

        return {
          success: errorCount === 0,
          message: `処理完了: 成功${successCount}個、エラー${errorCount}個`,
          processedFiles: results.filter((r) => r.success),
          errors: results.filter((r) => !r.success),
          config: config,
        };
      } catch (error) {
        batchState.isProcessing = false;
        console.error("💥 バッチ処理で致命的エラー:", error);
        return {
          success: false,
          message: `処理失敗: ${error.message}`,
          processedFiles: [],
          errors: [{ file: "system", error: error.message }],
        };
      }
    }

    /**
     * プリセット指定でのバッチ変換
     * @param {string} preset - 色プリセット名
     * @param {object} options - 追加オプション
     * @returns {Promise<object>} 処理結果
     */
    static async convertWithPreset(preset, options = {}) {
      return await this.convertAll({
        ...options,
        preset: preset,
      });
    }

    /**
     * 単一ファイルの処理
     * @param {string} fileName - ファイル名
     * @param {object} config - 設定
     * @returns {Promise<object>} 処理結果
     */
    static async processFile(fileName, config) {
      const inputPath = `${config.sourceDir}/${fileName}`;
      const outputFileName = fileName.replace(/\.(jpg|jpeg)$/i, ".png");

      // プリセットに応じた処理関数を選択
      let processFunction;
      let processOptions = {
        threshold: config.threshold,
        smooth: config.smooth,
        featherRadius: config.featherRadius,
      };

      switch (config.preset) {
        case "white":
          processFunction = window.loadJpegWhiteBackgroundTransparent;
          break;
        case "red":
          processFunction = window.loadJpegRedBackgroundTransparent;
          break;
        case "green":
          processFunction = window.loadJpegGreenBackgroundTransparent;
          break;
        case "blue":
          processFunction = window.loadJpegBlueBackgroundTransparent;
          break;
        case "black":
          processFunction = window.loadJpegBlackBackgroundTransparent;
          break;
        case "gray":
          processFunction = window.loadJpegGrayBackgroundTransparent;
          break;
        case "cyan":
          processFunction = window.loadJpegCyanBackgroundTransparent;
          break;
        case "magenta":
          processFunction = window.loadJpegMagentaBackgroundTransparent;
          break;
        case "yellow":
          processFunction = window.loadJpegYellowBackgroundTransparent;
          break;
        case "auto":
        default:
          processFunction = window.loadJpegPseudoAlphaChannel;
          break;
      }

      // 透過処理実行
      const transparentBitmap = await processFunction(
        inputPath,
        processOptions
      );

      // PNG として保存
      if (autoDownload) {
        await this.saveBitmapAsPng(transparentBitmap, outputFileName);
      }

      return {
        inputFile: fileName,
        inputPath: inputPath,
        outputFileName: outputFileName,
        success: true,
        preset: config.preset,
        options: processOptions,
      };
    }

    /**
     * JPEGファイルの検索
     * @param {string} directory - 検索ディレクトリ
     * @returns {Promise<Array>} ファイル名配列
     */
    static async findJpegFiles(directory) {
      // File System Access API 対応チェック
      if (window.showDirectoryPicker) {
        try {
          console.log("📂 File System Access API を使用してファイル検索中...");
          return await this.findJpegFilesWithFileSystemAPI();
        } catch (error) {
          console.log(
            "📂 File System API が利用できません、フォールバック実行"
          );
        }
      }

      // フォールバック: 事前定義ファイルリスト
      return await this.findJpegFilesLegacy(directory);
    }

    /**
     * File System Access API を使用したファイル検索
     * @returns {Promise<Array>} ファイル名配列
     */
    static async findJpegFilesWithFileSystemAPI() {
      const dirHandle = await window.showDirectoryPicker({
        mode: "read",
        startIn: "documents",
      });

      const jpegFiles = [];
      for await (const [name, handle] of dirHandle.entries()) {
        if (handle.kind === "file" && /\.(jpg|jpeg)$/i.test(name)) {
          jpegFiles.push(name);
        }
      }

      console.log(
        `📂 File System API: ${jpegFiles.length}個のJPEGファイルを発見`
      );
      return jpegFiles.sort();
    }

    /**
     * レガシー方式でのファイル検索
     * @param {string} directory - 検索ディレクトリ
     * @returns {Promise<Array>} ファイル名配列
     */
    static async findJpegFilesLegacy(directory) {
      const commonJpegNames = [
        "sample1.jpg",
        "sample2.jpg",
        "sample3.jpg",
        "sample4.jpg",
        "sample5.jpg",
        "character1.jpg",
        "character2.jpg",
        "character.jpeg",
        "background1.jpg",
        "background2.jpg",
        "background.jpeg",
        "item1.jpg",
        "item2.jpg",
        "item.jpeg",
        "test1.jpg",
        "test2.jpg",
        "test.jpeg",
        "portrait1.jpg",
        "portrait2.jpg",
        "landscape.jpg",
        "sprite1.jpg",
        "sprite2.jpg",
        "texture.jpg",
        "ai_generated1.jpg",
        "ai_generated2.jpg",
        "ai_image.jpg",
        "stable_diffusion.jpg",
        "midjourney.jpg",
        "dalle.jpg",
        "dalle2.jpg",
        "dalle3.jpg",
        "stablediffusion.jpg",
        "generated_image.jpg",
        "output.jpg",
        "result.jpg",
      ];

      const existingFiles = [];
      const batchSize = 5; // 同時チェック数を制限

      for (let i = 0; i < commonJpegNames.length; i += batchSize) {
        const batch = commonJpegNames.slice(i, i + batchSize);
        const checkPromises = batch.map(async (fileName) => {
          try {
            const testPath = `${directory}/${fileName}`;
            await this.checkImageExists(testPath);
            return fileName;
          } catch {
            return null;
          }
        });

        const results = await Promise.all(checkPromises);
        existingFiles.push(...results.filter((name) => name !== null));
      }

      console.log(
        `📂 レガシー検索: ${existingFiles.length}個のJPEGファイルを発見`
      );
      return existingFiles.sort();
    }

    /**
     * 画像ファイルの存在チェック
     * @param {string} imagePath - 画像パス
     * @returns {Promise<boolean>} 存在するかどうか
     */
    static checkImageExists(imagePath) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const timeout = setTimeout(() => {
          reject(new Error("Timeout"));
        }, 3000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("Not found"));
        };

        img.src = imagePath;
      });
    }

    /**
     * BitmapをPNGとして保存
     * @param {Bitmap} bitmap - 保存するBitmap
     * @param {string} fileName - ファイル名
     * @returns {Promise<void>}
     */
    static async saveBitmapAsPng(bitmap, fileName) {
      return new Promise((resolve, reject) => {
        try {
          const canvas = bitmap.canvas || bitmap._canvas;
          if (!canvas) {
            throw new Error("Canvas が見つかりません");
          }

          // PNG形式のDataURLを生成
          const dataUrl = canvas.toDataURL("image/png", 1.0);

          // ブラウザでのダウンロード処理
          const link = document.createElement("a");
          link.download = fileName;
          link.href = dataUrl;

          // 一時的にDOMに追加してクリック
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          console.log(`💾 PNG保存完了: ${fileName}`);
          resolve();
        } catch (error) {
          console.error("💥 PNG保存エラー:", error);
          reject(error);
        }
      });
    }

    /**
     * 処理状態のリセット
     */
    static resetBatchState() {
      batchState = {
        isProcessing: false,
        currentFile: null,
        processedCount: 0,
        totalFiles: 0,
        errors: [],
        results: [],
      };
    }

    /**
     * 現在の処理状態を取得
     * @returns {object} 処理状態
     */
    static getBatchState() {
      return { ...batchState };
    }

    /**
     * 遅延関数
     * @param {number} ms - 遅延時間（ミリ秒）
     * @returns {Promise<void>}
     */
    static sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  };

  // プラグインコマンド: バッチ変換実行
  PluginManager.registerCommand(pluginName, "batchConvert", (args) => {
    const threshold = parseInt(args.threshold) || defaultThreshold;
    const smooth = args.smooth === "true";
    const featherRadius =
      parseFloat(args.featherRadius) || defaultFeatherRadius;
    const preset = args.preset || "auto";

    (async () => {
      try {
        console.log("🚀 バッチ透過処理開始（プラグインコマンド）");
        $gameMessage.add("バッチ透過処理を開始します...");

        const result = await ImageBatchProcessor.convertAll({
          threshold: threshold,
          smooth: smooth,
          featherRadius: featherRadius,
          preset: preset,
        });

        // 結果をメッセージで表示
        $gameMessage.add(result.message);
        if (result.processedFiles.length > 0) {
          $gameMessage.add(
            `成功: ${result.processedFiles.length}個のファイルを処理`
          );
        }
        if (result.errors.length > 0) {
          $gameMessage.add(`エラー: ${result.errors.length}個のファイルで失敗`);
        }
      } catch (error) {
        console.error("バッチ処理エラー:", error);
        $gameMessage.add("バッチ処理に失敗しました: " + error.message);
      }
    })();
  });

  // プラグインコマンド: プリセット指定バッチ処理
  PluginManager.registerCommand(pluginName, "batchConvertPreset", (args) => {
    const preset = args.preset || "white";

    (async () => {
      try {
        console.log(`🚀 プリセットバッチ処理開始: ${preset}`);
        $gameMessage.add(`${preset}背景のバッチ処理を開始します...`);

        const result = await ImageBatchProcessor.convertWithPreset(preset);

        $gameMessage.add(result.message);
      } catch (error) {
        console.error("プリセットバッチ処理エラー:", error);
        $gameMessage.add(
          "プリセットバッチ処理に失敗しました: " + error.message
        );
      }
    })();
  });

  // プラグインコマンド: 処理状況確認
  PluginManager.registerCommand(pluginName, "batchStatus", () => {
    const state = ImageBatchProcessor.getBatchState();

    if (state.isProcessing) {
      $gameMessage.add(`処理中: ${state.currentFile}`);
      $gameMessage.add(`進捗: ${state.processedCount}/${state.totalFiles}`);
    } else {
      $gameMessage.add("現在処理中のタスクはありません");
      if (state.results.length > 0) {
        $gameMessage.add(
          `前回の処理: ${state.results.length}個のファイルを処理`
        );
      }
    }
  });

  // プラグインコマンド: キャッシュクリア
  PluginManager.registerCommand(pluginName, "clearCache", () => {
    ImageBatchProcessor.resetBatchState();
    $gameMessage.add("処理キャッシュをクリアしました");
  });

  console.log("ImageBatchProcessor プラグインが読み込まれました");
  console.log("画像バッチ透過処理機能が利用可能です");
  console.log(`ソースディレクトリ: ${sourceDirectory}`);
  console.log(`出力ディレクトリ: ${outputDirectory}`);
})();
