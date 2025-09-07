/*:
 * @target MZ
 * @plugindesc 非アクティブ時もゲーム更新を止めない（常時アクティブ）
 * @author rinne-grid
 * @help ウィンドウが非アクティブでも更新し続けます。
 * BGM のサスペンドを防ぐ簡易処理も含みます。
 */

(() => {
  // 1) ゲームアクティブ判定を常に true に
  if (Graphics.isGameActive)
    Graphics.isGameActive = function () {
      return true;
    };
  if (SceneManager.isGameActive)
    SceneManager.isGameActive = function () {
      return true;
    };

  // 2) ブラウザ/Chromium系でAudioContextがsuspendされる対策（BGMの途切れ防止）
  const resumeAudio = () => {
    const ac = window.WebAudio?._context;
    if (ac && ac.state === "suspended") {
      ac.resume().catch(() => {});
    }
  };
  document.addEventListener("visibilitychange", resumeAudio);
  window.addEventListener("focus", resumeAudio);
  window.addEventListener("blur", resumeAudio);
})();
