//=============================================================================
// ImageTransparencyTest.js
// 画像透過処理テスト用スクリプト
//=============================================================================

/**
 * 画像透過処理テストクラス
 */
class ImageTransparencyTest {
  /**
   * 基本的な透過処理テスト
   */
  static async testBasicTransparency() {
    console.log("基本的な透過処理テストを開始します");

    try {
      // 指定されたJPEG画像を透過処理
      const transparentBitmap = await loadJpegPseudoAlphaChannel(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      console.log(
        "処理完了！サイズ:",
        transparentBitmap.width + "x" + transparentBitmap.height
      );

      // マップシーンでテスト表示
      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 100, 100, "基本透過");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("基本テストエラー:", error);
      throw error;
    }
  }

  /**
   * 高品質透過処理テスト
   */
  static async testHighQualityTransparency() {
    console.log("高品質透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegHighQualityTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 300, 100, "高品質");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("高品質透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * 高速透過処理テスト
   */
  static async testFastTransparency() {
    console.log("高速透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegFastTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 500, 100, "高速");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("高速透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * カスタム設定透過処理テスト
   */
  static async testCustomTransparency() {
    console.log("カスタム設定透過処理テストを開始します");

    const customOptions = {
      // threshold: 242, // AI画像用に最適化された閾値
      threshold: 245, // AI画像用に最適化された閾値
      smooth: true, // スムージング有効
      // featherRadius: 1.5, // 適度なフェザー
      featherRadius: 2, // 適度なフェザー
    };

    try {
      const transparentBitmap = await loadJpegPseudoAlphaChannel(
        "img/pictures/d41a8147-14ce-4879-983f-a62237e3438e.jpg",
        customOptions
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 100, 50, "カスタム");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("カスタム透過処理テストエラー:", error);
      throw error;
    }
  }

  /**
   * 純白背景除去テスト
   */
  static async testPureWhiteTransparency() {
    console.log("純白背景除去テストを開始します");

    try {
      const transparentBitmap = await loadJpegPureWhiteTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 300, 300, "純白除去");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("純白背景除去テストエラー:", error);
      throw error;
    }
  }

  /**
   * AI画像最適化透過処理テスト
   */
  static async testAIOptimizedTransparency() {
    console.log("AI画像最適化透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegAIOptimizedTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 500, 300, "AI最適化");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("AI最適化透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * シンプル透過処理テスト（デバッグ用）
   */
  static async testSimpleTransparency() {
    console.log("シンプル透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegSimpleTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 700, 300, "シンプル");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("シンプル透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * 高品質アンチエイリアス透過処理テスト
   */
  static async testSuperSmoothTransparency() {
    console.log("高品質アンチエイリアス透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegSuperSmoothTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 100, 100, "滑らか");
      }

      return transparentBitmap;
    } catch (error) {
      console.error("高品質透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * テスト用スプライト表示
   */
  static displayTestSprite(bitmap, x, y, label) {
    const sprite = new Sprite(bitmap);
    sprite.x = x;
    sprite.y = y;
    sprite.scale.x = 0.5; // 表示サイズ調整
    sprite.scale.y = 0.5;

    // ラベル表示用テキスト
    const labelSprite = new Sprite(new Bitmap(150, 30));
    labelSprite.bitmap.textColor = "#FFFFFF";
    labelSprite.bitmap.outlineColor = "#000000";
    labelSprite.bitmap.outlineWidth = 3;
    labelSprite.bitmap.drawText(label, 0, 0, 150, 30, "center");
    labelSprite.x = x;
    labelSprite.y = y - 35;

    SceneManager._scene.addChild(sprite);
    SceneManager._scene.addChild(labelSprite);

    console.log(`${label}テスト画像を (${x}, ${y}) に表示しました`);
  }

  /**
   * 全テストを実行
   */
  static async runAllTests() {
    console.log("全透過処理テストを開始します");

    try {
      // await this.testBasicTransparency();
      await this.testHighQualityTransparency();
      // await this.testFastTransparency();
      // await this.testCustomTransparency();
      // await this.testPureWhiteTransparency();
      await this.testAIOptimizedTransparency();

      console.log("全てのテストが完了しました");

      // 成功メッセージ
      if ($gameMessage) {
        $gameMessage.add("\\C[3]画像透過処理テスト完了");
        $gameMessage.add("\\C[0]改良版アルゴリズムが正常に動作しています");
      }
    } catch (error) {
      console.error("テスト実行中にエラーが発生しました:", error);

      if ($gameMessage) {
        $gameMessage.add("\\C[2]⚠ テスト中にエラーが発生しました");
        $gameMessage.add("\\C[0]" + error.message);
      }
    }
  }

  /**
   * 新しいアルゴリズムのテストのみ実行
   */
  static async runNewAlgorithmTests() {
    console.log("改良版アルゴリズムのテストを開始します");

    try {
      await this.testPureWhiteTransparency();
      await this.testAIOptimizedTransparency();

      console.log("改良版テストが完了しました");

      if ($gameMessage) {
        $gameMessage.add("\\C[3]改良版透過処理テスト完了");
        $gameMessage.add("\\C[0]被写体を保護しつつ白背景を除去しています");
      }
    } catch (error) {
      console.error("改良版テストエラー:", error);
      throw error;
    }
  }

  /**
   * Lab色空間：高品質透過処理テスト
   */
  static async testLabSuperSmoothTransparency() {
    console.log("Lab色空間高品質透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegSuperSmoothTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 50, 0, "Lab-SuperSmooth");
      }

      console.log("Lab色空間高品質処理完了（業界標準品質）");
      return transparentBitmap;
    } catch (error) {
      console.error("Lab色空間高品質処理エラー:", error);
      throw error;
    }
  }

  /**
   * Lab色空間：AI最適化透過処理テスト
   */
  static async testLabAIOptimizedTransparency() {
    console.log("Lab色空間AI最適化透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegAIOptimizedTransparent(
        // "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg",
        "img/pictures/d41a8147-14ce-4879-983f-a62237e3438e.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 250, 0, "Lab-AI-Optimized");
      }

      console.log("Lab色空間AI最適化処理完了");
      return transparentBitmap;
    } catch (error) {
      console.error("Lab色空間AI最適化処理エラー:", error);
      throw error;
    }
  }

  /**
   * Lab色空間：写真品質透過処理テスト
   */
  static async testLabPhotoGradeTransparency() {
    console.log("Lab色空間写真品質透過処理テストを開始します");

    try {
      const transparentBitmap = await loadJpegPhotoGradeTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg"
      );

      if (SceneManager._scene instanceof Scene_Map) {
        this.displayTestSprite(transparentBitmap, 450, 0, "Lab-PhotoGrade");
      }

      console.log("Lab色空間写真品質処理完了（プロ仕様）");
      return transparentBitmap;
    } catch (error) {
      console.error("Lab色空間写真品質処理エラー:", error);
      throw error;
    }
  }

  /**
   * Lab色空間：全手法比較テスト
   */
  static async testAllLabMethods() {
    console.log("Lab色空間業界標準手法の総合テストを開始します");

    try {
      // 3つの手法を同時実行
      await Promise.all([
        // this.testLabSuperSmoothTransparency(),
        this.testLabAIOptimizedTransparency(),
        // this.testLabPhotoGradeTransparency(),
      ]);

      console.log("Lab色空間全手法テスト完了（業界標準品質）");
    } catch (error) {
      console.error("Lab色空間全手法テストエラー:", error);
    }
  }
}

// カスタム色透過処理のテスト関数群
class CustomColorTransparencyTest {
  /**
   * RGB指定透過処理テスト
   */
  static async testRGBColorTransparency() {
    console.log("RGB指定透過処理テストを開始します");

    try {
      // 例：赤色 (255, 0, 0) を透過
      const transparentBitmap = await loadJpegRGBColorTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg",
        255,
        0,
        0, // 赤色を指定
        { threshold: 20, smooth: true, featherRadius: 2 }
      );

      if (SceneManager._scene instanceof Scene_Map) {
        ImageTransparencyTest.displayTestSprite(
          transparentBitmap,
          100,
          200,
          "RGB赤透過"
        );
      }

      console.log("RGB指定透過処理テスト完了");
      return transparentBitmap;
    } catch (error) {
      console.error("RGB指定透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * 16進数カラーコード指定透過処理テスト
   */
  static async testHexColorTransparency() {
    console.log("16進数カラーコード指定透過処理テストを開始します");

    try {
      // 例：白色 "#ffffff" を透過
      const transparentBitmap = await loadJpegHexColorTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg",
        "#ffffff", // 白色を指定
        { threshold: 15, smooth: true, featherRadius: 1.5 }
      );

      if (SceneManager._scene instanceof Scene_Map) {
        ImageTransparencyTest.displayTestSprite(
          transparentBitmap,
          300,
          200,
          "HEX白透過"
        );
      }

      console.log("16進数カラーコード指定透過処理テスト完了");
      return transparentBitmap;
    } catch (error) {
      console.error("16進数カラーコード指定透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * カスタム背景色透過処理テスト
   */
  static async testCustomBackgroundColor() {
    console.log("カスタム背景色透過処理テストを開始します");

    try {
      // 例：薄いグレー色を透過
      const transparentBitmap = await loadJpegCustomColorTransparent(
        "img/pictures/7793c685-5b51-47de-b3b5-c3a72484f8cc.jpg",
        { r: 240, g: 240, b: 240 }, // 薄いグレー
        { threshold: 10, smooth: true, featherRadius: 2 }
      );

      if (SceneManager._scene instanceof Scene_Map) {
        ImageTransparencyTest.displayTestSprite(
          transparentBitmap,
          500,
          200,
          "グレー透過"
        );
      }

      console.log("カスタム背景色透過処理テスト完了");
      return transparentBitmap;
    } catch (error) {
      console.error("カスタム背景色透過処理エラー:", error);
      throw error;
    }
  }

  /**
   * 全カスタム色テストを実行
   */
  static async runAllCustomColorTests() {
    console.log("全カスタム色透過処理テストを開始します");

    try {
      await Promise.all([
        this.testRGBColorTransparency(),
        this.testHexColorTransparency(),
        this.testCustomBackgroundColor(),
      ]);

      console.log("全カスタム色透過処理テストが完了しました");

      if ($gameMessage) {
        $gameMessage.add("\\C[3]カスタム色透過処理テスト完了");
        $gameMessage.add("\\C[0]指定色での透過処理が正常に動作しています");
      }
    } catch (error) {
      console.error("カスタム色テスト実行中にエラーが発生しました:", error);
    }
  }
}

// カスタム色テスト用グローバル関数
window.CustomColorTransparencyTest = CustomColorTransparencyTest;

// コンソールから実行可能なようにグローバルに登録
window.ImageTransparencyTest = ImageTransparencyTest;

// 簡単アクセス関数
window.testImageTransparency = () => ImageTransparencyTest.runAllTests();
window.testNewAlgorithm = () => ImageTransparencyTest.runNewAlgorithmTests();
window.testPureWhite = () => ImageTransparencyTest.testPureWhiteTransparency();
window.testAIOptimized = () =>
  ImageTransparencyTest.testAIOptimizedTransparency();
window.testSimple = () => ImageTransparencyTest.testSimpleTransparency();
window.testSuperSmooth = () =>
  ImageTransparencyTest.testSuperSmoothTransparency();

// Lab色空間用簡単アクセス関数
window.testLabSuperSmooth = () =>
  ImageTransparencyTest.testLabSuperSmoothTransparency();
window.testLabAIOptimized = () =>
  ImageTransparencyTest.testLabAIOptimizedTransparency();
window.testLabPhotoGrade = () =>
  ImageTransparencyTest.testLabPhotoGradeTransparency();
window.testAllLabMethods = () => ImageTransparencyTest.testAllLabMethods();

// カスタム色透過処理用簡単アクセス関数
window.testRGBColor = () =>
  CustomColorTransparencyTest.testRGBColorTransparency();
window.testHexColor = () =>
  CustomColorTransparencyTest.testHexColorTransparency();
window.testCustomColor = () =>
  CustomColorTransparencyTest.testCustomBackgroundColor();
window.testAllCustomColors = () =>
  CustomColorTransparencyTest.runAllCustomColorTests();

console.log("ImageTransparencyTest クラスが読み込まれました");
console.log("testImageTransparency() で全テストを開始できます");
console.log("testNewAlgorithm() で改良版のみテストできます");
console.log("testSimple() でシンプルテストを実行できます");
console.log("testSuperSmooth() で滑らかなアンチエイリアス処理をテストできます");
console.log(
  "Lab色空間版: testAllLabMethods() で業界標準手法の全テストが実行できます"
);
console.log("--- カスタム色透過処理 ---");
console.log("testRGBColor() でRGB指定透過処理をテストできます");
console.log("testHexColor() で16進数カラーコード指定透過処理をテストできます");
console.log("testCustomColor() でカスタム背景色透過処理をテストできます");
console.log("testAllCustomColors() で全カスタム色透過処理テストを実行できます");
