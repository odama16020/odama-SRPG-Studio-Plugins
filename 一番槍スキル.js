/*--------------------------------------------------------------------------
  
  一番槍スキル
  作成者：おおだま

■概要
スキルを所持しているユニットがプレイヤーフェイズで最初に行動するとき、そのユニットに与えるダメージ、命中率、必殺率のボーナスを適用します。


■設定方法
プラグインをフォルダに入れ、カスタムスキルのキーワードに"FirstCharge"を設定することで使用可能です。
スキルに以下のカスパラを設定することで、ボーナスを付与します。

* powBonus
スキルを所持しているユニットがプレイヤーフェイズで最初に行動するとき、1度の攻撃で与えるダメージが設定した数値分増加します。

* hitBonus
スキルを所持しているユニットがプレイヤーフェイズで最初に行動するとき、攻撃の命中率が設定した数値分増加します。

* criticalBonus
スキルを所持しているユニットがプレイヤーフェイズで最初に行動するとき、攻撃の必殺率が設定した数値分増加します。


■カスパラ設定例
* {powBonus:5, hitBonus:20, criticalBonus:10}
スキルを所持しているユニットがプレイヤーフェイズで最初に行動するとき、1度の攻撃で与えるダメージが5、命中率が20、必殺率が10増加します。


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
    カスタムスキルのキーワード
*----------------------------------------------------------------------------------------------------------------*/
var CUSTOM_SKILL_KEYWORD = 'FirstCharge';

/*-----------------------------------------------------------------------------------------------------------------
    一番槍の状態を管理するグローバル変数
*----------------------------------------------------------------------------------------------------------------*/
var _firstActionTaken = false;

/*-----------------------------------------------------------------------------------------------------------------
    プレイヤーターン開始時に一番槍状態をリセット
*----------------------------------------------------------------------------------------------------------------*/
var alias1 = PlayerTurn.openTurnCycle;
PlayerTurn.openTurnCycle = function() {
	alias1.call(this);
	
	// 一番槍状態をリセット
	_firstActionTaken = false;
};

/*-----------------------------------------------------------------------------------------------------------------
    与えるダメージにボーナスを適用
*----------------------------------------------------------------------------------------------------------------*/
var alias2 = DamageCalculator.calculateAttackPower;
DamageCalculator.calculateAttackPower = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
    var pow = alias2.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
    
    if (root.getBaseScene() !== SceneType.REST) {
        // プレイヤーユニットかチェック
        if (active.getUnitType() !== UnitType.PLAYER) {
            return pow;
        }
	
        // 最初の行動ユニットかチェック
        if (_firstActionTaken) {
            return pow;
        }
        
        // 一番槍ボーナスを適用
        var skill = SkillControl.getPossessionCustomSkill(active, CUSTOM_SKILL_KEYWORD);
        if (skill && typeof skill.custom.powBonus === 'number') {
            pow += skill.custom.powBonus;
        }
    }
    
    // powBonusによる補正で負の値を返さないようにする
    return Math.max(pow, 0);
};

/*-----------------------------------------------------------------------------------------------------------------
    命中率にボーナスを適用
*----------------------------------------------------------------------------------------------------------------*/
var alias3 = HitCalculator.calculateSingleHit;
HitCalculator.calculateSingleHit = function(active, passive, weapon, activeTotalStatus) {
    var hit = alias3.call(this, active, passive, weapon, activeTotalStatus);

    if (root.getBaseScene() !== SceneType.REST) {
        // プレイヤーユニットかチェック
        if (active.getUnitType() !== UnitType.PLAYER) {
            return hit;
        }
	
        // 最初の行動ユニットかチェック
        if (_firstActionTaken) {
            return hit;
        }

        var skill = SkillControl.getPossessionCustomSkill(active, CUSTOM_SKILL_KEYWORD);
        if (skill && typeof skill.custom.hitBonus === 'number') {
            hit += skill.custom.hitBonus;
        }
    }
    
    // hitBonusによる補正で負の値を返さないようにする
    return Math.max(hit, 0);
};

/*-----------------------------------------------------------------------------------------------------------------
    必殺率にボーナスを適用
*----------------------------------------------------------------------------------------------------------------*/
var alias4 = CriticalCalculator.calculateSingleCritical;
CriticalCalculator.calculateSingleCritical = function(active, passive, weapon, activeTotalStatus) {
    var critical = alias4.call(this, active, passive, weapon, activeTotalStatus);

    if (root.getBaseScene() !== SceneType.REST) {
        // プレイヤーユニットかチェック
        if (active.getUnitType() !== UnitType.PLAYER) {
            return critical;
        }
	
        // 最初の行動ユニットかチェック
        if (_firstActionTaken) {
            return critical;
        }

        var skill = SkillControl.getPossessionCustomSkill(active, CUSTOM_SKILL_KEYWORD);
        if (skill && typeof skill.custom.criticalBonus === 'number') {
            critical += skill.custom.criticalBonus;
        }
    }
    // criticalBonusによる補正で負の値を返さないようにする
    return Math.max(critical, 0);
};

/*-----------------------------------------------------------------------------------------------------------------
    プレイヤーユニットの待機処理（一番槍を無効化する）
*----------------------------------------------------------------------------------------------------------------*/
var alias5 = UnitWaitFlowEntry._completeMemberData;
UnitWaitFlowEntry._completeMemberData = function(playerTurn) {
    var result = alias5.call(this, playerTurn);
    var unit = playerTurn.getTurnTargetUnit();

    if (unit !== null && !_firstActionTaken) {
        _firstActionTaken = true;
    }

    return result;
}

})();
