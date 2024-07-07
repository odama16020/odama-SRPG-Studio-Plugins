/*--------------------------------------------------------------------------
  
受けるダメージを割合変更するスキル

■概要
攻撃またはアイテムによるダメージを受ける時、スキルの所持者はカスパラの"additionalDamageRate"に設定した値の％分、ダメージが増減します。

■使用方法
１．本プラグインをPluginフォルダに入れます。
２．データ設定で、種類を「カスタム」にしたスキルを作成し、キーワードに"modifyDamageRate"と入力します。
３．作成したスキルのカスタムパラメータに{additionalDamageRate:xxx}を指定します。（xxxは-100以上の整数）

■カスパラ設定例：
・{additionalDamageRate:-20}
　→受けるダメージが20%減少します。

・{additionalDamageRate:50}
　→受けるダメージが50%増加します。（敵対するユニットからのステート付与で追加されるスキルを想定）

■その他、注意事項
このスキルを複数所持している場合、additionalDamageRateはそれらの合計値となります。
additionalDamageRateの（合計）値の最小はデフォルトで-100としており、それ以下になった場合は-100に補正します。
本プラグインの「設定」項目にある"allowMinusDamageRate"を"true"に変更することで、それ以下の値を許可します。
additionalDamageRateの（合計）値が-100を超える場合、ダメージはマイナス、つまり回復となります。
※戦闘予測結果や効果音がおかしくなったりするため、使用は自己責任でお願いします

■作成者:
おおだま
https://twitter.com/odama16020

■動作確認バージョン
v1.298

■更新履歴:
2024/07/07 公開

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・加工、再配布、転載　OK
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。
  
--------------------------------------------------------------------------*/
(function() {

//-------------------------------------------------------
// 設定
//-------------------------------------------------------
var allowMinusDamageRate = false;   // true:ダメージ割合がマイナス（＝回復）になるのを許可する false:許可しない（デフォルト）
var KEYWORD = 'modifyDamageRate';   // ダメージ倍率変更スキルのカスタムキーワード


//-------------------------------------------------------
// 以下、プログラム
//-------------------------------------------------------
// 戦闘で呼ばれるダメージ計算
var alias1 = DamageCalculator.calculateDamage;
DamageCalculator.calculateDamage = function(active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue) {
    // DamageCalculator.calculateDamageの元処理を呼び出し
    var result = alias1.call(this, active, passive, weapon, isCritical, activeTotalStatus, passiveTotalStatus, trueHitValue);
    
    var i, skill, count;
    var damageRate = 100;   // デフォルトのダメージ割合 (100%)

    // ダメージを受ける側の、変数KEYWORDに設定したカスタムキーワードを持つスキルをすべて取得
    var skillArray = SkillControl.getDirectSkillArray(passive, SkillType.CUSTOM, KEYWORD);
    if (skillArray) {
        count = skillArray.length;
        for(i = 0; i < count; i++) {
            // skillArrayのi番目のskillオブジェクトを取得
            skill = skillArray[i].skill;

            // スキルのカスパラにadditionalDamageRateが設定されていれば、その値の分damageRateを増減
            if (typeof skill.custom.additionalDamageRate === 'number') {
                damageRate += skill.custom.additionalDamageRate;
            }
        }
        // damageRateが負の値かつ、allowMinusDamageRateがfalseのときは0に補正
        if (damageRate < 0 && !allowMinusDamageRate) {
            damageRate = 0;
        }
        result = Math.floor(result * damageRate / 100);
    }

    return result;
}

// アイテムで呼ばれるダメージ計算
var alias2 = Calculator.calculateDamageValue;
Calculator.calculateDamageValue = function(targetUnit, damageValue, damageType, plus) {
    // Calculator.calculateDamageValueの元処理を呼び出し
    var result = alias2.call(this, targetUnit, damageValue, damageType, plus);

    var i, skill, count;
    var damageRate = 100;   // デフォルトのダメージ割合 (100%)

    // ダメージを受ける側の、変数KEYWORDに設定したカスタムキーワードを持つスキルをすべて取得
    var skillArray = SkillControl.getDirectSkillArray(targetUnit, SkillType.CUSTOM, KEYWORD);
    if (skillArray) {
        count = skillArray.length;
        for(i = 0; i < count; i++) {
            // skillArrayのi番目のskillオブジェクトを取得
            skill = skillArray[i].skill;

            // スキルのカスパラにadditionalDamageRateが設定されていれば、その値の分damageRateを増減
            if (typeof skill.custom.additionalDamageRate === 'number') {
                damageRate += skill.custom.additionalDamageRate;
            }
        }
        // damageRateが負の値かつ、allowMinusDamageRateがfalseのときは0に補正
        if (damageRate < 0 && !allowMinusDamageRate) {
            damageRate = 0;
        }
        result = Math.floor(result * damageRate / 100);
    }

    return result;
}

})();
