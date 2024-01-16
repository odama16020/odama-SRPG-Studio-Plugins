
/*--------------------------------------------------------------------------
　map-chipchanger改.js
 
カスタムスキルを持たせたユニットが通行したコースのマップチップを変更します。
  
作成者:
サファイアソフト様
https://srpgstudio.com/

改変者：おおだま


■使い方
1.カスタムスキルにカスタムキーワード"MapChipChanger"と設定
2.以下のようなカスタムパラメータを設定
mapChipChanger: {
	isRuntime: <マップチップがランタイムならtrue, オリジナルならfalse>,
	id: <マップチップID>,
	xSrc: <マップチップのリソース上のx座標(左から0,1,2,3...)>,
	ySrc: <マップチップのリソース上のy座標(上から0,1,2,3...)>,
	isLayer: <透過チップを設定する場合はtrue, そうでない場合はfalse>
}


■実装例
例1: ランタイム「屋内」の1行目左から2番目、グレーの格子柄のマップチップに変更する場合

mapChipChanger: {
	isRuntime: true,
	id: 30,
	xSrc: 1,
	ySrc: 0,
	isLayer: false
}


例2: ランタイム「置物」の2行目一番右、魔法陣のマップチップに透過状態で変更する場合

mapChipChanger: {
	isRuntime: true,
	id: 60,
	xSrc: 8,
	ySrc: 1,
	isLayer: true
}


■「再移動後に待機コマンドを表示する」スクリプトと併用する場合
キュウブ様作の上記スクリプトと併用する場合、135行目辺りに定義されている RepeatMoveFlowEntry._doLastAction() の
else文の中に以下を追記することで再移動をキャンセルした時にマップチップが復元されるようになります。

MapChipChanger.restoreChip();


■更新履歴（改変元）:
2024/01/11 公開


■更新履歴（改変後）：
2024/01/17 カスタムスキルで設定できるよう改変


■動作確認バージョン
SRPG Studio Version:1.289


■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。

--------------------------------------------------------------------------*/

(function() {

var alias1 = SimulateMove.startMove;
SimulateMove.startMove = function(unit, moveCource) {
    alias1.call(this, unit, moveCource);
    MapChipChanger.reset();
};

var alias2 = SimulateMove.moveUnit;
SimulateMove.moveUnit = function() {
    var result = alias2.call(this);
    var chipWidth = GraphicsFormat.MAPCHIP_WIDTH;
    var chipHeight = GraphicsFormat.MAPCHIP_HEIGHT;

    // カスタムスキルを取得
    var skill = SkillControl.getPossessionCustomSkill(this._unit, MAP_CHIP_CHANGER_KEYWORD);
    
    if (validateMapChipChangerSkill(skill) && (this._xPixel % chipWidth) === 0 && (this._yPixel % chipHeight) === 0) {
        MapChipChanger.changeChip(this._xPixel / chipWidth, this._yPixel / chipHeight, skill);
    }
        
    return result;
};

var alias3 = MapSequenceCommand._moveCommand;
MapSequenceCommand._moveCommand = function() {
    var result = alias3.call(this);

    // カスタムスキルを取得
    var skill = SkillControl.getPossessionCustomSkill(this._targetUnit, MAP_CHIP_CHANGER_KEYWORD);

    if (validateMapChipChangerSkill(skill) && result === MapSequenceCommandResult.CANCEL) {
        MapChipChanger.restoreChip();
    }
    
    return result;
};

var alias4 = SimulateMove.skipMove;
SimulateMove.skipMove = function(unit, moveCource) {
    var i, direction;
    var count = moveCource.length;
    var x = unit.getMapX();
    var y = unit.getMapY();

    // カスタムスキルを取得
    var skill = SkillControl.getPossessionCustomSkill(unit, MAP_CHIP_CHANGER_KEYWORD);
        
    alias4.call(this, unit, moveCource);
    
    if (validateMapChipChangerSkill(skill)) {
        for (i = 0; i < count; i++) {
            direction = moveCource[i];
            x += XPoint[direction];
            y += YPoint[direction];
            MapChipChanger.changeChip(x, y, skill);
        }
    }
};

})();

