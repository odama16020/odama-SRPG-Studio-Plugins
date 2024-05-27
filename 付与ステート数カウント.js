/*
　付与ステート数をカウントするスクリプト
  作成者：おおだま

■概要
イベントコマンド>スクリプトの実行>コード実行 で使用します。
オリジナルデータに入れたユニットの付与ステート数をカウントし、戻り値として返します。
隠しステートを対象外とすることや、バッドステートのみを対象とすることも可能です。
また、カウント対象のステートを解除することも可能です。

■使用方法
1.プロパティに以下のメソッドを記述する
Fnc_StateCount._getStateCount(isExcludeHidden, isOnlyBadState, decreaseState);

引数
@ isExcludeHidden {boolean} true:隠しステートをカウント対象に含めない　false:隠しステートもカウントする
@ isOnlyBadState {boolean} true:バッドステートのみカウントする　false:バッドステートでないものもカウントする
@ decreaseState {boolean} true:カウント対象のステートを解除する　false:ステートを解除しない

2.「戻り値を変数で受け取る」にチェックを入れて任意の変数を指定する

3.オリジナルデータにデータを設定
ユニット：対象にしたいユニットを指定

■設定例
Fnc_StateCount._getStateCount(true, false, false);
→隠しステート以外の付与ステート数をカウント

Fnc_StateCount._getStateCount(true, true, true);
→隠しステートでないバッドステートの付与ステート数をカウント。その後、バッドステートを解除


■更新履歴
24/05/28 初回リリース
24/05/28 ステートの解除機能を追加


■動作確認バージョン
SRPG Studio Version:1.294


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。
*/

var Fnc_StateCount = {
	_getStateCount: function(isExcludeHidden, isOnlyBadState, decreaseState) {
		var content = root.getEventCommandObject().getOriginalContent();
		var unit = content.getUnit();
		var list = unit.getTurnStateList();
		var count = list.getCount();
		var result = 0;
		var i, state;
		var arr = [];

		// 付与ステート数をカウント
		for (i = 0; i < count; i++) {
			state = list.getData(i).getState();

			// isExcludeHidden が true の場合、隠しステートは数えない
			if (isExcludeHidden && state.isHidden()) {
				continue;
			}

			// isOnlyBadState が true の場合、バッドステート以外は数えない
			if (isOnlyBadState && !state.isBadState()) {
				continue;
			}
			result++;
		}

		// decreaseState が true の場合、ステートを解除
		if (decreaseState) {
			for (i = 0; i < count; i++) {
				state = list.getData(i).getState();

				// isExcludeHidden が true の場合、隠しステートは対象外
				if (isExcludeHidden && state.isHidden()) {
					continue;
				}

				// isOnlyBadState が true の場合、バッドステート以外は対象外
				if (isOnlyBadState && !state.isBadState()) {
					continue;
				}
			
				arr.push(state);
			}
			
			count = arr.length;
			for (i = 0; i < count; i++) {
				StateControl.arrangeState(unit, arr[i], IncreaseType.DECREASE);
			}
		}
		return result;
	}
};
