/*--------------------------------------------------------------------------
  
  プレイヤーフェイズ中に行動する敵
  作成者：おおだま

■概要
スキルを設定した敵を、プレイヤーフェイズ中にAIに沿って行動させます。


■設定方法
プラグインをフォルダに入れます。
この機能を使用するマップのカスパラに{useEnemyExtraTurn:1}を設定します。負荷軽減のため、未設定のマップでは本機能は動作しません。
カスタムスキルのキーワードに"enemyExtraTurn"を設定し、プレイヤーフェイズ中に行動させる敵ユニットにスキルを所持させます。

追加機能として、プレイヤーフェイズ中の敵行動時にのみ有効になるステートを設定できます。
カスパラに{isExtraTurnState:1}を設定したステートは、プレイヤーフェイズ中の敵行動後に消去されます。
プレイヤーユニット行動後にイベントを実行してステートを付与することで、対象の敵ユニットにはそのユニットのみ狙うよう行動させる、
などといったことが可能です。


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

var ENEMY_EXTRA_TURN_KEYWORD = 'enemyExtraTurn';

var EnemyExtraTurn = defineObject(EnemyTurn,
{
	_getActorList: function() {
        var i, count, enemyList, newList, arr, unit, skill;
        var enemyList = EnemyList.getAliveList();
        newList = StructureBuilder.buildDataList();
        arr = [];

        count = enemyList.getCount();
        for (i = 0; i < count; i++) {
            unit = enemyList.getData(i);
            skill = SkillControl.getPossessionCustomSkill(unit, ENEMY_EXTRA_TURN_KEYWORD);

            if (skill) {
                arr.push(unit);
            }
        }

        if (arr.length > 0) {
            newList.setDataArray(arr);
        }
		return newList;
	},
	
	_moveEndEnemyTurn: function() {
        var i, unit, count;
		var list = this._getActorList();
        count = list.getCount();

        // 敵ユニットの敵追加ターン用ステートを消去
        for (i = 0; i < count; i++) {
            unit = list.getData(i);
            unit.setWait(false);
            this._removeExtraTurnState(unit);
        }

        // プレイヤーユニットの敵追加ターン用ステートを消去
        var playerList = PlayerList.getSortieList();
        count = playerList.getCount();

        for (i = 0; i < count; i++) {
            unit = playerList.getData(i);
            this._removeExtraTurnState(unit);
        }

		MapLayer.getMarkingPanel().updateMarkingPanel();
		this._orderCount = 0;
		return MoveResult.END;
	},

	// 敵追加ターン用のステートを消去
	_removeExtraTurnState: function(unit) {
		var arr = [];
		var turnState, state, count, i;
		var turnStateList = unit.getTurnStateList();
		count = turnStateList.getCount();
		for (i = 0; i < count; i++) {
			turnState = turnStateList.getData(i);
			state = turnState.getState();
			if (state && typeof state.custom.isExtraTurnState !== 'undefined') {
				arr.push(state);
			}
		}
			
		count = arr.length;
		for (i = 0; i < count; i++) {
			StateControl.arrangeState(unit, arr[i], IncreaseType.DECREASE);
		}
	}
});

var EnemyExtraFlowEntry = defineObject(BaseFlowEntry,
{
    _enemyExtraTurn: null,
    
    enterFlowEntry: function(turnChange) {
        this._prepareMemberData(turnChange);
        return this._completeMemberData(turnChange);
    },
    
    moveFlowEntry: function() {
        return this._enemyExtraTurn.moveTurnCycle();
    },
    
    drawFlowEntry: function() {
        this._enemyExtraTurn.drawTurnCycle();
    },
    
    _prepareMemberData: function(turnChange) {
        this._enemyExtraTurn = createObject(EnemyExtraTurn);
    },
    
    _completeMemberData: function(turnChange) {
		if (!this._isEnemyExtraTurn()) {
			return EnterResult.NOTENTER;
		}

        this._enemyExtraTurn.openTurnCycle();
        return EnterResult.OK;
    },
	
	_isEnemyExtraTurn: function() {
		var i, unit, skill;
		var list = EnemyList.getAliveList();
		var count = list.getCount();
		
		if (root.getCurrentSession().getTurnType() !== TurnType.PLAYER) {
			return false;
		}
		
		for (i = 0; i < count; i++) {
			unit = list.getData(i);
            skill = SkillControl.getPossessionCustomSkill(unit, ENEMY_EXTRA_TURN_KEYWORD);
			if (skill) {
				return true;
			}
		}
		
		return false;
	}
});

(function () {
	var alias1 = MapSequenceCommand._pushFlowEntries;
	MapSequenceCommand._pushFlowEntries = function(straightFlow) {
		alias1.call(this, straightFlow);
        
        var mapInfo = root.getCurrentSession().getCurrentMapInfo();
        if (typeof mapInfo.custom.useEnemyExtraTurn !== 'undefined') {
            straightFlow.pushFlowEntry(EnemyExtraFlowEntry);
        }
	}
})();
