
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

・maxStack
ステートの最大スタック数です。1以上の数値を設定している場合、ステートがスタックするようになります。

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

・{rate_correction:[0, -10, 20, 0, 0, 0, 0, 10, 0, 0, 0]}
ステートを付与した時力が10%減少、魔力が20%増加、魔防が10%増加します。

・{maxStack:3, rate_correction:[0, 0, 0, 0, 20, 0, -10, 0, 0, 0, 0]}
ステートが最大3スタックし、1スタックごとに速さが20%増加、守備が10%減少します。


■注意
以下プラグインは競合するため、同時に使用しないでください。
・キュウブ様作「1つのステートを重ねがけする」
・キュウブ様作「パラメータを割合変化させるステート」


■更新履歴
23/12/27　初回リリース


■動作確認バージョン
SRPG Studio Version:1.288


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
            if (unit.custom.stackState[state.getId()] < state.custom.maxStack) {
                unit.custom.stackState[state.getId()]++;
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
                if (typeof state.custom.overlappingTurn === "number") {
                    // overlappingTurn が設定されているなら overlappingTurn をターンに設定
                    turnState.setTurn(state.custom.overlappingTurn);
                }
                if (typeof unit.custom.stackState === 'undefined') {
                    unit.custom.stackState = [];
                }
                unit.custom.stackState[state.getId()] = 1;
            }
        }

        // スタック数が maxStack に達したら別のステートを付与する場合
        if (unit.custom.stackState[state.getId()] === state.custom.maxStack &&
        typeof state.custom.nextState === 'number') {
            // removePreviousState が true であれば、既存ステートを削除
            if (typeof state.custom.removePreviousState !== 'undefined' && state.custom.removePreviousState === true) {
                StateControl.arrangeState(unit, state, IncreaseType.DECREASE);
                unit.custom.stackState[state.getId()] = 0;
            }

            // 新しいステートを付与
            var newState = root.getBaseData().getStateList().getDataFromId(state.custom.nextState);
            StateControl.arrangeState(unit, newState, IncreaseType.INCREASE);
        }

        return;
    // maxStack が設定されたステートを削除するとき
    } else if (increaseType === IncreaseType.DECREASE && typeof state.custom.maxStack === "number") {
        editor.deleteTurnStateData(list, state);

        // スタック数を初期化
        unit.custom.stackState[state.getId()] = 0;
    } else {
        _StateControl_arrangeState.apply(this, arguments);
    }
};


//----------------------------------
// StateControlクラス
//----------------------------------
// 「自然回復」の値を取得する
var alias1 = StateControl.getHpValue;
StateControl.getHpValue = function(unit) {
    var i, state;
    var list = unit.getTurnStateList();
    var count = list.getCount();
    var recoveryValue = 0;

    if (typeof unit.custom.stackState === 'undefined') {
        return alias1.call(this, unit);
    }
    
    for (i = 0; i < count; i++) {
        state = list.getData(i).getState();
        // スタックしている分、自然回復値を乗算
        if (typeof state.custom.maxStack === 'number' && typeof unit.custom.stackState[state.getId()] === 'number') {
            recoveryValue += state.getAutoRecoveryValue() * unit.custom.stackState[state.getId()];
        } else {
            recoveryValue += state.getAutoRecoveryValue();
        }
    }
    
    return recoveryValue;
};

// 「ターン毎のボーナス減少値」を考慮したパラメータ値を取得する
var alias2 = StateControl.getStateParameter;
StateControl.getStateParameter = function(unit, index) {
    var list = unit.getTurnStateList();
    var count = list.getCount();
    var value = alias2.call(this, unit, index);
    var state;

    for (var i = 0; i < count; i++) {
        state = list.getData(i).getState();
        if (typeof state.custom.rate_correction === 'object') { 
            value += ParamGroup.getClassUnitValue(unit, index) * state.custom.rate_correction[index] / 100;
        }
        // スタックしている分、パラメータボーナスを乗算
        if (typeof state.custom.maxStack === 'number' && typeof unit.custom.stackState[state.getId()] === 'number') { 
            value *= unit.custom.stackState[state.getId()];
        }
    }

    return Math.floor(value);
};

//----------------------------------
// UnitProviderクラス
//----------------------------------
// ユニット登場時にカスパラを初期化
var _UnitProvider__resetState = UnitProvider._resetState;
UnitProvider._resetState = function(unit) {
    _UnitProvider__resetState.apply(this, arguments);

    // ユニットのカスパラを初期化
    unit.custom.stackState = [];
};

//----------------------------------
// DamageControlクラス
//----------------------------------
// ユニットの状態変更時にカスパラを初期化
var _DamageControl_setReleaseState = DamageControl.setReleaseState;
DamageControl.setReleaseState = function(unit) {
    _DamageControl_setReleaseState.apply(this, arguments);

    // ユニットのカスパラを初期化
    unit.custom.stackState = [];
};
})();
