
/*--------------------------------------------------------------------------
  
　スキル：追加攻撃（行動ごとに回数リセット）

元製作者：名前未定 様
改変者：おおだま

■概要
　このスキルを所持したユニットはユニットコマンドに「追加攻撃」のコマンドが表示されるようになります。
　「追加攻撃」を実施した後は待機せず、それ以外のコマンドを実施可能です。

　改変元と異なり、追加攻撃は行動ごとに回数がリセットされます。
　使用可能な残り回数が２回以上の場合は「追加攻撃：XX回」（XXは回数）という風に表示されます。

■使用法
　カスタムスキルを作成し、キーワードに'MultiAttackPerAction'を設定して下さい。
　このスキルを所持したユニットは「追加攻撃」のコマンドが表示されるようになります。

　また、上記スキルのカスタムパラメータに{ AttackTimesPerAction:XX }（XXは0より大きい数字）を設定すると
　１回の行動でXX回まで追加攻撃を使用出来ます。省略した場合は１行動１回だけ使用可能です。

　また、カスタムパラメータに{ isNormalAttackDisplayable:false }を設定すると
　通常の攻撃コマンドを非表示にします。

　発動率の値は使用していないので、0%に設定しておく方がいいです。

■カスタマイズ
　１．ユニットコマンド名を「追加攻撃」ではなく「攻撃２」にしたい
　　　→設定にある「var MultiAttackText = '追加攻撃';」の'追加攻撃'を'攻撃２'に書き変えて下さい

　２．「追加攻撃」の表示位置を変えたい
　　　→設定にある「var MultiAttackIndex = 2;」の数字部分を変えて下さい

■変更履歴（改変元）
19/09/09  新規作成
20/12/07  追加攻撃を行った側が死亡した場合も続けてユニットコマンドが表示されて操作出来てしまうバグを修正
20/12/30  未定義変数の宣言を追加
21/05/26　1.230対応
22/04/14　キュウブ氏の全体攻撃武器.jsに対応

■変更履歴（改変後）
23/12/20　改変版初回リリース
          通常の攻撃コマンドを非表示にする機能を追加

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


//--------------------------------------------
// 設定
//--------------------------------------------
var MultiAttackWord = 'MultiAttackPerAction';
var MultiAttackText = '追加攻撃';
var MultiAttackIndex = 2;				// 「追加攻撃」コマンドの登録位置（上からn番目）




//--------------------------------------------
// 以下、プログラム
//--------------------------------------------
//----------------------------------
// UnitCommandクラス
//----------------------------------
var alias01 = UnitCommand.configureCommands;
UnitCommand.configureCommands= function(groupArray) {
	alias01.call(this, groupArray);
	
	var MultiAttack_command_index = MultiAttackIndex;
	if( MultiAttack_command_index >= groupArray.length ) {
		MultiAttack_command_index = groupArray.length-1;
	}
	
	// コマンドの上からn番目に登録する
	groupArray.insertObject(UnitCommand.MultiAttack, MultiAttack_command_index);
}




//----------------------------------
// UnitProviderクラス
//----------------------------------
var alias02 = UnitProvider.setupFirstUnit;
UnitProvider.setupFirstUnit= function(unit) {
	alias02.call(this, unit);
	
	// 登場した自軍ユニットは追加攻撃コマンド回数をリセットする
	if( unit.getUnitType() == UnitType.PLAYER ) {
		MultiAttackControl.resetAttackTimesCount(unit);
	}
}




var alias03 = TurnChangeStart.doLastAction;
TurnChangeStart.doLastAction= function() {
	var i, count, unit, list;
	var turnType = root.getCurrentSession().getTurnType();
	
	// 従来処理
	alias03.call(this);
	
	if (turnType === TurnType.PLAYER) {
		if( root.getScriptVersion() < 1230 ) {
			list = this._getPlayerList();
		}
		else {
			list = PlayerList.getSortieList();
		}
		
		count = list.getCount();
		for (i = 0; i < count; i++) {
			unit = list.getData(i);
			MultiAttackControl.resetAttackTimesCount(unit);
		}
	}
}

// 待機後に回数をリセット
var alias04 = UnitWaitFlowEntry._completeMemberData;
UnitWaitFlowEntry._completeMemberData = function(playerTurn) {
	var unit = playerTurn.getTurnTargetUnit();
		
	// 待機時に自軍ユニットは追加攻撃コマンド回数をリセットする
	if( unit.getUnitType() == UnitType.PLAYER ) {
		MultiAttackControl.resetAttackTimesCount(unit);
	}

	// 従来処理を実行
	alias04.call(this, playerTurn);
}




// 通常の攻撃コマンドを表示するかどうか
var alias05 = UnitCommand.Attack.isCommandDisplayable;
UnitCommand.Attack.isCommandDisplayable = function() {
	var skill;
	var unit = this.getCommandTarget();
	
	skill = MultiAttackControl.getMultiAttackSkill(unit);
	
	// isNormalAttackDisplayable が false なら、攻撃コマンドを表示しない
	if (skill && typeof skill.custom.isNormalAttackDisplayable  === 'boolean') {
		return skill.custom.isNormalAttackDisplayable;
	}

	// 従来処理を実行
	return alias05.call(this);
};




//----------------------------------------
// UnitCommand.MultiAttackクラス（追加攻撃のユニットコマンド）
//----------------------------------------
UnitCommand.MultiAttack = defineObject(UnitCommand.Attack,
{
	isCommandDisplayable: function() {
		var skill, count, skillCnt;
		
		var result = UnitCommand.Attack.isCommandDisplayable.call(this);
		var unit = this.getCommandTarget();
		
		if( result == false ) {
			return false;
		}
		
		skill = MultiAttackControl.getMultiAttackSkill(unit);
		if( skill == null ) {
			return false;
		}
		
		count = MultiAttackControl.getAttackTimesCountFromUnit(unit);
		if( count === -1 ) {
			return false;
		}
		
		skillCnt = MultiAttackControl.getAttackTimesSkillCountFromUnit(unit);
		
		if( skillCnt <= count ) {
			return false;
		}
		
		return true;
	},
	
	getCommandName: function() {
		// 「追加攻撃：n回」という表示にしている
		var count = MultiAttackControl.getRemainingCount(this.getCommandTarget());
		var text;
		if (count > 1) {
			text = MultiAttackText+'：'+count+'回';
		}
		else {
			text = MultiAttackText;
		};
		
		return text;
	},
	
	_moveSelection: function() {
		var attackParam, multipleAttackParam, weapon;
		var result = this._posSelector.movePosSelector();

		if (result === PosSelectorResult.SELECT) {
			if (this._isPosSelectable()) {
				this._posSelector.endPosSelector();
				weapon = this._weaponSelectMenu.getSelectWeapon();
				
				if (weapon.custom.isMultipleWeapon !== true) {
					attackParam = this._createAttackParam();
					this._preAttack = createObject(PreAttack);
					result = this._preAttack.enterPreAttackCycle(attackParam);
				}
				else {
					multipleAttackParam = this._createMultipleAttackParam();
					this._preAttack = createObject(PreMultipleAttack);
					result = this._preAttack.enterPreAttackCycle(multipleAttackParam);
				}
				
				if (result === EnterResult.NOTENTER) {
					this.endCommandAction();
					return MoveResult.END;
				}
				
				MultiAttackControl.incAttackTimesCountToUnit(this.getCommandTarget());
				this.changeCycleMode(AttackCommandMode.RESULT);
			}
		}
		else if (result === PosSelectorResult.CANCEL) {
			this._posSelector.endPosSelector();
			if (this._isWeaponSelectDisabled) {
				return MoveResult.END;
			}
			
			this._weaponSelectMenu.setMenuTarget(this.getCommandTarget());
			this.changeCycleMode(AttackCommandMode.TOP);
		}
		
		return MoveResult.CONTINUE;
	},

	_moveResult: function() {
		var unit;
		
		if (this._preAttack.movePreAttackCycle() !== MoveResult.CONTINUE) {
			unit = this.getCommandTarget();
			
			if( unit.getHp() === 0 ) {
				// 死亡した場合は終了
				this.endCommandAction();
				return MoveResult.END;
			}
			
			// 死亡しなかった場合は継続してユニットコマンドを開く
			
			// アイテム交換では交換を行っても直ちに待機にならないが、何らかの操作を行ったという印はつける
			this.setExitCommand(this);
			
			// アイテム交換によって実行可能なコマンドが増えていることも考えられるため、再構築する
			this.rebuildCommand();
			
			return MoveResult.END;
		}
		
		return MoveResult.CONTINUE;
	}
}
);




//----------------------------------------
// MultiAttackControlクラス
//----------------------------------------
// 指定スキルID用のスキル発動アイテムを取得する
var MultiAttackControl = {
	// 攻撃回数は含む
	canMultiAttack: function(unit) {
		var skill, count, skillCnt;
		
		if( unit == null ) {
			return false;
		}
		
		skill = this.getMultiAttackSkill(unit);
		if( skill == null ) {
			return false;
		}
		
		count = this.getAttackTimesCountFromUnit(unit);
		if( count === -1 ) {
			return false;
		}
		
		skillCnt = this.getAttackTimesSkillCountFromUnit(unit);
		
		if( skillCnt <= count ) {
			return false;
		}
		
		return true;
	},
	
	getRemainingCount: function(unit) {
		var skill, count, skillCnt;
		
		if( unit == null ) {
			return 0;
		}
		
		skill = this.getMultiAttackSkill(unit);
		if( skill == null ) {
			return 0;
		}
		
		count = this.getAttackTimesCountFromUnit(unit);
		if( count === -1 ) {
			return 0;
		}
		
		skillCnt = this.getAttackTimesSkillCountFromUnit(unit);
		if( skillCnt <= count ) {
			return 0;
		}
		
		return (skillCnt - count);
	},
	
	getMultiAttackSkill: function(unit) {
		if( unit == null ) {
			return null;
		}
		
		return SkillControl.getPossessionCustomSkill(unit, MultiAttackWord);
	},
	
	getAttackTimesSkillCountFromUnit: function(unit) {
		var skill;
		
		if( unit == null ) {
			return 0;
		}
		
		skill = this.getMultiAttackSkill(unit);
		if( skill === null ) {
			return 0;
		}
		
		var skillCnt = skill.custom.AttackTimesPerAction;
		if( typeof skillCnt === 'undefined' ) {
			skillCnt = 1;
		}
		
		return skillCnt;
	},
	
	getAttackTimesCountFromUnit: function(unit) {
		var count;
		
		if( unit == null ) {
			return -1;
		}
		
		count = unit.custom.AttackTimesCount;
		if( typeof count === 'undefined' ) {
			return 0;
		}
		
		return count;
	},
	
	setAttackTimesCountToUnit: function(unit, value) {
		if( unit == null ) {
			return;
		}
		
		unit.custom.AttackTimesCount = value;
	},
	
	incAttackTimesCountToUnit: function(unit) {
		var count = this.getAttackTimesCountFromUnit(unit);
		
		if( count === -1 ) {
			return;
		}
		
		this.setAttackTimesCountToUnit(unit, count+1);
	},
	
	resetAttackTimesCount: function(unit) {
			if( unit == null ) {
			return;
		}
		
		delete unit.custom.AttackTimesCount;
	}
}


})();