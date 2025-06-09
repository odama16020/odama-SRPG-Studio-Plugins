
/*--------------------------------------------------------------------------
  
　スタックするステート
  作成者：おおだま

■概要
ステートにスタック数を設定し、重ねがけができるようにします。
スタックした場合、ステートの自然回復値とパラメータボーナスがスタック分だけ乗算されます。
また、最大までスタックした場合に別のステートを付与することもできます。

ステータス画面でスタック数を表示させたい場合、同梱の「ステ画面ステート表示（スタック数対応版）.js」を使用してください。


■設定方法
プラグインをフォルダに入れ、スタックするように設定したいステートに以下カスパラを設定します。

・maxStack (必須)
ステートの最大スタック数です。1以上の数値を設定している場合、ステートがスタックするようになります。

・requiredStack
2以上の数値を設定している場合、ステートのパラメータボーナスおよび自然回復を発生させるためにrequiredStack分のスタック数が必要になります。
例として、力に1のパラメータボーナスを設定し、requiredStack:3とした場合、ステートが3スタックするごとに力が1増加します。

・overlappingTurn
設定している場合、ステートを付与したときにツール側の「持続ターン」設定を無視し、設定値の分だけステートの持続ターンが設定され、
スタックさせた場合は設定値の分だけ持続ターンが延長されます。
この設定を使用する場合、ツール側の持続ターンは99に設定してください。

・nextState
ステートが最大スタック数に達した時、新しく付与するステートをIDで設定します。

・removePreviousState
nextStateを設定し、かつ本パラメータをtrueに設定した場合、
新しいステートを付与したタイミングでスタックさせていた元のステートを削除します。

・rate_correction
rate_correction:[<最大HP>, <力>, <魔力>, <技>, <速さ>, <幸運>, <守備>, <魔防>, <移動>, <熟練度>, <体格>]
と設定（値はパーセント）することで、対応するステータスを割合変化させます（小数点切り捨て）。
※キュウブ様作「パラメータを割合変化させるステート」からマージした機能です


■カスパラ設定例
・{maxStack:3}
ステートが最大3スタックします。

・{maxStack:5, overlappingTurn:2}
ステートが最大5スタックし、ステートを付与するごとに持続ターンが2ターン延長します。
最大スタック時に付与した場合、スタック数は変わりませんが持続ターンは更に延長します。

・{maxStack:4, nextState:2}
ステートを4スタックさせたとき、ID2のステートを付与します。
スタックさせた元のステートは維持されます。

・{maxStack:6, nextState:11, removePreviousState:true}
ステートを6スタックさせたとき、ID11のステートを付与し、スタックさせた元のステートを削除します。

・{maxStack:1, nextState:5}
ステートを1スタック（＝初回付与）させたとき、ID5のステートを付与します。maxStackが1の場合、スタック数は表示されません。
また、ID5のステートに{maxStack:1, nextState:6}と設定すると更にID6のステートを付与できます。

・{rate_correction:[0, -10, 20, 0, 0, 0, 0, 10, 0, 0, 0]}
ステートを付与した時力が10%減少、魔力が20%増加、魔防が10%増加します。

・{maxStack:3, rate_correction:[0, 0, 0, 0, 20, 0, -10, 0, 0, 0, 0]}
ステートが最大3スタックし、1スタックごとに速さが20%増加、守備が10%減少します。


■おまけ：天邪鬼スキル
データ設定で、種類を「カスタム」にしたスキルを作成し、キーワードに"contrary"と入力します。
スキルを所持したユニットは、ステートによる能力の上昇と下降が反転します。


■おまけ：ステートのスタック数を減らす関数
decreaseStackStateというイベント用の関数を用意しています。
<スクリプトの実行>でオリジナルデータに対象のユニットとステートを設定し「コード実行」で以下例のようなコードを入力することで
対象ユニットにステートが付与されている場合、そのステートのスタック数を指定数減らし、0以下になった場合はステートを消去します。

(例)
var unit = root.getEventCommandObject().getOriginalContent().getUnit();
var state = root.getEventCommandObject().getOriginalContent().getState();
var num = 1; // この値だけスタック数減少
decreaseStackState(unit, state, num);


■注意
以下プラグインは競合するため、同時に使用しないでください。
・キュウブ様作「1つのステートを重ねがけする」
・キュウブ様作「パラメータを割合変化させるステート」
・StateControl.getHpValue または StateControl.getStateParameter を独自定義しているプラグイン全般


■更新履歴
23/12/27 初回リリース
23/12/27 maxStackが1でもnextStateが付与されるよう修正
24/01/15 複数のステートで同一ステータスが上昇していたときの値が正しくなるよう修正
25/06/10 スタック数の取得方法を変更、requiredStackおよび天邪鬼スキル、スタック数を減らすスクリプトを追加


■動作確認バージョン
SRPG Studio Version:1.312


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK (明記する場合は"おおだま"でお願いします)
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。
*/


