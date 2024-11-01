/*
　再行動カウントをリセットするスクリプト
  作成者：おおだま

■概要
イベントコマンド>スクリプトの実行>コード実行 で使用します。
再行動カウントをリセットし、ユニットを強制的に再行動可能な状態にします。

■使用方法
1.プロパティに以下のメソッドを記述する
Fnc_ResetReactionCount._execute();

3.オリジナルデータにデータを設定
ユニット：対象にしたいユニットを指定


■更新履歴
24/11/02 初回リリース


■動作確認バージョン
SRPG Studio Version:1.303


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。
*/

var Fnc_ResetReactionCount = {
	_execute: function() {
		var content = root.getEventCommandObject().getOriginalContent();
		var unit = content.getUnit();
		var reactionTurnCount = unit.getReactionTurnCount();
		
		if (reactionTurnCount > 0) {
			unit.setReactionTurnCount(0);
		}
	}
};
