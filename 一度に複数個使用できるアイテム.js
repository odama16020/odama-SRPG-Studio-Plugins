/*--------------------------------------------------------------------------
  
  一度に複数個使用できるアイテム
  作成者：おおだま

■概要
アイテム使用画面でキーを入力することで、アイテムを一度に複数回使用できるようにします。
右キーで使用回数を増加、左キーで使用回数を減少させます。
回復アイテム、ダメージアイテム、ステート付加アイテムのみ対応しています。
前2者は使用する回数分、アイテムの効果が倍増します。ステート付加アイテムは使用する回数分、ステートを繰り返し付加します。


■設定方法
プラグインをフォルダに入れ、アイテムのカスタムパラメータに"maxMultipleUse"を設定することで使用可能です。

* maxMultipleUse (必須)
数値を設定します。
この値が設定されているアイテムは、一度に複数個使用できるようになります。最大で設定した値まで使用可能です。


■カスパラ設定例
* {maxMultipleUse:5}
カスパラを設定したアイテムを、最大で5回まで一度に使用可能です。


■更新履歴
25/07/06 初回リリース


■動作確認バージョン
SRPG Studio Version:1.315


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。
*/


(function() {

/*-----------------------------------------------------------------------------------------------------------------
    アイテム複数回使用時に表示する、使用回数のX座標補正
*----------------------------------------------------------------------------------------------------------------*/
var ITEM_MULTIPLE_USE_POSITION_X = 142;

/*-----------------------------------------------------------------------------------------------------------------
    アイテムの使用回数を管理するグローバル変数
*----------------------------------------------------------------------------------------------------------------*/
var _multipleUseCount = 1;

/*-----------------------------------------------------------------------------------------------------------------
    初期化処理
*----------------------------------------------------------------------------------------------------------------*/
var alias1 = ItemUseScreen._prepareScreenMemberData;
ItemUseScreen._prepareScreenMemberData = function(screenParam) {
	alias1.call(this, screenParam);
	_multipleUseCount = 1;
};

/*-----------------------------------------------------------------------------------------------------------------
    左右キーでアイテムの使用回数を変更する
*----------------------------------------------------------------------------------------------------------------*/
var alias2 = ItemSelectMenu._moveItemSelect;
ItemSelectMenu._moveItemSelect = function() {
	var input = this._itemListWindow.moveWindow();
	var result = ItemSelectMenuResult.NONE;
	var recentlyInput, item;
	
	if (input === ScrollbarInput.SELECT) {
		this._itemWorkWindow.setItemWorkData(this._itemListWindow.getCurrentItem());
		this._processMode(ItemSelectMenuMode.WORK);
	}
	else if (input === ScrollbarInput.CANCEL) {
		_multipleUseCount = 1;
		ItemControl.updatePossessionItem(this._unit);
		result = ItemSelectMenuResult.CANCEL;
	}
	else {
		if (this._itemListWindow.isIndexChanged()) {
			_multipleUseCount = 1;
			this._itemInfoWindow.setInfoItem(this._itemListWindow.getCurrentItem());
		} else {
			recentlyInput = this._itemListWindow.getItemScrollbar().getRecentlyInputType();
			item = this._itemListWindow.getCurrentItem();
			
			// 右キーで使用回数増加
			if (InputControl.isInputAction(InputType.RIGHT)) {
				var maxCount = this._getMaxMultipleUse(item);
				var itemCount = item.getLimit();
				var maxPossible = Math.min(maxCount, itemCount);
				
				if (_multipleUseCount < maxPossible) {
					_multipleUseCount++;
					this._itemInfoWindow.setInfoItem(item); // 表示更新
				}
				return MoveResult.CONTINUE;
			}
			// 左キーで使用回数減少
			else if (InputControl.isInputAction(InputType.LEFT)) {
				if (_multipleUseCount > 1) {
					_multipleUseCount--;
					this._itemInfoWindow.setInfoItem(item); // 表示更新
				}
				return MoveResult.CONTINUE;
			}
		}
	}
	
	return result;
};

/*-----------------------------------------------------------------------------------------------------------------
    アイテムが複数使用可能かチェック
*----------------------------------------------------------------------------------------------------------------*/
ItemSelectMenu._isMultipleUseAllowed = function(item) {
	if (item === null || item.isWeapon()) {
		return false;
	}
	
	var type = item.getItemType();
	if (type !== ItemType.RECOVERY && type !== ItemType.DAMAGE && type !== ItemType.STATE) {
		return false;
	}
	
	var maxUse = this._getMaxMultipleUse(item);
	return maxUse > 1;
};

/*-----------------------------------------------------------------------------------------------------------------
    アイテムの最大使用回数を取得
*----------------------------------------------------------------------------------------------------------------*/
ItemSelectMenu._getMaxMultipleUse = function(item) {
	if (typeof item.custom.maxMultipleUse === 'number') {
		return item.custom.maxMultipleUse;
	}
	return 1;
};

// アイテム情報ウィンドウに使用回数を表示
var alias3 = ItemInfoWindow.drawWindowContent;
ItemInfoWindow.drawWindowContent = function(x, y) {
	alias3.call(this, x, y);
	
	// 複数使用回数の表示
	if (_multipleUseCount !== null && _multipleUseCount > 1) {
		TextRenderer.drawSignText(x + ITEM_MULTIPLE_USE_POSITION_X, y, StringTable.SignWord_Multiple);
		NumberRenderer.drawRightNumberColor(x + ITEM_MULTIPLE_USE_POSITION_X + 16, y, _multipleUseCount, 1, 255);
	}
};

// アイテム減少処理を拡張
// var alias4 = ItemUseParent.decreaseItem;
ItemUseParent.decreaseItem = function() {
	var useCount = _multipleUseCount || 1;
	
	// 指定回数分アイテムを減らす
	for (var i = 0; i < useCount; i++) {
		if (!this._isItemDecrementDisabled) {
			ItemControl.decreaseItem(this._itemTargetInfo.unit, this._itemTargetInfo.item);
		}
	}
	
	_multipleUseCount = 1;
};

// 回復アイテムの効果を拡張
var alias5 = RecoveryItemUse.enterMainUseCycle;
RecoveryItemUse.enterMainUseCycle = function(itemUseParent) {
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	if (typeof itemTargetInfo.item.custom.maxMultipleUse === 'number') {
		var generator;
		var recoveryInfo = itemTargetInfo.item.getRecoveryInfo();
		var type = itemTargetInfo.item.getRangeType();
		var plus = Calculator.calculateRecoveryItemPlus(itemTargetInfo.unit, itemTargetInfo.targetUnit, itemTargetInfo.item);
		
		// 複数使用回数分倍増
		var useCount = _multipleUseCount || 1;
		var totalRecovery = (recoveryInfo.getRecoveryValue() + plus) * useCount;
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		
		if (type !== SelectionRangeType.SELFONLY) {
			generator.locationFocus(itemTargetInfo.targetUnit.getMapX(), itemTargetInfo.targetUnit.getMapY(), true);
		}
		
		generator.hpRecovery(itemTargetInfo.targetUnit, this._getItemRecoveryAnime(itemTargetInfo),
			totalRecovery, recoveryInfo.getRecoveryType(), itemUseParent.isItemSkipMode());
		
		return this._dynamicEvent.executeDynamicEvent();
	}
	return alias5.call(this);
};

// ダメージアイテムの効果を拡張
var alias6 = DamageItemUse.enterMainUseCycle;
DamageItemUse.enterMainUseCycle = function(itemUseParent) {
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	if (typeof itemTargetInfo.item.custom.maxMultipleUse === 'number') {
		var generator;
		var damageInfo = itemTargetInfo.item.getDamageInfo();
		var type = itemTargetInfo.item.getRangeType();
		var plus = Calculator.calculateDamageItemPlus(itemTargetInfo.unit, itemTargetInfo.targetUnit, itemTargetInfo.item);
		
		// 複数使用回数分倍増
		var useCount = _multipleUseCount || 1;
		var totalDamage = (damageInfo.getDamageValue() + plus) * useCount;
		
		this._dynamicEvent = createObject(DynamicEvent);
		generator = this._dynamicEvent.acquireEventGenerator();
		
		if (type !== SelectionRangeType.SELFONLY) {
			generator.locationFocus(itemTargetInfo.targetUnit.getMapX(), itemTargetInfo.targetUnit.getMapY(), true);
		}
		
		generator.damageHitEx(itemTargetInfo.targetUnit, this._getItemDamageAnime(itemTargetInfo),
			totalDamage, damageInfo.getDamageType(), damageInfo.getHit(), itemTargetInfo.unit, itemUseParent.isItemSkipMode());
			
		// ターゲットの撃破時にドロップトロフィーを入手する時、使用したはずの耐久1のアイテムが表示されるわけにはいかない。
		// アイテムの耐久を本来のタイミングよりも先行して減少させ、デフォルトの減少処理は無効化しておく。
		itemUseParent.decreaseItem();
		itemUseParent.disableItemDecrement();
		
		return this._dynamicEvent.executeDynamicEvent();
	}
	return alias6.call(this);
};

// ステートアイテムの効果を拡張
// var alias7 = StateItemUse.enterMainUseCycle;
StateItemUse.enterMainUseCycle = function(itemUseParent) {
	var generator;
	var itemTargetInfo = itemUseParent.getItemTargetInfo();
	var info = itemTargetInfo.item.getStateInfo();
	var useCount = _multipleUseCount || 1;
	
	this._dynamicEvent = createObject(DynamicEvent);
	generator = this._dynamicEvent.acquireEventGenerator();
	generator.unitStateAddition(itemTargetInfo.targetUnit, info.getStateInvocation(), IncreaseType.INCREASE, itemTargetInfo.unit, itemUseParent.isItemSkipMode());
	
	// 複数回ステートを付加（generatorで1回付与するので、ここではusecount-1回実行）
	for (var i = 0; i < useCount - 1; i++) {
		StateControl.arrangeState(itemTargetInfo.targetUnit, info.getStateInvocation().getState(), IncreaseType.INCREASE);
	}
	
	return this._dynamicEvent.executeDynamicEvent();
};

var alias8 = RecoveryItemPotency.setPosMenuData;
RecoveryItemPotency.setPosMenuData = function(unit, item, targetUnit) {
	alias8.call(this, unit, item, targetUnit);

	var useCount = _multipleUseCount || 1;
	this._value = this._value * useCount;
};

// アイテム効果値の表示を拡張（ダメージ）
var alias9 = DamageItemPotency.setPosMenuData;
DamageItemPotency.setPosMenuData = function(unit, item, targetUnit) {
	alias9.call(this, unit, item, targetUnit);

	var useCount = _multipleUseCount || 1;
	this._value = this._value * useCount;
};

})();