(function () {
var _StateControl_arrangeState = StateControl.arrangeState;
StateControl.arrangeState = function (unit, state, increaseType) {
    var turnState, currentTurn;
    var list = unit.getTurnStateList();
    var count = list.getCount();
    var editor = root.getDataEditor();

    // maxStack が設定されたステートを付与するとき
    if (increaseType === IncreaseType.INCREASE && typeof state.custom.maxStack === 'number' && state.custom.maxStack > 0) {
        turnState = this.getTurnState(unit, state);
        // 既にステートが付与されているとき
        if (turnState !== null) {
            // スタック数が設定済みかつ maxStack 未満なら加算
                if (turnState.custom.stack < state.custom.maxStack) {
                    turnState.custom.stack++;
            }

            // ターン数の設定
            currentTurn = turnState.getTurn();
            if (typeof state.custom.overlappingTurn === 'number') {
                // overlappingTurn が設定されていれば overlappingTurn をターンに加算
                turnState.setTurn(currentTurn + state.custom.overlappingTurn);
            } else {
                // overlappingTurn が未設定ならツールのターンを設定
                turnState.setTurn(state.getTurn());
            }
        // ステートを新規で付与するとき
        } else {
            if (count < DataConfig.getMaxStateCount()) {
                editor.addTurnStateData(list, state);
                turnState = this.getTurnState(unit, state);
                if (typeof state.custom.overlappingTurn === 'number') {
                    // overlappingTurn が設定されているなら overlappingTurn をターンに設定
                    turnState.setTurn(state.custom.overlappingTurn);
                }
                turnState.custom.stack = 1;
            }
        }

        // スタック数が maxStack に達したら別のステートを付与する場合
            if (turnState.custom.stack === state.custom.maxStack &&
                typeof state.custom.nextState === 'number') {
                    // removePreviousState が true であれば、既存ステートを削除
                    if (typeof state.custom.removePreviousState !== 'undefined' && state.custom.removePreviousState === true) {
                        StateControl.arrangeState(unit, state, IncreaseType.DECREASE);
            }

            // 新しいステートを付与
            var newState = root.getBaseData().getStateList().getDataFromId(state.custom.nextState);
            StateControl.arrangeState(unit, newState, IncreaseType.INCREASE);
        }
    } else {
        return _StateControl_arrangeState.apply(this, arguments);
    }
		
    MapHpControl.updateHp(unit);
    
    return turnState;
};


//----------------------------------
// StateControlクラス
//----------------------------------
// 「自然回復」の値を取得する
StateControl.getHpValue = function(unit) {
    var i, turnState, state, stack;
    var list = unit.getTurnStateList();
    var count = list.getCount();
    var recoveryValue = 0;
    
    for (i = 0; i < count; i++) {
        turnState = list.getData(i);
        state = turnState.getState();
        // スタックしている分、自然回復値を乗算
        if (typeof turnState.custom.stack !== 'undefined' && typeof turnState.custom.stack === 'number') {
            if (typeof state.custom.requiredStack === 'number' && state.custom.requiredStack > 1) {
                stack = Math.floor(turnState.custom.stack / state.custom.requiredStack);
            } else {
                stack = turnState.custom.stack;
            }
            recoveryValue += state.getAutoRecoveryValue() * stack;
        } else {
            recoveryValue += state.getAutoRecoveryValue();
        }
    }
    
    return recoveryValue;
};

// 「ターン毎のボーナス減少値」を考慮したパラメータ値を取得する
StateControl.getStateParameter = function(unit, index) {
    var list = unit.getTurnStateList();
    var count = list.getCount();
    var totalValue = 0;
    var turnState, state, stateValue, stack;
    var hp = unit.getHp();

    for (var i = 0; i < count; i++) {
        turnState = list.getData(i);
        state = turnState.getState();
        stateValue = 0;

        // 元の処理
        stateValue += ParamGroup.getDopingParameter(list.getData(i), index);

        // rate_correction が設定されている場合はステータスを割合変化
        if (typeof state.custom.rate_correction === 'object') { 
            stateValue += ParamGroup.getClassUnitValue(unit, index) * state.custom.rate_correction[index] / 100;
        }
        // スタックしている分、パラメータボーナスを乗算
        if (typeof state.custom.maxStack === 'number' && typeof turnState.custom.stack === 'number') { 
            if (typeof state.custom.requiredStack === 'number' && state.custom.requiredStack > 1) {
                stack = Math.floor(turnState.custom.stack / state.custom.requiredStack);
            } else {
                stack = turnState.custom.stack;
            }

            stateValue *= stack;
        }

        // 天邪鬼スキル（上昇下降を反転）
        var contrarySkill = SkillControl.getPossessionCustomSkill(unit, 'contrary');
        if(contrarySkill){
            stateValue *= -1;
        }

        // 合計値にステート単位の値を加算
        totalValue += Math.floor(stateValue);
    }

    return totalValue;
};

})();

// ステートのスタック数を減らす
decreaseStackState = function(unit, state, num) {
    var turnState = StateControl.getTurnState(unit, state);
    if (turnState !== null && typeof turnState.custom.stack === 'number') {
        turnState.custom.stack -= num;
        // スタック数が0以下になった場合はステートを解除
        if (turnState.custom.stack < 1) {
            StateControl.arrangeState(unit, state, IncreaseType.DECREASE);
        }
    }
};
