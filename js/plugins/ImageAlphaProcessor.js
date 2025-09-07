//=============================================================================
// ImageAlphaProcessor.js
// 画像生成AI用白背景透過プラグイン
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] 画像生成AI用白背景透過プラグイン
 * @author rinne-grid (coding by Claude Sonnet 4)
 * @url
 * @help ImageAlphaProcessor.js
 *
 * 画像生成AIで作られたJPEG画像の白背景を透明にする機能を提供します。
 *
 * 使用例:
 * // 基本的な白背景透過
 * const transparentBitmap = await loadJpegPseudoAlphaChannel('img/pictures/example.jpg');
 *
 * // 基本色別プリセット関数の使用例
 * const redBg = await loadJpegRedBackgroundTransparent('img/characters/hero_red.jpg');
 * const greenBg = await loadJpegGreenBackgroundTransparent('img/characters/hero_green.jpg');
 * const blueBg = await loadJpegBlueBackgroundTransparent('img/characters/hero_blue.jpg');
 * const whiteBg = await loadJpegWhiteBackgroundTransparent('img/characters/hero_white.jpg');
 * const blackBg = await loadJpegBlackBackgroundTransparent('img/characters/hero_black.jpg');
 *
 * // 拡張色プリセット関数の使用例
 * const grayBg = await loadJpegGrayBackgroundTransparent('img/items/sword_gray.jpg');
 * const cyanBg = await loadJpegCyanBackgroundTransparent('img/effects/magic_cyan.jpg');
 * const magentaBg = await loadJpegMagentaBackgroundTransparent('img/effects/spell_magenta.jpg');
 * const yellowBg = await loadJpegYellowBackgroundTransparent('img/items/gold_yellow.jpg');
 *
 * // カスタム設定での使用例
 * const customRed = await loadJpegRedBackgroundTransparent('img/test.jpg', {
 *   threshold: 15,      // より緩い判定
 *   featherRadius: 3.0  // より大きなフェザー効果
 * });
 *
 * @param whiteThreshold
 * @text 白色判定閾値
 * @desc 白色として判定するRGB値の閾値 (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 240
 *
 * @param smoothEdges
 * @text エッジスムージングを行うか
 * @desc エッジスムージングを行うか
 * @type boolean
 * @default true
 */
window.loadJpegAIOptimizedTransparent = function (imagePath) {
  return loadJpegPseudoAlphaChannel(imagePath, {
    threshold: 6, // より保守的な色差判定で前景保護
    smooth: true,
    featherRadius: 1.5,
  });
};

/**
 * プリセット関数: シンプル透過処理（高速・軽量版）
 * @param {string} imagePath - 画像パス
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegSimpleTransparent = function (imagePath) {
  return loadJpegPseudoAlphaChannel(imagePath, {
    threshold: 8, // より厳密なLab色差
    smooth: false, // スムージングなしで高速処理
    featherRadius: 0,
  });
};

/**
 * プリセット関数: 高品質プロフェッショナル透過処理
 * @param {string} imagePath - 画像パス
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegSuperSmoothTransparent = function (imagePath) {
  return loadJpegPseudoAlphaChannel(imagePath, {
    threshold: 7, // より保守的な色差判定で前景保護
    smooth: true,
    featherRadius: 3, // 大きなフェザー半径でプロ仕様
  });
};

/**
 * 基本色別透過処理プリセット関数群
 * よく使われる基本色（赤、緑、青、白、黒）の背景を透過する専用関数
 */

/**
 * プリセット関数: 赤色背景透過処理 (#FF0000)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegRedBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 255, g: 0, b: 0 },
    {
      threshold: options.threshold || 12, // 赤系の色差に適した閾値
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.5,
      ...options,
    }
  );
};

/**
 * プリセット関数: 緑色背景透過処理 (#00FF00)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegGreenBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 0, g: 255, b: 0 },
    {
      threshold: options.threshold || 12, // 緑系の色差に適した閾値
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.5,
      ...options,
    }
  );
};

/**
 * プリセット関数: 青色背景透過処理 (#0000FF)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegBlueBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 0, g: 0, b: 255 },
    {
      threshold: options.threshold || 12, // 青系の色差に適した閾値
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.5,
      ...options,
    }
  );
};

/**
 * プリセット関数: 純白背景透過処理 (#FFFFFF)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegWhiteBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 255, g: 255, b: 255 },
    {
      threshold: options.threshold || 8, // 白色は厳密に判定
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.8, // 白背景は少し大きめのフェザー
      ...options,
    }
  );
};

/**
 * プリセット関数: 黒色背景透過処理 (#000000)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegBlackBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 0, g: 0, b: 0 },
    {
      threshold: options.threshold || 15, // 黒色は陰影との区別が難しいため緩めの設定
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 2.0, // 黒背景は大きめのフェザーで自然に
      ...options,
    }
  );
};

/**
 * 拡張色別透過処理プリセット関数群
 * よく使われる中間色や特殊色の背景透過処理
 */

/**
 * プリセット関数: グレー背景透過処理 (#808080)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegGrayBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 128, g: 128, b: 128 },
    {
      threshold: options.threshold || 20, // グレーは色調判定が複雑なため大きめ
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 2.5,
      ...options,
    }
  );
};

/**
 * プリセット関数: シアン背景透過処理 (#00FFFF) - グリーンバック代替
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegCyanBackgroundTransparent = function (imagePath, options = {}) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 0, g: 255, b: 255 },
    {
      threshold: options.threshold || 10, // シアンは比較的判定しやすい
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.5,
      ...options,
    }
  );
};

/**
 * プリセット関数: マゼンタ背景透過処理 (#FF00FF)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegMagentaBackgroundTransparent = function (
  imagePath,
  options = {}
) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 255, g: 0, b: 255 },
    {
      threshold: options.threshold || 10, // マゼンタも判定しやすい
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.5,
      ...options,
    }
  );
};

/**
 * プリセット関数: イエロー背景透過処理 (#FFFF00)
 * @param {string} imagePath - 画像パス
 * @param {object} options - 追加オプション（省略可能）
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegYellowBackgroundTransparent = function (
  imagePath,
  options = {}
) {
  return loadJpegCustomColorTransparent(
    imagePath,
    { r: 255, g: 255, b: 0 },
    {
      threshold: options.threshold || 12, // 黄色は肌色との区別が重要
      smooth: options.smooth !== undefined ? options.smooth : true,
      featherRadius: options.featherRadius || 1.8,
      ...options,
    }
  );
};

/**
 * プリセット関数: 写真専用高精度透過処理
 * @param {string} imagePath - 画像パス
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegPhotoGradeTransparent = function (imagePath) {
  return loadJpegPseudoAlphaChannel(imagePath, {
    threshold: 8, // より保守的な色差判定で前景保護
    smooth: true,
    featherRadius: 2,
  });
};

/**
 * 特定色透過処理: 指定した色を透明化する
 * @param {string} imagePath - 画像パス
 * @param {object} targetColor - 透過対象色 {r, g, b}
 * @param {object} options - オプション設定
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegCustomColorTransparent = function (
  imagePath,
  targetColor,
  options = {}
) {
  return loadJpegPseudoAlphaChannel(imagePath, {
    ...options,
    targetColor: targetColor, // 透過対象色を指定
    threshold: options.threshold || 15, // Lab色差の許容値
    smooth: options.smooth !== undefined ? options.smooth : true,
    featherRadius: options.featherRadius || 1.5,
  });
};

/**
 * RGB値指定透過処理: RGB値で色を指定して透過
 * @param {string} imagePath - 画像パス
 * @param {number} r - 赤成分 (0-255)
 * @param {number} g - 緑成分 (0-255)
 * @param {number} b - 青成分 (0-255)
 * @param {object} options - オプション設定
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegRGBColorTransparent = function (
  imagePath,
  r,
  g,
  b,
  options = {}
) {
  return loadJpegCustomColorTransparent(imagePath, { r, g, b }, options);
};

/**
 * 16進数カラーコード指定透過処理
 * @param {string} imagePath - 画像パス
 * @param {string} hexColor - 16進数カラーコード ("#ffffff" など)
 * @param {object} options - オプション設定
 * @returns {Promise<Bitmap>} 処理済みBitmap
 */
window.loadJpegHexColorTransparent = function (
  imagePath,
  hexColor,
  options = {}
) {
  // 16進数を RGB に変換
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return loadJpegCustomColorTransparent(imagePath, { r, g, b }, options);
};

(() => {
  "use strict";

  const pluginName = "ImageAlphaProcessor";
  const parameters = PluginManager.parameters(pluginName);
  const whiteThreshold = parseInt(parameters["whiteThreshold"] || 240);
  const smoothEdges = parameters["smoothEdges"] === "true";

  /**
   * 業界標準色空間変換関数群
   */

  /**
   * RGB を Lab色空間に変換（CIE L*a*b*）
   * より人間の知覚に近い色空間での判定が可能
   * @param {number} r - 赤成分 (0-255)
   * @param {number} g - 緑成分 (0-255)
   * @param {number} b - 青成分 (0-255)
   * @returns {object} {L: 明度(0-100), a: 緑-赤(-128-127), b: 青-黄(-128-127)}
   */
  function rgbToLab(r, g, b) {
    // Step 1: RGB を XYZ に変換
    let rNorm = r / 255.0;
    let gNorm = g / 255.0;
    let bNorm = b / 255.0;

    // ガンマ補正
    rNorm =
      rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
    gNorm =
      gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
    bNorm =
      bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

    // XYZ変換行列（sRGB用）
    let x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
    let y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.072175;
    let z = rNorm * 0.0193339 + gNorm * 0.119192 + bNorm * 0.9503041;

    // Step 2: XYZ を Lab に変換
    // D65白色点で正規化
    x = x / 0.95047;
    y = y / 1.0;
    z = z / 1.08883;

    // Lab変換関数
    const f = (t) => (t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116);

    const fx = f(x);
    const fy = f(y);
    const fz = f(z);

    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b_lab = 200 * (fy - fz);

    return { L: L, a: a, b: b_lab };
  }

  /**
   * RGB を HSV色空間に変換
   * @param {number} r - 赤成分 (0-255)
   * @param {number} g - 緑成分 (0-255)
   * @param {number} b - 青成分 (0-255)
   * @returns {object} {h: 色相(0-360), s: 彩度(0-100), v: 明度(0-100)}
   */
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : (diff / max) * 100;
    const v = max * 100;

    if (diff !== 0) {
      switch (max) {
        case r:
          h = ((g - b) / diff + (g < b ? 6 : 0)) * 60;
          break;
        case g:
          h = ((b - r) / diff + 2) * 60;
          break;
        case b:
          h = ((r - g) / diff + 4) * 60;
          break;
      }
    }

    return { h: h, s: s, v: v };
  }

  /**
   * 統計的背景色検出（四隅サンプリング方式）
   * Adobe/GIMP系ソフトの標準手法
   * @param {Uint8ClampedArray} data - ImageData
   * @param {number} width - 画像幅
   * @param {number} height - 画像高さ
   * @returns {object} {r, g, b} 背景色
   */
  function detectBackgroundColor(data, width, height) {
    const cornerSamples = [];
    const sampleSize = Math.min(20, Math.floor(Math.min(width, height) / 10));

    // 四隅からサンプリング
    const corners = [
      { x: 0, y: 0 }, // 左上
      { x: width - sampleSize, y: 0 }, // 右上
      { x: 0, y: height - sampleSize }, // 左下
      { x: width - sampleSize, y: height - sampleSize }, // 右下
    ];

    for (const corner of corners) {
      for (let dy = 0; dy < sampleSize; dy++) {
        for (let dx = 0; dx < sampleSize; dx++) {
          const x = corner.x + dx;
          const y = corner.y + dy;
          const index = (y * width + x) * 4;

          cornerSamples.push({
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
          });
        }
      }
    }

    // 最頻色を背景色として検出
    return findMostFrequentColor(cornerSamples);
  }

  /**
   * 最頻色検出
   * @param {Array} samples - {r,g,b}の配列
   * @returns {object} {r, g, b} 最頻色
   */
  function findMostFrequentColor(samples) {
    const colorCounts = {};

    for (const sample of samples) {
      // 色を量子化（誤差を吸収）
      const quantized = `${Math.floor(sample.r / 8) * 8}-${
        Math.floor(sample.g / 8) * 8
      }-${Math.floor(sample.b / 8) * 8}`;
      colorCounts[quantized] = (colorCounts[quantized] || 0) + 1;
    }

    // 最頻色を見つける
    let maxCount = 0;
    let mostFrequent = null;

    for (const [colorKey, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        const [r, g, b] = colorKey.split("-").map(Number);
        mostFrequent = { r, g, b };
      }
    }

    return mostFrequent || { r: 255, g: 255, b: 255 };
  }

  /**
   * 業界標準：Lab色空間を使用した高精度背景色判定
   *
   * 💡 Lab色空間とは：
   * - 人間の視覚的知覚に基づいた色空間（RGB は機械的な色空間）
   * - テキスト埋め込みベクトルの類似度計算と似た概念
   * - 数値的距離 = 実際の知覚的距離 に近似
   *
   * 🎯 例：
   * RGB(250,250,250) と RGB(255,255,255) の差
   * - RGB空間: √((5)² + (5)² + (5)²) = 8.66
   * - Lab空間: 人間が感じる実際の「白さの違い」を反映
   *
   * @param {object} pixel - {r, g, b}
   * @param {object} background - {r, g, b}
   * @param {number} threshold - Lab空間での許容差（人間知覚ベース）
   * @returns {boolean} 背景色かどうか
   */
  function isPixelBackgroundLab(pixel, background, threshold = 15) {
    const pixelLab = rgbToLab(pixel.r, pixel.g, pixel.b);
    const bgLab = rgbToLab(background.r, background.g, background.b);

    // Delta E 色差計算（人間の色知覚距離）
    // これはテキスト埋め込みでのコサイン類似度と似た役割
    const deltaE = Math.sqrt(
      Math.pow(pixelLab.L - bgLab.L, 2) +
        Math.pow(pixelLab.a - bgLab.a, 2) +
        Math.pow(pixelLab.b - bgLab.b, 2)
    );

    // 閾値以下 = 「人間が同じ色だと感じる範囲」
    return deltaE < threshold;
  }

  /**
   * 旧式：RGB空間での白い背景判定（下位互換性のため残存）
   *
   * ⚠️ RGB色空間の限界：
   * - 機械的な色表現（人間の知覚とは乖離）
   * - RGB(200,200,200) と RGB(200,210,200) の違いを正しく評価できない
   * - 例：薄い緑 vs 薄いグレーの区別が困難
   *
   * 💭 テキスト埋め込みに例えると：
   * - RGB = 単語の文字数比較（機械的）
   * - Lab = 意味ベクトルの類似度（知覚的）
   *
   * @param {object} pixel - {r, g, b, a}
   * @param {number} threshold - 閾値（デフォルト: 240）
   * @returns {boolean} 白い背景かどうか
   */
  function isPixelWhiteBackground(pixel, threshold) {
    const { r, g, b } = pixel;

    // 全ての色成分が閾値以上で、かつ色の差が小さい場合に白とする
    const minChannel = Math.min(r, g, b);
    const maxChannel = Math.max(r, g, b);
    const colorVariance = maxChannel - minChannel;

    return minChannel >= threshold && colorVariance <= 30;
  }

  /**
   * バイラテラルフィルタ（エッジ保持スムージング）
   * ノイズを除去しながらエッジを保持する業界標準手法
   * @param {ImageData} imageData - 画像データ
   * @param {number} spatialSigma - 空間的重み
   * @param {number} intensitySigma - 輝度重み
   */
  function applyBilateralFilter(
    imageData,
    spatialSigma = 2,
    intensitySigma = 30
  ) {
    const { data, width, height } = imageData;
    const output = new Uint8ClampedArray(data);
    const radius = Math.ceil(spatialSigma * 2);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIndex = (y * width + x) * 4;
        const centerR = data[centerIndex];
        const centerG = data[centerIndex + 1];
        const centerB = data[centerIndex + 2];

        let weightSum = 0;
        let rSum = 0,
          gSum = 0,
          bSum = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = y + dy;
            const nx = x + dx;

            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
              const neighborIndex = (ny * width + nx) * 4;
              const nR = data[neighborIndex];
              const nG = data[neighborIndex + 1];
              const nB = data[neighborIndex + 2];

              // 空間的重み
              const spatialWeight = Math.exp(
                -(dx * dx + dy * dy) / (2 * spatialSigma * spatialSigma)
              );

              // 輝度的重み
              const intensityDiff =
                Math.abs(centerR - nR) +
                Math.abs(centerG - nG) +
                Math.abs(centerB - nB);
              const intensityWeight = Math.exp(
                -(intensityDiff * intensityDiff) /
                  (2 * intensitySigma * intensitySigma)
              );

              const weight = spatialWeight * intensityWeight;
              weightSum += weight;
              rSum += nR * weight;
              gSum += nG * weight;
              bSum += nB * weight;
            }
          }
        }

        output[centerIndex] = Math.round(rSum / weightSum);
        output[centerIndex + 1] = Math.round(gSum / weightSum);
        output[centerIndex + 2] = Math.round(bSum / weightSum);
      }
    }

    for (let i = 0; i < data.length; i++) {
      if (i % 4 !== 3) {
        // アルファ以外
        data[i] = output[i];
      }
    }
  }

  /**
   * 画像パスを正規化する関数
   * @param {string} imagePath - 元の画像パス
   * @returns {object} {folder, filename} の形式
   */
  function normalizeImagePath(imagePath) {
    // ファイル名だけの場合（プロジェクトルートに配置）
    if (!imagePath.includes("/") && !imagePath.includes("\\")) {
      return { folder: "", filename: imagePath };
    }

    // 既に正規化されたパス（img/pictures/ など）
    if (imagePath.startsWith("img/")) {
      const parts = imagePath.split("/");
      const filename = parts.pop();
      const folder = parts.join("/") + "/";
      return { folder, filename };
    }

    // 相対パス・絶対パス処理
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");
    const filename = parts.pop();
    const folder = parts.length > 0 ? parts.join("/") + "/" : "";

    return { folder, filename };
  }

  /**
   * JPEG画像を読み込んで白背景を透明化する関数
   * @param {string} imagePath - 画像ファイルのパス
   * @param {Object} options - オプション設定
   * @param {number} options.threshold - 白色判定の閾値 (デフォルト: 240)
   * @param {boolean} options.smooth - エッジスムージングを行うか (デフォルト: true)
   * @param {number} options.featherRadius - フェザー半径 (デフォルト: 1)
   * @param {number} options.timeout - タイムアウト時間(ms) (デフォルト: 10000)
   * @returns {Promise<Bitmap>} 透明化処理されたBitmapオブジェクト
   */
  window.loadJpegPseudoAlphaChannel = async function (imagePath, options = {}) {
    const threshold =
      options.threshold !== undefined ? options.threshold : whiteThreshold;
    const smooth = options.smooth !== undefined ? options.smooth : smoothEdges;
    const featherRadius = options.featherRadius || 1;
    const timeout = options.timeout || 10000; // 10秒タイムアウト

    return new Promise((resolve, reject) => {
      // 直接HTMLのImageElementを使用して読み込み
      const img = new Image();
      let timeoutId;

      // タイムアウト設定
      timeoutId = setTimeout(() => {
        reject(new Error(`画像読み込みタイムアウト: ${imagePath}`));
      }, timeout);

      img.onload = function () {
        clearTimeout(timeoutId);
        try {
          // 画像が正常に読み込まれているかチェック
          if (img.width === 0 || img.height === 0) {
            throw new Error("画像サイズが無効です");
          }

          // 新しいCanvasを作成
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = img.width;
          canvas.height = img.height;

          // 元画像をCanvasに描画
          ctx.drawImage(img, 0, 0);

          // ImageDataを取得
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // 背景色を透明化処理
          processBackgroundToTransparent(
            data,
            canvas.width,
            canvas.height,
            threshold,
            smooth,
            featherRadius,
            options.targetColor // 透過対象色（未指定時は自動検出）
          );

          // 処理したImageDataをCanvasに戻す
          ctx.putImageData(imageData, 0, 0);

          // 新しいBitmapオブジェクトを作成
          const resultBitmap = new Bitmap(canvas.width, canvas.height);
          const resultCtx = resultBitmap.context;
          resultCtx.drawImage(canvas, 0, 0);

          // ビットマップの準備完了をマーク
          resultBitmap._loadingState = "loaded";

          console.log(`透過処理完了: ${imagePath}`);
          resolve(resultBitmap);
        } catch (error) {
          clearTimeout(timeoutId);
          console.error("透過処理エラー:", error);
          reject(error);
        }
      };

      img.onerror = function () {
        clearTimeout(timeoutId);
        reject(new Error(`画像の読み込みに失敗しました: ${imagePath}`));
      };

      // 画像の読み込みを開始
      // 相対パスの場合は適切に調整
      let fullImagePath = imagePath;
      if (
        !imagePath.startsWith("http") &&
        !imagePath.startsWith("data:") &&
        !imagePath.startsWith("blob:")
      ) {
        // プロジェクトのルートディレクトリからの相対パスとして扱う
        fullImagePath = imagePath.startsWith("./")
          ? imagePath
          : "./" + imagePath;
      }

      console.log(`画像読み込み開始: ${fullImagePath}`);
      img.src = fullImagePath;
    });
  };

  /**
   * 業界標準：背景色を透明化する処理関数（Lab色空間版）
   * @param {Uint8ClampedArray} data - ImageDataの画素データ
   * @param {number} width - 画像幅
   * @param {number} height - 画像高さ
   * @param {number} threshold - Lab色差許容値
   * @param {boolean} smooth - スムージング有効フラグ
   * @param {number} featherRadius - フェザー半径
   * @param {object} targetColor - 透過対象色 {r,g,b} (未指定時は自動検出)
   */
  function processBackgroundToTransparent(
    data,
    width,
    height,
    threshold,
    smooth,
    featherRadius,
    targetColor = null
  ) {
    // 背景色の決定：指定色または自動検出
    let backgroundColor;
    if (targetColor) {
      backgroundColor = targetColor;
      console.log(
        `指定背景色を使用: RGB(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`
      );
    } else {
      backgroundColor = detectBackgroundColor(data, width, height);
      console.log(
        `背景色検出完了: RGB(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`
      );
    }

    // Lab色空間での高精度判定
    const alphaMap = new Float32Array(width * height);
    let transparentCount = 0;
    let opaqueCount = 0;

    // デバッグ用：サンプル色を記録
    const samplePixels = [];
    const maxSamples = 10;

    for (let i = 0; i < data.length; i += 4) {
      const pixel = {
        r: data[i],
        g: data[i + 1],
        b: data[i + 2],
      };
      const pixelIndex = i / 4;

      // Lab色空間での背景色判定（業界標準手法）
      const isBackground = isPixelBackgroundLab(
        pixel,
        backgroundColor,
        threshold
      );

      // デバッグ用：最初の数ピクセルの詳細を記録
      if (samplePixels.length < maxSamples) {
        const pixelLab = rgbToLab(pixel.r, pixel.g, pixel.b);
        const bgLab = rgbToLab(
          backgroundColor.r,
          backgroundColor.g,
          backgroundColor.b
        );
        const deltaE = Math.sqrt(
          Math.pow(pixelLab.L - bgLab.L, 2) +
            Math.pow(pixelLab.a - bgLab.a, 2) +
            Math.pow(pixelLab.b - bgLab.b, 2)
        );

        samplePixels.push({
          rgb: `RGB(${pixel.r},${pixel.g},${pixel.b})`,
          lab: `Lab(${pixelLab.L.toFixed(1)},${pixelLab.a.toFixed(
            1
          )},${pixelLab.b.toFixed(1)})`,
          deltaE: deltaE.toFixed(2),
          isBackground: isBackground,
          threshold: threshold,
        });
      }

      if (isBackground) {
        // 背景色の場合: 完全に透明
        alphaMap[pixelIndex] = 0;
        transparentCount++;
      } else {
        // 前景の場合: 完全に不透明
        alphaMap[pixelIndex] = 1;
        opaqueCount++;
      }
    }

    // デバッグ情報を出力
    console.log("=== 透過処理デバッグ情報 ===");
    console.log(
      `指定背景色: RGB(${backgroundColor.r}, ${backgroundColor.g}, ${backgroundColor.b})`
    );
    console.log(`使用閾値: ${threshold}`);
    console.log("サンプルピクセル判定結果:");
    samplePixels.forEach((sample, index) => {
      console.log(
        `${index + 1}. ${sample.rgb} → ${sample.lab} | DeltaE: ${
          sample.deltaE
        } | 閾値: ${sample.threshold} | 背景判定: ${sample.isBackground}`
      );
    });

    // Step 3: バイラテラルフィルタによるエッジ保持スムージング
    if (smooth) {
      const imageDataCopy = new ImageData(
        new Uint8ClampedArray(data),
        width,
        height
      );
      applyBilateralFilter(imageDataCopy, 2, 30);

      // フィルタ適用後のデータを元に戻す
      for (let i = 0; i < data.length; i += 4) {
        data[i] = imageDataCopy.data[i];
        data[i + 1] = imageDataCopy.data[i + 1];
        data[i + 2] = imageDataCopy.data[i + 2];
      }
    }

    // Step 4: 高品質アルファブレンディング
    if (featherRadius > 0) {
      applySmoothEdges(data, alphaMap, width, height, featherRadius);
    }

    // Step 5: 最終アルファ値適用
    for (let i = 0; i < data.length; i += 4) {
      const pixelIndex = i / 4;
      data[i + 3] = Math.round(alphaMap[pixelIndex] * 255);
    }

    const transparencyRate = (
      (transparentCount / (transparentCount + opaqueCount)) *
      100
    ).toFixed(1);
    console.log(`Lab色空間処理完了 - 透明度: ${transparencyRate}%`);
  }

  /**
   * ピクセルが白色背景かどうかを判定する関数
   * @param {number} r - 赤成分 (0-255)
   * @param {number} g - 緑成分 (0-255)
   * @param {number} b - 青成分 (0-255)
   * @param {number} threshold - 白色判定閾値
   * @returns {boolean} 白色背景かどうか
   */
  function isPixelWhiteBackground(r, g, b, threshold) {
    // 基本的な閾値判定
    if (r < threshold || g < threshold || b < threshold) {
      return false;
    }

    // RGB値の差が小さい（灰色・白色系）かチェック
    const maxValue = Math.max(r, g, b);
    const minValue = Math.min(r, g, b);
    const colorVariance = maxValue - minValue;

    // 色のばらつきをより緩くして、より多くの白っぽい色を検出
    // 高い閾値の場合はより厳しく、低い閾値の場合はより緩く
    const varianceThreshold = threshold >= 245 ? 10 : 20;
    const isNeutralColor = colorVariance <= varianceThreshold;
    const isHighBrightness = minValue >= threshold;

    // デバッグ用（最初の数ピクセルのみ）
    if (Math.random() < 0.001) {
      console.log(
        `🔍 RGB(${r},${g},${b}) 閾値:${threshold} 差:${colorVariance} 判定:${
          isNeutralColor && isHighBrightness
        }`
      );
    }

    return isNeutralColor && isHighBrightness;
  }

  /**
   * エッジスムージング処理（改良版）
   * @param {Uint8ClampedArray} data - ImageDataの画素データ
   * @param {Float32Array} alphaMap - アルファ値マップ
   * @param {number} width - 画像幅
   * @param {number} height - 画像高さ
   * @param {number} radius - スムージング半径
   */
  function applySmoothEdges(data, alphaMap, width, height, radius) {
    const smoothedAlpha = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const centerIndex = y * width + x;
        let totalAlpha = 0;
        let totalWeight = 0;

        // ガウシアンブラー風の重み付け
        for (let dy = -Math.ceil(radius); dy <= Math.ceil(radius); dy++) {
          for (let dx = -Math.ceil(radius); dx <= Math.ceil(radius); dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const neighborIndex = ny * width + nx;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance <= radius) {
                // ガウシアン風の重み計算（より滑らかに）
                const sigma = radius / 2;
                const weight = Math.exp(
                  -(distance * distance) / (2 * sigma * sigma)
                );

                totalAlpha += alphaMap[neighborIndex] * weight;
                totalWeight += weight;
              }
            }
          }
        }

        smoothedAlpha[centerIndex] =
          totalWeight > 0 ? totalAlpha / totalWeight : alphaMap[centerIndex];

        // エッジ境界での特別処理（アンチエイリアス）
        const originalAlpha = alphaMap[centerIndex];
        const smoothedValue = smoothedAlpha[centerIndex];

        // 境界付近（0と1の間）では、より滑らかな補間を適用
        let finalAlpha;
        if (originalAlpha === 0 || originalAlpha === 1) {
          // エッジ検出：周囲に異なる値があるか確認
          let hasEdge = false;
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const neighborIndex = ny * width + nx;
                if (Math.abs(alphaMap[neighborIndex] - originalAlpha) > 0.5) {
                  hasEdge = true;
                  break;
                }
              }
            }
            if (hasEdge) break;
          }

          // エッジの場合はスムージング値を使用、そうでなければ元の値を保持
          finalAlpha = hasEdge ? smoothedValue : originalAlpha;
        } else {
          finalAlpha = smoothedValue;
        }

        // データに適用
        const dataIndex = centerIndex * 4;
        data[dataIndex + 3] = Math.round(
          Math.max(0, Math.min(255, finalAlpha * 255))
        );
      }
    }
  }

  /**
   * プリセット関数: 高品質透過処理
   * @param {string} imagePath - 画像パス
   * @returns {Promise<Bitmap>} 処理済みBitmap
   */
  window.loadJpegHighQualityTransparent = function (imagePath) {
    return loadJpegPseudoAlphaChannel(imagePath, {
      threshold: 230,
      smooth: true,
      featherRadius: 2,
    });
  };

  /**
   * プリセット関数: 高速透過処理
   * @param {string} imagePath - 画像パス
   * @returns {Promise<Bitmap>} 処理済みBitmap
   */
  window.loadJpegFastTransparent = function (imagePath) {
    return loadJpegPseudoAlphaChannel(imagePath, {
      threshold: 245,
      smooth: false,
      featherRadius: 0,
    });
  };

  /**
   * プリセット関数: 純白背景除去（被写体保護重視）
   * @param {string} imagePath - 画像パス
   * @returns {Promise<Bitmap>} 処理済みBitmap
   */
  window.loadJpegPureWhiteTransparent = function (imagePath) {
    return loadJpegPseudoAlphaChannel(imagePath, {
      threshold: 250, // 非常に厳しい白色判定
      smooth: true,
      featherRadius: 1,
    });
  };

  /**
   * プリセット関数: AI画像用最適化透過処理
   * @param {string} imagePath - 画像パス
   * @returns {Promise<Bitmap>} 処理済みBitmap
   */
  /**
   * プリセット関数: シンプル透過処理（デバッグ用）
   * @param {string} imagePath - 画像パス
   * @returns {Promise<Bitmap>} 処理済みBitmap
   */
  window.loadJpegSimpleTransparent = function (imagePath) {
    return loadJpegPseudoAlphaChannel(imagePath, {
      threshold: 235, // より緩い設定
      smooth: false, // スムージングなしでシンプルに
      featherRadius: 0,
    });
  };

  /**
   * プリセット関数: 高品質アンチエイリアス透過処理
   * @param {string} imagePath - 画像パス
   * @returns {Promise<Bitmap>} 処理済みBitmap
   */
  // プラグインコマンド: テスト用画像処理
  PluginManager.registerCommand(pluginName, "testTransparency", (args) => {
    const imagePath =
      args.imagePath || "7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg";

    (async () => {
      try {
        console.log("透過処理テスト開始:", imagePath);
        const transparentBitmap = await loadJpegPseudoAlphaChannel(imagePath);
        console.log("透過処理テスト完了:", transparentBitmap);

        // 結果をゲーム画面に表示（テスト用）
        if (SceneManager._scene instanceof Scene_Map) {
          const sprite = new Sprite(transparentBitmap);
          sprite.x = 100;
          sprite.y = 100;
          SceneManager._scene.addChild(sprite);
        }
      } catch (error) {
        console.error("透過処理テストエラー:", error);
        $gameMessage.add("透過処理に失敗しました: " + error.message);
      }
    })();
  });

  console.log("ImageAlphaProcessor プラグインが読み込まれました");
  console.log("画像の白背景透過処理機能が利用可能です");
})();
