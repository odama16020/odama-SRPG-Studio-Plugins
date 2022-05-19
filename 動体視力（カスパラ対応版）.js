/********************************************************************************
○利用規約
原則としてSRPG Studio公式の規約を必ず守ってください。

・商用利用ＯＫ（こんな物を商用で使う人がいるのか分かりませんが）
・改変ＯＫ（むしろスクリプトに詳しい方に手直ししていただけるとありがたいです）
・再配布ＯＫ（ただし必ず無償で配布してください）
・使用時の報告及びreadmeなどへの記載不要（記載していただける場合はスケルトンの人と書いておいてください）
・wiki掲載ＯＫ

その他公式や第三者の方のご迷惑になるような使用はお控えください。
それによって不都合が生じても、私は一切責任を負いません。

********************************************************************************
スキル「動体視力」（作者：スケルトンの人）
公開日：2016/05/14
対応ver：1.077
ベース：公式singleton-calculator→HitCalculator内のcalculateAvoidを抜き出し改変
　　　（1-239氏の統合Calculator、名称未定氏のthrow-masterを参考）

利用方法：Pluginフォルダに放り込んで
データ設定でスキルを作成→スキル種類をカスタムに設定→キーワードにdynamic-visionと入力
スキルのカスタムパラメータに{exAvoid:xxx}を指定します。（xxxは整数）

説明：
・相手に間接攻撃を仕掛けられた時、カスパラのexAvoidに設定したxxxの値の分、回避率上昇
　※数値を設定していない場合は0とみなされます。負の値も一応設定可能です（回避率が減少します）。

※本体のverアップによって、本スクリプトが使用できなくなる可能性がある事もご了承ください

変更履歴
公開日 ：2018/07/19
対応ver：1.189
         イベントコマンド「ダメージを与える」で命中率を設定するとエラー落ちするバグを修正（修正：名前未定）

公開日 ：2022/05/20
動作確認ver：1.259
         回避率をカスパラで設定できるよう改変（改変者：おおだま）

********************************************************************************/
(function(){

	var alias1 = HitCalculator.calculateAvoid;
	HitCalculator.calculateAvoid = function(active, passive, weapon, totalStatus) {
		var avo = alias1.call(this, active, passive, weapon, totalStatus);
		var skill = SkillControl.getPossessionCustomSkill(passive,'dynamic-vision');
	
		// カスパラに設定したexAvoidの値を取得
		var exAvoid = 0;
		if (skill && typeof skill.custom.exAvoid === 'number') {
			exAvoid = parseInt(skill.custom.exAvoid);
		}
	
		var turnType = root.getCurrentSession().getTurnType();
	
		var direction;
		var isDirectAttack;
	
		if(active && turnType == active.getUnitType()){
			if(skill){
				direction = PosChecker.getSideDirection(active.getMapX(), active.getMapY(), passive.getMapX(), passive.getMapY());
				isDirectAttack = direction !== DirectionType.NULL;
				if( isDirectAttack === false ) {
					// 間接攻撃を仕掛けられた時、exAvoidの値の分、回避率上昇
					avo += exAvoid;
				}
			}
		}
	
		return avo;
	}

})();