// カスタムスキルのキーワード
var MAP_CHIP_CHANGER_KEYWORD = 'MapChipChanger';

var MapChipChanger = {
    // キャンセル時のマップチップ復元用配列。非透過・透過でそれぞれ定義
    _chipArray: null,
    _layerChipArray: null,
    
    changeChip: function(x, y, skill) {
        // マップチップ復元用に現在位置のマップチップ情報を取得。objは非透過、layerObjは透過
        var obj = {x: x, y: y, handle: root.getCurrentSession().getMapChipGraphicsHandle(x, y, false)};
        var layerObj = {x: x, y: y, handle: root.getCurrentSession().getMapChipGraphicsHandle(x, y, true)};

        // スキルのカスパラからマップチップ変更用の情報を取得
        var handle = this._getChipHandle(skill);
        
        // 現在位置のマップチップ情報を配列に格納
        this._chipArray.push(obj);
        this._layerChipArray.push(layerObj);

        // マップチップを変更
        root.getCurrentSession().setMapChipGraphicsHandle(x, y, skill.custom.mapChipChanger.isLayer, handle);
    },
    
    restoreChip: function() {
        var i, obj, layerObj;
        var count = this._chipArray.length;
        var count2 = this._layerChipArray.length;
        
        // 配列からマップチップ情報を取得し全て復元
        if (count === count2) {
            for (i = 0; i < count; i++) {
                obj = this._chipArray[i];
                root.getCurrentSession().setMapChipGraphicsHandle(obj.x, obj.y, false, obj.handle);

                layerObj = this._layerChipArray[i];
                root.getCurrentSession().setMapChipGraphicsHandle(layerObj.x, layerObj.y, true, layerObj.handle);
            }
        } else {
            // 多分ないと思うけど _chipArray と _layerChipArray の要素数が異なる場合
            for (i = 0; i < count; i++) {
                obj = this._chipArray[i];
                root.getCurrentSession().setMapChipGraphicsHandle(obj.x, obj.y, false, obj.handle);
            }
            for (i = 0; i < count2; i++) {
                layerObj = this._layerChipArray[i];
                root.getCurrentSession().setMapChipGraphicsHandle(layerObj.x, layerObj.y, true, layerObj.handle);
            }
        }
        
        this.reset();
    },
    
    reset: function() {
        this._chipArray = [];
        this._layerChipArray = [];
    },
    
    // 変更後のマップチップを取得
    _getChipHandle: function(skill) {
        var isRuntime = skill.custom.mapChipChanger.isRuntime;
        var id = skill.custom.mapChipChanger.id;
        var xSrc = skill.custom.mapChipChanger.xSrc;
        var ySrc = skill.custom.mapChipChanger.ySrc;

        return root.createResourceHandle(isRuntime, id, 0, xSrc, ySrc);
    }
};

// スキルのカスパラが正しく設定されているかチェック
var validateMapChipChangerSkill = function (skill) {
    if (!skill) {
        return false;
    }
    if (typeof skill.custom !== "object") {
        return false;
    }
    if (typeof skill.custom.mapChipChanger !== "object") {
        return false;
    }
    if (
        !skill.custom.mapChipChanger.hasOwnProperty("isRuntime") ||
        !skill.custom.mapChipChanger.hasOwnProperty("id") ||
        !skill.custom.mapChipChanger.hasOwnProperty("xSrc") ||
        !skill.custom.mapChipChanger.hasOwnProperty("ySrc") ||
        !skill.custom.mapChipChanger.hasOwnProperty("isLayer")
    ) {
        root.log("invalid mapChipChanger parameter");
        return false;
    }
    if (
        typeof skill.custom.mapChipChanger.isRuntime !== "boolean" ||
        typeof skill.custom.mapChipChanger.id !== "number" ||
        typeof skill.custom.mapChipChanger.xSrc !== "number" ||
        typeof skill.custom.mapChipChanger.ySrc !== "number" ||
        typeof skill.custom.mapChipChanger.isLayer !== "boolean"
    ) {
        root.log("invalid mapChipChanger parameter");
        return false;
    }
    return true;
};
