/*--------------------------------------------------------------------------
　相手の守備か魔防の低い方でダメージ計算するスキル

■概要
このスキルを所持したユニットは攻撃時、物理攻撃か魔法攻撃かにかかわらず、相手の守備か魔防の低い方でダメージを計算します。

■使用方法
１．本プラグインをPluginフォルダに入れます。
２．データ設定で、種類を「カスタム」にしたスキルを作成し、キーワードに"dualElementAttack"と入力します。

■作成者:
おおだま
https://twitter.com/odama16020

■動作確認バージョン
v1.280

■更新履歴:
2023/04/27 公開

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・加工、再配布、転載　OK
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。

--------------------------------------------------------------------------*/

(function() {

// カスタムスキルのキーワード
var dualElementAttackKeyword = 'dualElementAttack';

// スキルが付与されていれば、敵の守備・魔防のうち低い方を防御力とする
var alias1 = DamageCalculator.calculateDefense;
DamageCalculator.calculateDefense = function(active, passive, weapon, isCritical, totalStatus, trueHitValue) {
    var def;
    var skillDualElement = SkillControl.getPossessionCustomSkill(active, dualElementAttackKeyword);

    if (this.isNoGuard(active, passive, weapon, isCritical, trueHitValue)) {
        return 0;
    }

    if (skillDualElement) {
        def = Math.min(RealBonus.getDef(passive), RealBonus.getMdf(passive));
        def += CompatibleCalculator.getDefense(passive, active, ItemControl.getEquippedWeapon(passive)) + SupportCalculator.getDefense(totalStatus);
    } else {
        def = alias1.call(this, active, passive, weapon, isCritical, totalStatus, trueHitValue);
    }
    
    return def;
}
    
})();
