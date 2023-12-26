
/*--------------------------------------------------------------------------

　ステ画面ステート表示（スタック数対応版）
  オリジナル作成者：名前未定様
  改変版作成者：おおだま

■注意
本プラグインは名前未定様作「ステ画面ステート表示」をスタック数の表示に対応させた改変版です。
既に該当のプラグインを使用されている場合、設定値を移行した上でこちらを使用し、元のプラグインは使用しないようにしてください。
（ファイル名先頭に"$"を付けることで、ファイルを残したままプラグインを無効化できます）

本プラグインを使用して発生した不具合について、名前未定様に質問するのは絶対にやめてください。

■概要
　ステータス画面にあるステート表示部分にマウスカーソルを合わせると
　ステートの情報が表示されるようになります

　また、ステータス画面で、アイテムのヘルプから←を押すorスキルのヘルプから↓を押すとステートのヘルプが見れます
　（ステートのヘルプからは、最上段で↑でスキル、最下段で↓でアイテムのヘルプに移動します

■事前の調整
　上手く重なって表示されない場合、
　「var MenuStateIconDisplay = false;」のfalseをtrueにするとステータス画面でのアイコンが表示されます。
　そのアイコンがセンテンスウィンドウ上のステートと重なるように
　MenuStateBaseX、MenuStateBaseY、MenuStateIconAreaWidth、MenuStateIconAreaHeightの値を調整して下さい


　また、通常はステータス画面以外の画面（ユニット出撃）ではステート表示を行わないようにしていますが、
　「var MenuStateIconDisplay = true;」「var AlwaysStateIconDisplay = true;」とした場合は
　ユニット出撃でもステート表示が行われるようになります。
　（ユニット出撃でもステートが表示されるレイアウトとした場合の使用を想定しています）

■カスタマイズ
　１．ステートアイコンの縦横の並び数を変えたい
　　　→「var MenuStateIconCol = 2;」と「var MenuStateIconRaw = 6;」の数字部分を弄ってください

　　　　　　　MenuStateIconCol：ステートアイコンを横に並べる数
　　　　　　　MenuStateIconRaw：ステートアイコンを縦に並べる数
　　　　　　　となっています

　２．ステート名を表示したい
　　　→「var MenuStateTextDisplay = false;」のfalseをtrueにしてください
　　　※MenuStateIconDisplayとMenuStateTextDisplayの両方をtrueにすると、ステートアイコンとステート名が表示されます。
　　　　MenuStateIconDisplayをfalseにしてMenuStateTextDisplayをtrueにすると、ステート名のみ表示されます。

　　　　ステートアイコンの表示幅は「var MenuStateIconAreaWidth = 46;」で設定しています（センテンスウィンドウへの描画を想定して46になっています。ステート名表示を行う場合25くらいにするといいです）
　　　　ステート名の表示幅は「var MenuStateTextAreaWidth = 120;」で設定しています。
　　　　MenuStateIconDisplayとMenuStateTextDisplayの両方をtrueにした場合、１つのステートの表示幅はMenuStateIconAreaWidth+MenuStateTextAreaWidth分になります。
　　　　MenuStateIconDisplayをfalseにしてMenuStateTextDisplayをtrueにすると、１つのステートの表示幅はMenuStateTextAreaWidth分になります。

　３．ステート名のフォントを変えたい
　　　→「var MenuStateTextFontID = 0;」の数字部分を変えて下さい。
　　　　※データ設定→コンフィグの中にあるフォントを選択し、指定したいフォントのIDを調べて入力して下さい。
　　　　　（サイズは指定したIDのフォントに設定してあるサイズをそのまま使用します。欲しいサイズが無い場合はフォントの作成で新たに作成してサイズを合わせて下さい）

　４．MenuStateIconDisplayをtrueにしている時に持続ターンも表示したい
　　　→「var MenuStateTurnDisplay = false;」のfalseをtrueにしてください
　　　　また持続ターンの数値の表示X座標は「var MenuStateTurnPosX = 30;」の数値を弄る事で左右に動かせます

　５．MenuStateIconDisplayをtrueにしている時にセンテンスウィンドウにある従来のステート表示機能を無しにしたい
　　　→「var SentenceStateRemove = false;」のfalseをtrueにしてください

　６．ステート情報ウィンドウの位置を変更したい
　　　→「var MenuStateInfoHoseiX = 0;」「var MenuStateInfoHoseiX = 0;」の数字部分を変更して下さい

　７．MenuStateIconDisplay true時、フュージョンしてもステートアイコンの位置がずれないようにしたい
　　　※独自レイアウトにしたケースでフュージョンをしたかどうかがステートアイコンの位置に影響しないようにしたい
　　　→「var isFusionShiftPosiion = true;」のtrueをfalseに変えて下さい

　８．ステート表示項目のテキストを変えたい
　　　→「var StateSentenceNameText = 'ｽﾃｰﾄ名';」から「var StateSentenceAutoText = '自動AI ';」までの設定項目の
　　　　''の中を書き換える事で、ステートの各項目を見た時のテキストを変更できます。
　　　　なお封印項目：物理、封印項目：魔法、封印項目：アイテム、封印項目：杖に関しては必ず最後に空白を入れて下さい。
　　　　（複数表示されることがあるので空白を入れておかないと文字が詰まってしまいます）


■更新履歴（改変元）
17/ 9/24　新規作成
17/ 9/28　フュージョンしたユニットのステートの場合、マウスカーソル位置がずれてしまうバグを修正
　　　　　iteminfo_ex.jsとの併用時に行間を詰めるようにした
17/10/10　unitmenu_sentence_ex.jsを併用している場合の対応を強化（自動でY座標とアイコン高さを補正するようになりました）
18/ 1/17　1.171対応
          残ﾀｰﾝの表示が残りターンではなく最大ターンを表示していたのを修正
18/ 7/04　ステートオプション（行動停止/暴走/自動AI）のチェックに誤りがあり、オプションが複数表示されてしまうのを修正
19/ 7/23　MenuStateIconDisplayをtrueにした状態でステートを付加してステータス画面を見るとエラー落ちするバグを修正
19/10/07　ステート名表示用の設定を追加。ステートアイコンの縦横の並び数を変えられる設定を追加
19/10/07b ステート名表示のフォント設定を追加。
19/11/09　MenuStateIconDisplayをtrueにした時にターン数も表示させる設定を追加
19/11/15　武器やスキルの情報とステートアイコン類が重なるとステートアイコン類が上になるバグを修正
19/11/28　ステート情報ウィンドウの位置補正設定を追加
　　　　　フュージョン時にステートアイコン位置が変わらない設定を追加（独自レイアウト用）
20/10/16　ステートが複数行列に存在する場合、上キー押下で下へ回るor下キー押下で最上段に回る場合にアイテム/スキルと切替に修正
22/09/01　MenuStateTextDisplayがtrueの場合、ステート名が長いと小さく表示されるバグを修正
        　ステート表示項目のテキストをカスタマイズしやすいように設定項目へ追加

■更新履歴（改変後）
23/12/27　改変版初回リリース
          ステートのスタック数を表示する機能を追加

■動作確認バージョン
　SRPG Studio Version:1.288


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。どんどん改造してください。
・クレジット明記無し　OK
・再配布、転載　OK
・SRPG Studio利用規約は遵守してください。
  
--------------------------------------------------------------------------*/

