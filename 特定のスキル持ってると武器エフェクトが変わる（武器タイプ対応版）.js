/*--------------------------------------------------------------------------
　特定のスキルを持っている時に武器エフェクトを変更する（武器タイプ対応版） ver 1.0

■オリジナル作成者
キュウブ 様

※本プラグインで発生した不具合について、キュウブ様に問い合わせるのは絶対にやめてください。


改変者：おおだま

■使い方
1.発動のトリガーとなるカスタムスキルを持たせておく(カスタムキーワードは任意)
2.「武器」または「コンフィグ->武器タイプ」に以下のカスパラ設定を行う
weaponExtraEffectArray: [
	{
		type: <エフェクトタイプ>,
		skillCustomKeyword: "<トリガーとなるスキルのカスタムキーワード>",
		effect: {
			isRuntime: <エフェクトがランタイムならtrue, オリジナルならfalse>,
			id: <エフェクトID>
		}
	},
	...
]

■各カスパラの説明
■■type: <エフェクトタイプ>
どのエフェクトで発動するかを指定する(簡易ダメージで発動させるか?リアル戦闘のクリティカルで発動させるか?といった具合)
以下の文字列をコピペすれば良い

WeaponEffectAnime.REALDAMAGE <---リアル戦闘のダメージエフェクト
WeaponEffectAnime.EASYDAMAGE <---簡易戦闘のダメージエフェクト
WeaponEffectAnime.REALCRITICAL <---リアル戦闘のクリティカルダメージエフェクト
WeaponEffectAnime.EASYCRITICAL <---簡易戦闘のクリティカルダメージエフェクト
WeaponEffectAnime.MAGICINVOCATION  <---魔法発動時のエフェクト

※注意※
定数なのでダブルクォーテーションやシングルクォーテーションなどで括ってはいけない

誤った書き方: type: "WeaponEffectAnime.REALDAMAGE" <--""で括っているからアウト
正しい書き方: type: WeaponEffectAnime.REALDAMAGE

■■skillCustomKeyword: <トリガーとなるスキルのカスタムキーワード>
ここで設定されたキーワードを持つスキルをユニットが所持していた場合にエフェクトが変更される
こちらは文字列なのでダブルクォーテーションやシングルクォーテーションで括る事

誤った書き方: skillCustomKeyword: hoge
正しい書き方: skillCustomKeyword: "hoge"

■■effect
変更するエフェクトアニメの情報を示す
isRuntime はランタイムエフェクトならtrue, オリジナルエフェクトならfalseと指定する
id は エフェクトIDを指定する

■実装例
例1:
'fire'というカスタムスキルを持っている時に
リアル戦闘の通常ダメージでランタイムエフェクト0番(火柱)、リアル戦闘のクリティカルダメージでランタイムエフェクト9番(火炎地獄)を発動させたい

weaponExtraEffectArray: [
	{
		type: WeaponEffectAnime.REALDAMAGE,
		skillCustomKeyword: 'fire',
		effect: {
			isRuntime: true,
			id: 0
		}
	},
	{
		type: WeaponEffectAnime.REALCRITICAL,
		skillCustomKeyword: 'fire',
		effect: {
			isRuntime: true,
			id: 9
		}
	}
]

例2:
'wind'というカスタムスキルを持っている時に
リアル戦闘の通常ダメージ、クリティカルダメージ両方でランタイムエフェクト11番(風切り)を発動させたい
'wind2'というカスタムスキルを持っている時に
簡易戦闘の通常ダメージ、クリティカルダメージ両方ではランタイムエフェクト2番(竜巻)を発動させたい

weaponExtraEffectArray: [
	{
		type: WeaponEffectAnime.REALDAMAGE,
		skillCustomKeyword: 'wind',
		effect: {
			isRuntime: true,
			id: 11
		}
	},
	{
		type: WeaponEffectAnime.REALCRITICAL,
		skillCustomKeyword: 'wind',
		effect: {
			isRuntime: true,
			id: 11
		}
	},
	{
		type: WeaponEffectAnime.EASYDAMAGE,
		skillCustomKeyword: 'wind2',
		effect: {
			isRuntime: true,
			id: 2
		}
	},
	{
		type: WeaponEffectAnime.EASYCRITICAL,
		skillCustomKeyword: 'wind2',
		effect: {
			isRuntime: true,
			id: 2
		}
	}
]

例3（改変者補足）:
同一typeのエフェクト設定を一つのカスパラに複数書くことも可能です。
以下のような設定の場合、'fire'のスキルを持っている場合はskillCustomKeyword: 'fire'のエフェクトが発動し、
'wind'のスキルを持っている場合はskillCustomKeyword: 'wind'のエフェクトが発動します。
'fire'と'wind'の両方のスキルを持っていた場合は、上に書いた方（例の場合は'fire'）のエフェクトが発動します。

weaponExtraEffectArray: [
	{
		type: WeaponEffectAnime.REALDAMAGE,
		skillCustomKeyword: 'fire',
		effect: {
			isRuntime: true,
			id: 0
		}
	},
	{
		type: WeaponEffectAnime.REALCRITICAL,
		skillCustomKeyword: 'fire',
		effect: {
			isRuntime: true,
			id: 9
		}
	},
	{
		type: WeaponEffectAnime.REALDAMAGE,
		skillCustomKeyword: 'wind',
		effect: {
			isRuntime: true,
			id: 11
		}
	},
	{
		type: WeaponEffectAnime.REALCRITICAL,
		skillCustomKeyword: 'wind',
		effect: {
			isRuntime: true,
			id: 11
		}
	}
]

■武器タイプでの設定
「コンフィグ->武器タイプ」の中にある武器タイプのカスパラにweaponExtraEffectArrayを設定することで、
その武器種すべてに対して同一の設定を適用します。
武器のカスパラにweaponExtraEffectArrayを設定している場合、その武器はそちらを優先して適用します。
また、武器のカスパラに{noExtraEffect:1}と設定することで、武器タイプの設定を無視して通常のエフェクトを表示します。

（補足）武器と武器タイプの両方にweaponExtraEffectArrayを設定した場合の挙動
武器にskillCustomKeyword:'fire'、武器タイプにskillCustomKeyword:'wind'のカスパラを設定した場合
・fireとwind両方のスキルを所持 → fireのエフェクトを表示
・windのスキルのみ所持 → windのエフェクトを表示
という風になります。


■更新履歴（改変元）
ver 1.0 (2017/10/13)
初版

■更新履歴（改変後）
ver 1.0 (2024/01/10)
武器タイプで一括設定できるよう改変

■動作確認バージョン
SRPG Studio Version:1.288

■規約
・利用はSRPG Studioを使ったゲームに限ります。
・商用・非商用問いません。フリーです。
・加工等、問題ありません。
・クレジット明記無し　OK
・再配布、転載　OK (バグなどがあったら修正できる方はご自身で修正版を配布してもらっても構いません)
・wiki掲載　OK
・SRPG Studio利用規約は遵守してください。

--------------------------------------------------------------------------*/

