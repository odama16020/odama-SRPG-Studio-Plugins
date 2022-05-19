/*--------------------------------------------------------------------------
  
強制戦闘で通常戦闘と同じ命中・必殺判定

■概要
　マップイベントの「強制戦闘」で設定した「命中」「クリティカル」「ミス」を無視し、通常戦闘と同じ判定で処理を行います。

■事前準備
　１．本プラグインをPluginフォルダに入れます。
　２．強制戦闘イベントの直前と直後に「スクリプトの実行」イベントを追加し、「コードの実行」を選択してコード欄にそれぞれ以下の(function() { ～ })(); までを貼り付けます。
　　　コードの実行を入れなかった場合は、標準の強制戦闘の処理を行います。
　　※とくに、戦闘イベント後の処理を忘れるとセーブデータに保存され、他のイベントに影響が出る可能性もあるため注意してください。


・強制戦闘イベントの直前に実行
(function() {
    root.getMetaSession().global.isForceBattleNormalCalculate = 1;
})();


・強制戦闘イベントの直後に実行
(function() {
    root.getMetaSession().global.isForceBattleNormalCalculate = 0;
})();

■その他、注意事項
　攻撃回数より多くの動作を作成していた場合、武器設定の攻撃回数を無視し、動作を設定した分だけ攻撃が実行されます。

■作成者:
おおだま
https://twitter.com/odama16020

■動作確認バージョン
v1.259

■更新履歴:
2022/05/19 公開

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・加工、再配布、転載　OK
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。
  
--------------------------------------------------------------------------*/

(function() {

    var alias1 = AttackEvaluator.ForceHit.isHit;
    AttackEvaluator.ForceHit.isHit = function(virtualActive, virtualPassive, attackEntry) {
        alias1.call(this, virtualActive, virtualPassive, attackEntry);
        
        var type = this._parentOrderBuilder.getForceEntryType(virtualActive.unitSelf, virtualActive.isSrc);
        
        // グローバルパラメータが設定されている場合、強制戦闘イベント上の設定を無視して命中判定を行う
        if (typeof root.getMetaSession().global.isForceBattleNormalCalculate !== 'undefined' && root.getMetaSession().global.isForceBattleNormalCalculate) {
            return AttackEvaluator.HitCritical.isHit(virtualActive, virtualPassive, attackEntry);
        }
        else {
            if (type === ForceEntryType.HIT || type === ForceEntryType.CRITICAL) {
                // 命中すべきであるためtrueを返す
                return true;
            }
            else if (type === ForceEntryType.MISS) {
                return false;
            }
            else {
                // エントリがなくなった場合は、既定値を参照する
                return AttackEvaluator.HitCritical.isHit(virtualActive, virtualPassive, attackEntry);
            }
        }
    };
    
    var alias2 = AttackEvaluator.ForceHit.isCritical;
    AttackEvaluator.ForceHit.isCritical = function(virtualActive, virtualPassive, attackEntry) {
        alias2.call(this, virtualActive, virtualPassive, attackEntry);
    
        var type = this._parentOrderBuilder.getForceEntryType(virtualActive.unitSelf, virtualActive.isSrc);
        
        // グローバルパラメータが設定されている場合、強制戦闘イベント上の設定を無視してクリティカル判定を行う
        if (typeof root.getMetaSession().global.isForceBattleNormalCalculate !== 'undefined' && root.getMetaSession().global.isForceBattleNormalCalculate) {
            return AttackEvaluator.HitCritical.isCritical(virtualActive, virtualPassive, attackEntry);
        }
        else {
            if (type === ForceEntryType.CRITICAL) {
                // クリティカルを出すべきであるため、trueを返す
                return true;
            }
            else if (type === ForceEntryType.HIT || type === ForceEntryType.MISS) {
                return false;
            }
            else {
                return AttackEvaluator.HitCritical.isCritical(virtualActive, virtualPassive, attackEntry);
            }
        }
    };
    
    })();