(function() {
//-------------------------------------------------------
// 設定
//-------------------------------------------------------
var MenuStateBaseX           = 450;			// ステート表示の基準X座標
var MenuStateBaseY           = 20;			// ステート表示の基準Y座標
var MenuStateIconAreaWidth   = 46;			// ステート表示部分のアイコン幅
var MenuStateIconAreaHeight  = 25;			// ステート表示部分のアイコン高さ

var MenuStateHoseiY          = 40;			// unitmenu_sentence_ex.jsを使用している場合のY座標補正値
var MenuStateIconHoseiHeight = -4;			// unitmenu_sentence_ex.jsを使用している場合のアイコン高さ補正値

var MenuStateInfoHoseiX      = 0;			// ステート情報ウィンドウのX座標補正
var MenuStateInfoHoseiY      = 0;			// ステート情報ウィンドウのY座標補正

var MenuStateIconCol         = 2;			// ステートアイコンを横に並べる数
var MenuStateIconRaw         = 6;			// ステートアイコンを縦に並べる数

var MenuStateIconDisplay     = false;		// ステ画面のステート表示でのアイコンを表示（true：表示　false：表示しない）
var AlwaysStateIconDisplay   = false;		// ステータス画面以外でも、ステート表示がONならばステートアイコンを表示するか（true：表示　false：表示しない）

var MenuStateTextDisplay     = false;		// ステ画面のステート表示でステート名を表示（true：表示　false：表示しない）
var MenuStateTextAreaWidth   = 120;			// ステート名表示部分の幅
var MenuStateTextFontID      = 0;			// ステート名フォントID

var MenuStateTurnDisplay     = false;		// MenuStateIconDisplayがtrueの時に持続ターンも表示するか（true：表示　false：表示しない）
var MenuStateTurnPosX        = 30;			// 持続ターンの表示X位置補正（アイコンの右側30ドットから描画）
var isStateTurnTumeru        = false;		// ターンの数字表示を詰めて描くか（true:詰める false:従来通り）
var isStateTurnFontDraw      = false;		// ターンの数字を文字で描画するか（true:文字描画 false:従来通り）

var MenuStateIconSiz         = 24;			// MenuStateIconDisplayがtrueの時のアイコン描画サイズ（通常24ですが小さくすると縮小されます）

var SentenceStateRemove      = false;		// センテンスウィンドウのステート表示を取り除くか（true：取り除く　false：取り除かない（従来通り））

var isFusionShiftPosiion     = true;		// MenuStateIconDisplay true時、ﾌｭｰｼﾞｮﾝでｽﾃｰﾄｱｲｺﾝのY座標をずらすか（true:ずらす false:ずらさない）

// 以下ステート表示項目のテキスト
var StateSentenceNameText     = 'ｽﾃｰﾄ名';			// ステート名のテキスト
var StateSentenceBadText      = 'バッドステート';	// バッドステートのテキスト
var StateSentenceTurnText     = '残ﾀｰﾝ';			// 残りターン数のテキスト
var StateSentenceRecoverText  = '回復';				// 回復量表示時のテキスト
var StateSentenceDamageText   = 'ﾀﾞﾒｰｼﾞ';			// ダメージ量表示時のテキスト
var StateSentenceStack        = 'ｽﾀｯｸ';			// スタック数表示時のテキスト

var StateSentenceSealText     = '封印';				// 封印のテキスト
var StateSentencePhysicText   = '物理 ';			// 封印項目：物理のテキスト（最後に空白を入れて下さい）
var StateSentenceMagicText    = '魔法 ';			// 封印項目：魔法のテキスト（最後に空白を入れて下さい）
var StateSentenceItemText     = 'アイテム ';		// 封印項目：アイテムのテキスト（最後に空白を入れて下さい）
var StateSentenceWandText     = '杖 ';				// 封印項目：杖のテキスト（最後に空白を入れて下さい）

var StateSentenceOptionText   = 'ｵﾌﾟｼｮﾝ';			// オプションのテキスト
var StateSentenceNoActionText = '行動禁止 ';		// オプション項目：行動禁止のテキスト
var StateSentenceBerserkText  = '暴走 ';			// オプション項目：暴走のテキスト
var StateSentenceAutoText     = '自動AI ';			// オプション項目：自動AIのテキスト




//-------------------------------------------------------
// 以下プログラム
//-------------------------------------------------------


//-------------------------------------------------------
// UnitMenuBottomWindowクラス
//-------------------------------------------------------
// ステータス画面の場合のみ、ステート表示用フラグをセット（ユニット出撃画面などではステートが出ないようにしている）
var alias00 = UnitMenuScreen._setMenuData;
UnitMenuScreen._setMenuData= function() {
		alias00.call(this);
		
		var i, count;
		
		count = this._bottomWindowArray.length;
		for (i = 0; i < count; i++) {
			this._bottomWindowArray[i].setStateDispFlag();
		}
}




//-------------------------------------------------------
// BaseMenuBottomWindowクラス
//-------------------------------------------------------
// ステート表示用フラグをセット
BaseMenuBottomWindow.setStateDispFlag= function() {
		this._isStateDisp = true;
}


// ステート表示判定（trueならステートを表示）
BaseMenuBottomWindow.isStateDispFlag= function() {
		if( MenuStateIconDisplay !== true || AlwaysStateIconDisplay !== true || MenuStateTextDisplay !== true ) {
			if( this._isStateDisp != true ) {
				return false;
			}
		}
		
		return true;
}




//-------------------------------------------------------
// UnitMenuBottomWindowクラス
//-------------------------------------------------------
var UnitMenuHelp = {
	ITEM: 0,
	SKILL: 1,
	STATE: 2
};

// ステータス画面下部ウィンドウ：ユニットメニューデータの設定
var alias01 = UnitMenuBottomWindow.setUnitMenuData;
UnitMenuBottomWindow.setUnitMenuData= function() {
	alias01.call(this);
	
	this._stateInteraction = createObject(StateInteraction);
}


var alias02 = UnitMenuBottomWindow.changeUnitMenuTarget;
UnitMenuBottomWindow.changeUnitMenuTarget= function(unit) {
	alias02.call(this, unit);
	
	this._setStateData(unit);
	this._stateInteraction.checkInitialTopic();
}


UnitMenuBottomWindow.moveWindowContent= function() {
	var recentlyInput;
	
	this._itemInteraction.moveInteraction();
	this._skillInteraction.moveInteraction();
	this._stateInteraction.moveInteraction();
	
	if (!this.isHelpMode()) {
		return MoveResult.CONTINUE;
	}
	
	if (this._unitMenuHelp === UnitMenuHelp.ITEM) {
		recentlyInput = this._itemInteraction.getInteractionScrollbar().getRecentlyInputType();
		if ( recentlyInput === InputType.RIGHT ) {
			if ( this._skillInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.SKILL;
				this._skillInteraction.setHelpMode();
			}
			else if ( this._stateInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._skillInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.STATE;
				this._stateInteraction.setHelpMode();
			}
		}
		else if ( recentlyInput === InputType.LEFT ) {
			if ( this._stateInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._skillInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.STATE;
				this._stateInteraction.setHelpMode();
			}
			else if ( this._skillInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.SKILL;
				this._skillInteraction.setHelpMode();
			}
		}
	}
	else if (this._unitMenuHelp === UnitMenuHelp.SKILL) {
		recentlyInput = this._skillInteraction.getInteractionScrollbar().getRecentlyInputType();
		if ( recentlyInput === InputType.UP ) {
			if ( this._itemInteraction.isHelpAvailable() ) {
				this._skillInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.ITEM;
				this._itemInteraction.setHelpMode();
			}
			else if ( this._stateInteraction.isHelpAvailable() ) {
				this._skillInteraction.cancelInteraction();
				this._itemInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.STATE;
				this._stateInteraction.setHelpMode();
			}
		}
		else if ( recentlyInput === InputType.DOWN ) {
			if ( this._stateInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._skillInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.STATE;
				this._stateInteraction.setHelpMode();
			}
			else if ( this._itemInteraction.isHelpAvailable() ) {
				this._skillInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.ITEM;
				this._itemInteraction.setHelpMode();
			}
		}
	}
	else if (this._unitMenuHelp === UnitMenuHelp.STATE) {
		recentlyInput = this._stateInteraction.getInteractionScrollbar().getRecentlyInputType();
		// ステートヘルプ表示時、最下段で下が押されたら切替(=押した後で一番上にある)
		if ( recentlyInput === InputType.DOWN ) {
			if ( this._itemInteraction.isHelpAvailable() ) {
				this._skillInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.ITEM;
				this._itemInteraction.setHelpMode();
			}
			else if ( this._skillInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.SKILL;
				this._skillInteraction.setHelpMode();
			}
		}
		// ステートヘルプ表示時、最上段で上が押されたら切替(=押した後で一番下にある)
		else if ( recentlyInput === InputType.UP ) {
			if ( this._skillInteraction.isHelpAvailable() ) {
				this._itemInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.SKILL;
				this._skillInteraction.setHelpMode();
			}
			else if ( this._itemInteraction.isHelpAvailable() ) {
				this._skillInteraction.cancelInteraction();
				this._stateInteraction.cancelInteraction();
				this._unitMenuHelp = UnitMenuHelp.ITEM;
				this._itemInteraction.setHelpMode();
			}
		}
	}

	return MoveResult.CONTINUE;
}


var alias03 = UnitMenuBottomWindow.drawWindowContent;
UnitMenuBottomWindow.drawWindowContent= function(x, y) {
	this._drawStateX = x;		// ステート表示はUnitMenuBottomWindow._drawSkillArea()で行うよう変更するが
	this._drawStateY = y;		// 表示座標はここで保持する（こうしないと目視で調整：ステータス画面項目位置.jsと併用した際にスキル位置を変えたらステートアイコンもずれてしまう）
	
	alias03.call(this, x, y);
}


var alias03b = UnitMenuBottomWindow._drawSkillArea;
UnitMenuBottomWindow._drawSkillArea= function(x, y) {
	alias03b.call(this, x, y);

	this._drawStateArea(this._drawStateX, this._drawStateY);	// drawとは書いてるけど実際には描画しない
}


var alias04 = UnitMenuBottomWindow.isHelpMode;
UnitMenuBottomWindow.isHelpMode= function() {
	var value = alias04.call(this);
	return value || this._stateInteraction.isHelpMode();
}


var alias05 = UnitMenuBottomWindow.isTracingHelp;
UnitMenuBottomWindow.isTracingHelp= function() {
		var value = alias05.call(this);
		return value || this._stateInteraction.isTracingHelp();
}


var alias06 = UnitMenuBottomWindow.setHelpMode;
UnitMenuBottomWindow.setHelpMode= function() {
		var value = alias06.call(this);

		if ( value == true ) {
			return true;
		}
		
		if (this._stateInteraction.setHelpMode()) {
			this._unitMenuHelp = UnitMenuHelp.STATE;
			return true;
		}
		
		return false;
}


var alias07 = UnitMenuBottomWindow.getHelpText;
UnitMenuBottomWindow.getHelpText= function() {
		var text = alias07.call(this);
		var help = this._getActiveUnitMenuHelp();
		
		if (help === UnitMenuHelp.STATE) {
			text = this._stateInteraction.getHelpText();
		}
		
		return text;
}


UnitMenuBottomWindow._setStateData= function(unit) {
		var i, turnState;
		var list = unit.getTurnStateList();
		var count = list.getCount();
		var newTurnStateArray = [];
		
		if( this.isStateDispFlag() !== true ) {
			return;
		}
		
		// （改変）ユニットのスタック情報をグローバルパラメータに持たせる
		root.getMetaSession().global.stackState = [];
		for (i = 0; i < count; i++) {
			turnState = list.getData(i);
			state = turnState.getState();
			if ( !state.isHidden() ) {
				newTurnStateArray.push(turnState);
				if (typeof unit.custom.stackState !== 'undefined' && typeof unit.custom.stackState[state.getId()] === 'number') {
					root.getMetaSession().global.stackState[state.getId()] = unit.custom.stackState[state.getId()];
				}
			}
		}

		this._stateInteraction.setTurnStateArray(newTurnStateArray);
}


var alias08 = UnitMenuBottomWindow._drawInfoWindow;
UnitMenuBottomWindow._drawInfoWindow= function(xBase, yBase) {
		var x, help;
		
		alias08.call(this, xBase, yBase);

		if (this._isTracingLocked) {
			return;
		}
		
		help = this._getActiveUnitMenuHelp();
		
		if (help === UnitMenuHelp.STATE) {
			this._stateInteraction.getInteractionWindow().drawWindow(xBase+MenuStateInfoHoseiX, yBase+MenuStateInfoHoseiY);
		}
}


var alias09 = UnitMenuBottomWindow._getActiveUnitMenuHelp;
UnitMenuBottomWindow._getActiveUnitMenuHelp= function() {
		var help = alias09.call(this);
		
		if (help == -1 ) {
			if (this._stateInteraction.isTracingHelp()) {
				help = UnitMenuHelp.STATE;
			}
			else if (this._stateInteraction.isHelpMode()) {
				help = UnitMenuHelp.STATE;
			}
		}
		
		return help;
}


UnitMenuBottomWindow._drawStateArea= function(xBase, yBase) {
		var dx = MenuStateBaseX;
		var dy = MenuStateBaseY;

		// unitmenu_sentence_ex.jsが入っている場合はY座標を補正する
		if( typeof UnitSentenceWindowEx !== 'undefined' ) {
			dy += MenuStateHoseiY;
		}
		
		// フュージョン時はフュージョンアイコンが表示される為、Y座標を補正する
		if( isFusionShiftPosiion === true && FusionControl.getFusionChild(this._unit) != null ) {

			// 通常はUnitSentenceWindow.getUnitSentenceSpaceY()の値でY座標を補正する
			if( typeof UnitSentenceWindowEx === 'undefined' ) {
				dy += UnitSentenceWindow.getUnitSentenceSpaceY();
			}
			// unitmenu_sentence_ex.jsが入っている場合はUnitSentenceWindowEx.getUnitSentenceSpaceY()の値でY座標を補正する
			else {
				dy += UnitSentenceWindowEx.getUnitSentenceSpaceY();
			}
		}

		this._stateInteraction.getInteractionScrollbar().drawScrollbar(xBase + dx, yBase + dy);
}




//-------------------------------------------------------
// IconStateScrollbarクラス
//-------------------------------------------------------
var IconStateScrollbar = defineObject(BaseScrollbar,
{
	// ステートアイコンの描画
	// （通常はセンテンスウィンドウで描いてるので不要です。レイアウトを変えた時など、位置調整が必要な時にONしてください）
	drawScrollContent: function(x, y, object, isSelect, index) {
		var handle;
		var siz = MenuStateIconSiz;

		// MenuStateIconDisplayがtrueならステートアイコンを描画
		if( MenuStateIconDisplay == true ) {
			handle = object.getState().getIconResourceHandle();
//			GraphicsRenderer.drawImage(x, y, handle, GraphicsType.ICON);
			GraphicsRenderer.drawStateIconShrink(x, y, handle, GraphicsType.ICON, siz, siz);

			// MenuStateTurnDisplayがtrueならステートの持続ターンを描画
			if( MenuStateTurnDisplay == true ) {
				// object = TurnState
				if (object.getTurn() !== 0) {
					this._drawNumbers(x+MenuStateTurnPosX, y, object.getTurn());
				}
				else {
					this._drawSigns(x+MenuStateTurnPosX, y, StringTable.SignWord_Limitless);
				}
			}

			x += MenuStateIconAreaWidth;	// ステート表示部分のアイコン幅ドット横へずらす
		}
		
		// MenuStateTextDisplayがtrueならステート名を描画
		if( MenuStateTextDisplay == true ) {
			this._drawStateText(x, y, object.getState().getName());
		}
	},
	
	getRecentlyInputType: function() {
		var cnvIndex, bottom;
		var index = this.getIndex();
		var inputType = this._inputType;
		
		// マウスの場合はそのまま返す
		if( inputType === InputType.MOUSE ) {
			return inputType;
		}
		
		// 横のみ項目が並ぶ場合
		if (this._rowCount === 1) {
			// 上下キーはそのまま返す
			if( inputType === InputType.UP || inputType === InputType.DOWN ) {
				return inputType;
			}
			// 左キー押下かつ配列の一番最後ならキーを返す
			else if( inputType === InputType.LEFT ) {
				if( index === this._objectArray.length-1 ) {
					return inputType;
				}
			}
			// 右キー押下かつ配列の一番最初ならキーを返す
			else if( inputType === InputType.RIGHT ) {
				if( index === 0 ) {
					return inputType;
				}
			}
			
			return InputType.NONE;
		}
		
		// 縦のみ項目が並ぶ場合
		if (this._col === 1) {
			// 左右キーはそのまま返す
			if( inputType === InputType.LEFT || inputType === InputType.RIGHT ) {
				return inputType;
			}
			// 上キー押下かつ配列の一番最後ならキーを返す
			else if( inputType === InputType.UP ) {
				if( index === this._objectArray.length-1 ) {
					return inputType;
				}
			}
			// 下キー押下かつ配列の一番最初ならキーを返す
			else if( inputType === InputType.DOWN ) {
				if( index === 0 ) {
					return inputType;
				}
			}
			
			return InputType.NONE;
		}
		
		// 縦横に項目が並ぶ場合
		
		// 左キーは左の判定チェック
		if( inputType === InputType.LEFT ) {
			cnvIndex = index % this._col;
			
			if( index === this._col-1 ) {
				return inputType;
			}
		}
		// 右キーは右の判定チェック
		else if( inputType === InputType.RIGHT ) {
			cnvIndex = index % this._col;
			
			if( index === 0 ) {
				return inputType;
			}
		}
		// 上キーは上の判定チェック
		else if( inputType === InputType.UP ) {
			cnvIndex = Math.floor(index / this._col);
			bottom = Math.ceil(this._objectArray.length / this._col) - 1;
			
			if( cnvIndex === bottom ) {
				return inputType;
			}
		}
		// 下キーは下の判定チェック
		else if( inputType === InputType.DOWN ) {
			cnvIndex = Math.floor(index / this._col);
			
			if( cnvIndex === 0 ) {
				return inputType;
			}
		}
		
		return InputType.NONE;
	},
	
	_drawNumbers: function(x, y, number) {
		if( isStateTurnFontDraw !== true ) {
			if( isStateTurnTumeru !== true ) {
				NumberRenderer.drawNumber(x, y, number);
			}
			else {
				NumberRenderer.drawRightNumber(x, y, number);
			}
		}
		else {
			this._drawNumbersBytext(x, y, number, ColorValue.DEFAULT);
		}
	},
	
	_drawSigns: function(x, y, sign) {
		if( isStateTurnFontDraw !== true ) {
			if( isStateTurnTumeru !== true ) {
				TextRenderer.drawSignText(x-7, y, sign);
			}
			else {
				TextRenderer.drawSignText(x, y, sign);
			}
		}
		else {
			this._drawNumbersBytext(x, y, sign, ColorValue.INFO);
		}
	},
	
	_drawNumbersBytext: function(x, y, number, color) {
		var font = root.getBaseData().getFontList().getDataFromId(MenuStateTextFontID);		// フォントID
		var valueText = number.toString();
		var valueHoseiX = 0;
		
		if( isStateTurnTumeru !== true ) {
			valueHoseiX = (2-valueText.length)*Math.floor(font.getSize()/2);
		}
		TextRenderer.drawKeywordText(x+valueHoseiX, y, valueText, -1, color, font);
	},
	
//	// カーソルが最上段にあるか
//	isTopLine: function() {
//		var posy = Math.floor( (this.getIndex() / this.getCol()) );
//		return posy == 0;
//	},
	
//	// カーソルが最下段にあるか
//	isBottomLine: function() {
//		var posy = Math.floor( (this.getIndex() / this.getCol()) );
//		return posy == (this.getRowCount() - 1);
//	},
	
	drawDescriptionLine: function(x, y) {
	},
	
	playSelectSound: function() {
	},
	
	getObjectWidth: function() {
		var width = MenuStateIconAreaWidth;		// ステートアイコンの幅
		
		if( MenuStateIconDisplay == false && MenuStateTextDisplay == true ) {
			width = MenuStateTextAreaWidth;
		}
		else if( MenuStateIconDisplay == true && MenuStateTextDisplay == true ) {
			width = MenuStateIconAreaWidth + MenuStateTextAreaWidth;
		}
		
		return width;
	},
	
	getObjectHeight: function() {
		var height = MenuStateIconAreaHeight;			// ステートアイコンの高さ

		// unitmenu_sentence_ex.jsが入っている場合はステートアイコンの高さを補正する
		if( typeof UnitSentenceWindowEx !== 'undefined' ) {
			height += MenuStateIconHoseiHeight;
		}

		return height;
	},
	
	_drawStateText: function(x, y, text) {
		var font = root.getBaseData().getFontList().getDataFromId(MenuStateTextFontID);		// フォントID
		var color = ColorValue.DEFAULT
		var range = createRangeObject();
		
		range.x = x;
		range.y = y;
		range.width = MenuStateTextAreaWidth;
		range.height = GraphicsFormat.ICON_HEIGHT;
		TextRenderer.drawRangeText(range, TextFormat.LEFT, text, -1, color, font);
	}
}
);




//-------------------------------------------------------
// StateInteractionクラス
//-------------------------------------------------------
var StateInteraction = defineObject(BaseInteraction,
{
	moveInteraction: function() {
		var input, index;
		
		if (this._isHelpMode) {
			input = this._scrollbar.moveInput();
			if (input === ScrollbarInput.CANCEL) {
				this.cancelInteraction();
			}
			else {
				if (this._scrollbar.checkAndUpdateIndex()) {
					this._changeTopic();
				}
			}
		}
		else {
			index = this._getTracingIndex();
			if (index !== -1) {
				this._scrollbar.setIndex(index);
				this._changeTopic();
			}
		}
	
		return MoveResult.CONTINUE;
	},
	
	checkInitialTopic: function() {
		BaseInteraction.checkInitialTopic.call(this);

		var index = MouseControl.getIndexFromMouse(this._scrollbar);
		
		if (index == -1) {
			this._scrollbar.setIndex(0);
			this._changeTopic();
		}
	},
	
	cancelInteraction: function() {
		this._isHelpMode = false;
		this._scrollbar.setActive(false);
		this._scrollbar.setIndex(0);
	},
	
	initialize: function() {
		this._scrollbar = createScrollbarObject(IconStateScrollbar, this);
		this._scrollbar.setScrollFormation(MenuStateIconCol, MenuStateIconRaw);	// ステートアイコンは横にMenuStateIconCol個、縦にMenuStateIconRaw個まで可能にしてある
		this._window = createWindowObject(StateInfoWindow, this);
	},
	
	setTurnStateArray: function(arr) {
		this._scrollbar.setObjectArray(arr);
	},
	
	isHelpAvailable: function() {
		return this._scrollbar.getObjectCount() > 0;
	},
	
	getHelpText: function() {
		var turnState = this._scrollbar.getObject();
		
		return turnState.getState().getDescription();
	},
	
	_changeTopic: function() {
		var turnState = this._scrollbar.getObject();
		
		this._window.setInfoState(turnState);
	}
}
);




//-------------------------------------------------------
// StateInfoWindowクラス
//-------------------------------------------------------
var StateInfoWindow = defineObject(BaseWindow,
{
	_turnState: null,
	_groupArray: null,
	_windowHeight: 0,
	
	// BaseWindowのプロパティの置き換え
	_isWindowEnabled: false,
	
	moveWindowContent: function() {
		var i, count;
		
		if (this._turnState === null) {
			return MoveResult.CONTINUE;
		}
		
		count = this._groupArray.length;
		for (i = 0; i < count; i++) {
			this._groupArray[i].moveItemSentence();
		}
		
		return MoveResult.CONTINUE;
	},
	
	drawWindowContent: function(x, y) {
		var i, count;
		
		if (this._turnState === null) {
			return;
		}
		
		count = this._groupArray.length;
		for (i = 0; i < count; i++) {
			this._groupArray[i].drawStateSentence(x, y, this._turnState);
			y += this._groupArray[i].getStateSentenceCount(this._turnState.getState()) * ItemInfoRenderer.getSpaceY();
		}
	},
	
	getWindowWidth: function() {
		return ItemRenderer.getItemWindowWidth();
	},
	
	getWindowHeight: function() {
		return this._windowHeight;
	},
	
	setInfoState: function(turnState) {
		var i, count;
		var partsCount = 0;

		this._turnState = turnState;
		this._groupArray = [];
		this._windowHeight = 0;

		if (this._turnState === null) {
			// ウインドウの枠などが描画されないようにする
			this.enableWindow(false);
			return;
		}

		this._configureState(this._groupArray);

		count = this._groupArray.length;
		for (i = 0; i < count; i++) {
			this._groupArray[i].setParentWindow(this);
			partsCount += this._groupArray[i].getStateSentenceCount(this._turnState.getState());
		}
		
		this._windowHeight = (partsCount + 1) * ItemInfoRenderer.getSpaceY();
		
		this.enableWindow(true);
	},
	
	getWindowYPadding: function() {
		// iteminfo_ex.jsと併用していた場合は行間を詰める
		if( ItemInfoRenderer.getSpaceY() <= 18) {
			return 6;
		}
		return BaseWindow.getWindowYPadding.call();
	},
	
	_configureState: function(groupArray) {
		groupArray.appendObject(StateSentence.Name);
		groupArray.appendObject(StateSentence.isBadState);
		groupArray.appendObject(StateSentence.TurnAndRecover);
		// （改変）スタック数を表示
		groupArray.appendObject(StateSentence.Stack);
		groupArray.appendObject(StateSentence.Seal);
		groupArray.appendObject(StateSentence.Option);
	}
});




//-------------------------------------------------------
// BaseStateSentenceクラス
//-------------------------------------------------------
var BaseStateSentence = defineObject(BaseObject,
{
	_stateInfoWindow: null,
	
	setParentWindow: function(stateInfoWindow) {
		this._stateInfoWindow = stateInfoWindow;
	},
	
	moveStateSentence: function() {
		return MoveResult.CONTINUE;
	},
	
	drawStateSentence: function(x, y, turnState) {
	},
	
	getStateSentenceCount: function(state) {
		return 0;
	}
}
);




//-------------------------------------------------------
// StateSentenceクラス
//-------------------------------------------------------
var StateSentence = {};


// ステート名
StateSentence.Name = defineObject(BaseStateSentence,
{
	drawStateSentence: function(x, y, turnState) {
		var text;
		
		text = StateSentenceNameText;
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();

		text = turnState.getState().getName();
		ItemInfoRenderer.drawDefaultText(x, y, text);
	},
	
	getStateSentenceCount: function(state) {
		if( state == null ){
			return 0;
		}
		return 1;
	}
}
);


// バッドステートであるかどうか
StateSentence.isBadState = defineObject(BaseStateSentence,
{
	drawStateSentence: function(x, y, turnState) {
		var text;
		
		if( turnState.getState().isBadState() ) {
			text = StateSentenceBadText;
			ItemInfoRenderer.drawKeyword(x, y, text);
		}
	},
	
	getStateSentenceCount: function(state) {
		if( state == null || state.isBadState() == false ){
			return 0;
		}
		return 1;
	}
}
);


// 持続ターンと自然回復値
StateSentence.TurnAndRecover = defineObject(BaseStateSentence,
{
	drawStateSentence: function(x, y, turnState) {
		var text, recoveryValue;
		var state = turnState.getState();
		
		text = StateSentenceTurnText;
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		if (turnState.getTurn() !== 0) {
			NumberRenderer.drawNumber(x, y, turnState.getTurn());
		}
		else {
			TextRenderer.drawSignText(x, y, StringTable.SignWord_Limitless);
		}
		
		x += 42;
		
		recoveryValue = state.getAutoRecoveryValue();
		// （改変）スタック数が設定されていれば自然回復値を乗算
		if (typeof root.getMetaSession().global.stackState[state.getId()] === 'number') {
			recoveryValue *= root.getMetaSession().global.stackState[state.getId()];
		}

		if (recoveryValue > 0) {
			text = StateSentenceRecoverText;
			ItemInfoRenderer.drawKeyword(x, y, text);
			x += ItemInfoRenderer.getSpaceX();
			NumberRenderer.drawRightNumber(x, y, recoveryValue);
		}
		else if( recoveryValue < 0 ){
			text = StateSentenceDamageText;
			ItemInfoRenderer.drawKeyword(x, y, text);
			x += ItemInfoRenderer.getSpaceX();
			NumberRenderer.drawRightNumber(x, y, (recoveryValue*-1));
		}
	},
	
	getStateSentenceCount: function(state) {
		return 1;
	}
}
);


// 封印
StateSentence.Seal = defineObject(BaseStateSentence,
{
	drawStateSentence: function(x, y, turnState) {
		var text;
		var badStateFlag = turnState.getState().getBadStateFlag();
		
		if( badStateFlag == 0 ) {
			return;
		}

		text = StateSentenceSealText;
		ItemInfoRenderer.drawKeyword(x, y, text);

		text = '';
		if( badStateFlag & BadStateFlag.PHYSICS ){
			text += StateSentencePhysicText;
		}
		if( badStateFlag & BadStateFlag.MAGIC ){
			text += StateSentenceMagicText;
		}
		if( badStateFlag & BadStateFlag.ITEM ){
			text += StateSentenceItemText;
		}
		if( badStateFlag & BadStateFlag.WAND ){
			text += StateSentenceWandText;
		}

		x += ItemInfoRenderer.getSpaceX();
		ItemInfoRenderer.drawDefaultText(x, y, text);
	},
	
	getStateSentenceCount: function(state) {
		return state.getBadStateFlag() > 0;
	}
}
);


// オプション
StateSentence.Option = defineObject(BaseStateSentence,
{
	drawStateSentence: function(x, y, turnState) {
		var text;
		var badStateOption = turnState.getState().getBadStateOption();
		
		if( badStateOption == 0 ) {
			return;
		}

		text = StateSentenceOptionText;
		ItemInfoRenderer.drawKeyword(x, y, text);

		text = '';
		if( badStateOption == BadStateOption.NOACTION ){
			text += StateSentenceNoActionText;
		}
		if( badStateOption == BadStateOption.BERSERK ){
			text += StateSentenceBerserkText;
		}
		if( badStateOption == BadStateOption.AUTO ){
			text += StateSentenceAutoText;
		}

		x += ItemInfoRenderer.getSpaceX();
		ItemInfoRenderer.drawDefaultText(x, y, text);
	},
	
	getStateSentenceCount: function(state) {
		return state.getBadStateOption() > 0;
	}
}
);


// （改変）スタック
StateSentence.Stack = defineObject(BaseStateSentence,
{
	drawStateSentence: function(x, y, turnState) {
		var text;
		var state = turnState.getState();
		var stack = 0;
		
		if(typeof state.custom.maxStack !== 'number') {
			return;
		}
		if (typeof root.getMetaSession().global.stackState[state.getId()] === 'number') {
			stack = root.getMetaSession().global.stackState[state.getId()];
		}
		
		text = StateSentenceStack;
		ItemInfoRenderer.drawKeyword(x, y, text);
		x += ItemInfoRenderer.getSpaceX();
		
		if (turnState.stack !== 0) {
			NumberRenderer.drawNumber(x, y, stack);
		}
		else {
			TextRenderer.drawSignText(x, y, StringTable.SignWord_Limitless);
		}
	},
	
	getStateSentenceCount: function(state) {
		if (typeof state.custom.maxStack === 'number') {
			return 1;
		}
		return 0;
	}
}
);



//-------------------------------------------------------
// ItemInfoRendererクラス
//-------------------------------------------------------
ItemInfoRenderer.drawDefaultText= function(x, y, text) {
		var textui = this.getTextUI();
		var color = ColorValue.DEFAULT;
		var font = textui.getFont();
		
		TextRenderer.drawKeywordText(x, y, text, -1, color, font);
}





//---------------------------------------------------------------
// SentenceStateRemoveがtrueの場合のUnitSentence.State削除処理
//---------------------------------------------------------------

if(SentenceStateRemove === true) {
//---------------------------------------------------
// BaseUnitSentenceクラス
//---------------------------------------------------
	BaseUnitSentence.getSentenceText= function() {
		return '';
	}




//---------------------------------------------------
// UnitSentence.Stateクラス
//---------------------------------------------------
	UnitSentence.State.getSentenceText= function() {
		return 'State';
	}




//---------------------------------------------------
// UnitSentenceWindowクラス
//---------------------------------------------------
	var alias100 = UnitSentenceWindow._configureSentence;
	UnitSentenceWindow._configureSentence= function(groupArray) {
		alias100.call(this, groupArray);
		
		var i, unitSentence;
		var count = groupArray.length;
		
		for( i = count-1;i >= 0;i-- ) {
			unitSentence = groupArray[i];
			// センテンスウィンドウの項目からgetSentenceText()を呼び出し'State'が入っていれば取り除く
			if( unitSentence.getSentenceText() === 'State' ) {
				groupArray.splice(i, 1);
			}
		}
	}




//---------------------------------------------------
// UnitSentenceWindowExクラス
//---------------------------------------------------
	if(typeof UnitSentenceWindowEx !== 'undefined' ) {
	var alias200 = UnitSentenceWindowEx._configureSentence;
	UnitSentenceWindowEx._configureSentence= function(groupArray) {
		alias200.call(this, groupArray);
		
		var i, unitSentence;
		var count = groupArray.length;
		
		for( i = count-1;i >= 0;i-- ) {
			unitSentence = groupArray[i];
			// センテンスウィンドウの項目からgetSentenceText()を呼び出し'State'が入っていれば取り除く
			if( unitSentence.getSentenceText() === 'State' ) {
				groupArray.splice(i, 1);
			}
		}
	}
	}

}		// if(SentenceStateRemove == true) {  の閉じ括弧


//---------------------------------------------------
// GraphicsRendererクラス
//---------------------------------------------------
// ステートアイコン描画（サイズ変更可能）
GraphicsRenderer.drawStateIconShrink= function(xDest, yDest, handle, graphicsType, width, height) {
		var pic = this.getGraphics(handle, graphicsType);
		var xSrc = handle.getSrcX();
		var ySrc = handle.getSrcY();
		var size = this.getGraphicsSize(graphicsType, pic);
		
		if (pic !== null) {
			pic.drawStretchParts(xDest, yDest, width, height, xSrc * GraphicsFormat.ICON_WIDTH, ySrc * GraphicsFormat.ICON_HEIGHT, GraphicsFormat.ICON_WIDTH, GraphicsFormat.ICON_HEIGHT);
		}
}


})();