WeaponEffectControl.getAnime = function(unit, type) {
	var weaponEffect;
	var anime = null;
	var weapon = BattlerChecker.getRealBattleWeapon(unit);
	var arr = ['realdamage', 'easydamage', 'realcritical', 'easycritical', 'magicinvocation'];

	if (weapon !== null) {
		// 武器のカスパラ設定を優先して取得
		anime = this._getWeaponExtraEffectAnime(unit, weapon, type);
		if (!anime) {
			// 武器タイプのカスパラ設定を取得
			anime = this._getWeaponTypeExtraEffectAnime(unit, weapon, type);
			if (!anime) {
				// 通常のアニメ取得処理
				weaponEffect = weapon.getWeaponEffect();
				anime = weaponEffect.getAnime(type, arr[type]);
			}
		}

	}

	return anime;
};

WeaponEffectControl._getWeaponExtraEffectAnime = function(unit, weapon, type) {
	var count, extraEffect;

	if (validateWeaponExtraEffectArrayCustomParameter(weapon.custom) === false) {
		return null;
	}

	count = weapon.custom.weaponExtraEffectArray.length;
	for (var index = 0; index < count; index++) {
		extraEffect = weapon.custom.weaponExtraEffectArray[index];

		if (validateWeaponExtraEffectObject(extraEffect) === false) {
			continue;
		}

		if (extraEffect.type === type && SkillControl.getPossessionCustomSkill(unit, extraEffect.skillCustomKeyword)) {
			return root.getBaseData().getEffectAnimationList(extraEffect.effect.isRuntime).getDataFromId(extraEffect.effect.id);
		}
	} 

	return null;
};

WeaponEffectControl._getWeaponTypeExtraEffectAnime = function(unit, weapon, type) {
	var count, extraEffect;

	if (validateWeaponExtraEffectArrayCustomParameter(weapon.getWeaponType().custom) === false) {
		return null;
	}

	// 武器タイプの設定を無視する場合
	if (typeof weapon.custom.noExtraEffect === 'number') {
		return null;
	}

	count = weapon.getWeaponType().custom.weaponExtraEffectArray.length;
	for (var index = 0; index < count; index++) {
		extraEffect = weapon.getWeaponType().custom.weaponExtraEffectArray[index];

		if (validateWeaponExtraEffectObject(extraEffect) === false) {
			continue;
		}

		if (extraEffect.type === type && SkillControl.getPossessionCustomSkill(unit, extraEffect.skillCustomKeyword)) {
			return root.getBaseData().getEffectAnimationList(extraEffect.effect.isRuntime).getDataFromId(extraEffect.effect.id);
		}
	} 

	return null;
};

var validateWeaponExtraEffectObject = function(object) {
	if (typeof object !== 'object') {
		return false;
	}

	if (!('type' in object) || !('skillCustomKeyword' in object) || !('effect' in object)) {
		return false;
	}

	if (typeof object.type !== 'number' || typeof object.skillCustomKeyword !== 'string' || typeof object.effect !== 'object') {
		return false;
	}

	if (!('id' in object.effect) || !('isRuntime' in object.effect)) {
		return false;
	}

	if (typeof object.effect.id !== 'number' || typeof object.effect.isRuntime !== 'boolean') {
		return false;
	}

	return true;
};

var validateWeaponExtraEffectArrayCustomParameter = function(custom) {
	if (typeof custom.weaponExtraEffectArray === 'object' &&
		typeof custom.weaponExtraEffectArray.length === 'number' &&
		typeof custom.weaponExtraEffectArray.splice === 'function' &&
		!(custom.weaponExtraEffectArray.propertyIsEnumerable('length'))) {
		return true;
	}

	return false;
};
