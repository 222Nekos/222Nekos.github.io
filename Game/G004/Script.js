enchant();

enchant.Sound.enabledInMobileSafari = true;

if(location.protocol == 'file:'){
    enchant.ENV.USE_WEBAUDIO = false;
    console.log('1');
}

var SCREEN_WIDTH  = 400;  //画面の幅
var SCREEN_HEIGHT = 500;  //画面の高さ

window.onload = function() {

	var game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = 24;

	///////////////////////////////////////////////// 読み込み
	game.preload("images/title.png");
	game.preload("images/field.png");
	game.preload("images/inugoya.png");
	game.preload("images/seikai.png");
	game.preload("images/zannen.png");
	game.preload("images/kyan.png");
	game.preload("images/nyan.png");
	game.preload("images/kyun.png");
	game.preload("images/syan.png");
	game.preload("images/jhon.png");
	game.preload("images/gyoza.png");
	game.preload("images/tokei.png");
	game.preload("images/animal0.png");
	game.preload("images/animal1.png");
	game.preload("images/animal2.png");
	game.preload("images/animal3.png");
	game.preload("images/animal4.png");
	game.preload("images/animal5.png");
	game.preload("images/retry.png");
	game.preload("images/memo4-2.mp3");

	game.onload = function() {

		///////////////////////////////////////////////// グローバル変数
		var LevelFCnt = 0;    //シーン：レベル表示の経過フレーム数
		var MainFCnt = 0;     //シーン：ゲーム画面の経過フレーム数
		var ClearFCnt = 0;    //シーン：クリア画面の経過フレーム数
		var Level = 1;        //レベル（ステージ）
		var Score = 0;        //スコア
		var BonusCnt = 1;     //ボーナス倍率
		//var flgSound = true;  //音楽再生フラグ

		//game.bgm = Sound.load("images/memo4-2.mp3");

		///////////////////////////////////////////////// ルートシーン：タイトル
		var sprTitleBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprTitleBg.image = game.assets["images/title.png"];
		sprTitleBg.ontouchend = function() {  //画面タッチでシーン遷移
			game.assets['images/memo4-2.mp3'].play();
			//game.bgm.play;
			game.replaceScene(senLevel);
			LevelFCnt = 0;
		};
		game.rootScene.addChild(sprTitleBg);

		var labStart = new Label();  //タッチ促進表示
		labStart.font = "20px Meiryo";
		labStart.color = 'rgba(255,255,255,1)';  //色、RGB + 透明度
		labStart.width = SCREEN_WIDTH;           //幅、右端で折り返す
		labStart.x = 110;
		labStart.y = 350;
		labStart.text = "TOUCH TO START";
		game.rootScene.addChild(labStart);

		///////////////////////////////////////////////// シーン：レベル表示
		var senLevel = new Scene();
		var sprLevelBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprLevelBg.image = game.assets["images/field.png"];
		sprLevelBg.onenterframe = function() {  // 1秒経過でシーン遷移
			//if(flgSound == true) {
			//	game.assets['images/memo4-2.mp3'].play();
			//	flgSound = false;
			//};
			//game.bgm.play;
			LevelFCnt += 1;
			if(LevelFCnt > 24) {
				PreMain(Level);
				//game.assets['images/memo4-2.mp3'].play();
				game.replaceScene(senMain);
				MainFCnt = 0;
			};
		};
		senLevel.addChild(sprLevelBg);

		var labLevel = new Label();  //レベル表示
		labLevel.font = "60px Meiryo";
		labLevel.color = 'rgba(255,255,255,1)';
		labLevel.width = SCREEN_WIDTH;
		labLevel.x = 80;
		labLevel.y = 200;
		labLevel.text = "LEVEL 1";
		senLevel.addChild(labLevel);

		var PreLevel = function() {  //シーン：レベル表示への遷移前処理
			if(Level < 5) Level += 1;
			labLevel.text = "LEVEL " + Level;
			if(Level == 5) {
				labLevel.x = 40;
				labLevel.text = "LEVEL MAX"
			};
		};

		///////////////////////////////////////////////// シーン：ゲーム画面
		var senMain = new Scene();
		var LastSec = 5.00;
		var sprMainBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprMainBg.image = game.assets["images/field.png"];
		sprMainBg.onenterframe = function() {
			MainFCnt += 1;
			LastSec = ((120 - MainFCnt) / game.fps).toFixed(2);  //残り秒数算出
			if (LastSec < 0) {
				PreGameOver(6);
				RemoveCell();
				game.replaceScene(senGameOver);
			};
		};
		senMain.addChild(sprMainBg);

		var labLastSec = new Label();  //残り秒数表示
		labLastSec.font = "20px Meiryo";
		labLastSec.color = 'rgba(255,255,255,1)';
		labLastSec.width = SCREEN_WIDTH;
		labLastSec.x = 140;
		labLastSec.y = 470;
		labLastSec.onenterframe = function() {
			labLastSec.text = "残り " + LastSec + " 秒";
			if(LastSec < 0) labLastSec.text = "残り 0.00 秒";
		};
		senMain.addChild(labLastSec);

		var clsCell = Class.create(Sprite, {  //犬小屋のクラス宣言
			initialize: function(x, y, Scale, Type) {
				Sprite.call(this, 96, 75);
				this.x = x;
				this.y = y;
				this.scale(Scale, Scale);
				this.image = game.assets["images/inugoya.png"];
				if(Type == 0) {
					this.ontouchend = function() {
						PreClear();
						RemoveCell();
						game.replaceScene(senClear);
						ClearFCnt = 0;
					};
				} else {
					this.ontouchend = function() {
						PreGameOver(Type);
						RemoveCell();
						game.replaceScene(senGameOver);
				   };
				};
				senMain.addChild(this);
			}
		});

		var clsCry = Class.create(Sprite, {  //犬小屋の中身のクラス宣言
			initialize: function(x, y, Scale, Type) {
				Sprite.call(this, 110, 88);
				this.x = x;
				this.y = y;
				this.scale(Scale, Scale);
				if(Type == 0) this.image = game.assets["images/kyan.png"];
				if(Type == 1) this.image = game.assets["images/nyan.png"];
				if(Type == 2) this.image = game.assets["images/kyun.png"];
				if(Type == 3) this.image = game.assets["images/syan.png"];
				if(Type == 4) this.image = game.assets["images/jhon.png"];
				if(Type == 5) this.image = game.assets["images/gyoza.png"];
				this.opacity = 0;
				var CryTime = Math.round(Math.random() * 95);      // CryTime = 0~95
				this.onenterframe = function() {
					var CryCtrl = this.age % 120;                  // CryCtrl = 0~119
					if(CryCtrl == CryTime) this.opacity = 1;       //鳴き声の表示
					if(CryCtrl == CryTime + 24) this.opacity = 0;  // 1秒（24フレーム）経過後非表示
				};
				if(Type == 0) {
					this.ontouchend = function() {
						PreClear();
						RemoveCell();
						game.replaceScene(senClear);
						ClearFCnt = 0;
					};
				} else {
					this.ontouchend = function() {
						PreGameOver(Type);
						RemoveCell();
						game.replaceScene(senGameOver);
				   };
				};
				senMain.addChild(this);
			}
		});

		var i;
		var j;
		var CellNum;
		var CellScale;
		var Cellx;
		var Celly;
		var CryType;
		var CryPosi;
		var Kyan;
		var sprCell;
		var sprCry;
		var PreMain = function(Level) {  //シーン：ゲーム画面への遷移前処理
			Cellx = new Array();
			Celly = new Array();
			switch(Level) {
				case 1:
					CellNum = 2;         //犬小屋の設置数
					CellScale = 1;       //犬小屋の表示倍率
					CryPosi = 40;        //吹き出しのＹ座標調整値
					Cellx = [69, 235];   //犬小屋のＸ座標
					Celly = [228, 228];  //犬小屋のＹ座標
					break;
				case 2:
					CellNum = 4;
					CellScale = 1;
					CryPosi = 40;
					Cellx = [69, 235, 69, 235];
					Celly = [150, 150, 305, 305];
					break;
				case 3:
					CellNum = 9;
					CellScale = 1;
					CryPosi = 40;
					Cellx = [28, 152, 276, 28, 152, 276, 28, 152, 276];
					Celly = [112, 112, 112, 228, 228, 228, 344, 344, 344];
					break;
				case 4:
					CellNum = 16;
					CellScale = 0.8;
					CryPosi = 32;
					Cellx = [9, 107, 205, 303, 9, 107, 205, 303, 9, 107, 205, 303, 9, 107, 205, 303];
					Celly = [72, 72, 72, 72, 169, 169, 169, 169, 266, 266, 266, 266, 363, 363, 363, 363];
					break;
				case 5:
					CellNum = 25;
					CellScale = 0.7;
					CryPosi = 28;
					Cellx = [-5, 73, 151, 229, 307, -5, 73, 151, 229, 307, -5, 73, 151, 229, 307, -5, 73, 151, 229, 307, -5, 73, 151, 229, 307];
					Celly = [50, 50, 50, 50, 50, 134, 134, 134, 134, 134, 218, 218, 218, 218, 218, 302, 302, 302, 302, 302, 386, 386, 386, 386, 386];
					break;
			};

			CryType = new Array();                    //犬小屋の中身をランダムに設定
			for(i = 0; i < CellNum; i++) {            // i = 0~(犬小屋数 -1)
				j = Math.round(Math.random() * 500);  // j = 0~500
				CryType[i] = (j % 5) + 1;             // CryType = 1~5、0 はキャン用
			};
			Kyan = Math.round(Math.random() * (CellNum - 1));  // Kyan = 0~(犬小屋数 -1)
			CryType[Kyan] = 0;                                 //該当の犬小屋をキャンに変更

			sprCell = new Array();
			sprCry = new Array();
			for(i = 0; i < CellNum; i++) {  //犬小屋・鳴き声の実体作成
				sprCell[i] = new clsCell(Cellx[i], Celly[i], CellScale, CryType[i]);
				sprCry[i] = new clsCry(Cellx[i], Celly[i] - CryPosi, CellScale, CryType[i]);
			};

		};

		var RemoveCell = function() {  //画面の犬小屋を削除
			for(i = 0; i < CellNum; i++) {
				sprCell[i].parentNode.removeChild(sprCell[i]);
				sprCry[i].parentNode.removeChild(sprCry[i]);
			};
		};

		///////////////////////////////////////////////// シーン：クリア
		var senClear = new Scene();
		var sprClearBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprClearBg.image = game.assets["images/field.png"];
		sprClearBg.onenterframe = function() {  // 2秒経過でシーン遷移
			labClearSec.text = "残り時間     " + ClearSec + " 秒";
			labGetScore.text = "獲得スコア  " + GetScore;
			labScore.text = "合計スコア  " + Score;
			ClearFCnt += 1;
			if(ClearFCnt > 48) {
				PreLevel();
				game.replaceScene(senLevel);
				LevelFCnt = 0;
			};
		};
		senClear.addChild(sprClearBg);

		var sprSeikai = new Sprite(244, 86);  //「正解」画像
		sprSeikai.image = game.assets["images/seikai.png"];
		sprSeikai.x = 80;
		sprSeikai.y = 50;
		senClear.addChild(sprSeikai);

		var sprKyan = new Sprite(202, 224);  //子犬画像
		sprKyan.image = game.assets["images/animal0.png"];
		sprKyan.x = 100;
		sprKyan.y = 139;
		senClear.addChild(sprKyan);

		var labBonus = new Label();  //ボーナス表示
		labBonus.font = "20px Meiryo";
		labBonus.color = 'rgba(255,255,255,1)';
		labBonus.width = SCREEN_WIDTH;
		labBonus.x = 50;
		labBonus.y = 370;
		labBonus.opacity = 0;
		senClear.addChild(labBonus);

		var labClearSec = new Label();  //正解時残り時間
		labClearSec.font = "20px Meiryo";
		labClearSec.color = 'rgba(255,255,255,1)';
		labClearSec.width = SCREEN_WIDTH;
		labClearSec.x = 100;
		labClearSec.y = 400;
		senClear.addChild(labClearSec);

		var labGetScore = new Label();  //獲得スコア
		labGetScore.font = "20px Meiryo";
		labGetScore.color = 'rgba(255,255,255,1)';
		labGetScore.width = SCREEN_WIDTH;
		labGetScore.x = 100;
		labGetScore.y = 430;
		senClear.addChild(labGetScore);

		var labScore = new Label();  //合計スコア
		labScore.font = "20px Meiryo";
		labScore.color = 'rgba(255,255,255,1)';
		labScore.width = SCREEN_WIDTH;
		labScore.x = 100;
		labScore.y = 460;
		senClear.addChild(labScore);

		var ClearSec;
		var GetScore;
		var PreClear = function() {  //シーン：クリアへの遷移前処理
			ClearSec = LastSec;
			GetScore = CellNum * 2 * (120 - MainFCnt) * Level * BonusCnt;
			Score = Score + GetScore;
			if(BonusCnt > 1) {
				labBonus.text = "LEVEL MAX CLEAR BONUS x" + BonusCnt + " !!";
				labBonus.opacity = 1;
			};
			if(Level == 5) BonusCnt += 1;
		};

		///////////////////////////////////////////////// シーン：ゲームオーバー
		var senGameOver = new Scene();
		var sprGameOverBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprGameOverBg.image = game.assets["images/field.png"];
		senGameOver.addChild(sprGameOverBg);

		var sprZannen = new Sprite(247, 86);  //「残念」画像
		sprZannen.image = game.assets["images/zannen.png"];
		sprZannen.x = 80;
		sprZannen.y = 50;
		senGameOver.addChild(sprZannen);

		var sprNyan = new Sprite(200, 198);  //ねこ画像
		sprNyan.image = game.assets["images/animal1.png"];
		sprNyan.x = 101;
		sprNyan.y = 167;
		sprNyan.opacity = 0;
		senGameOver.addChild(sprNyan);

		var sprKyun = new Sprite(197, 220);  //おとめ画像
		sprKyun.image = game.assets["images/animal2.png"];
		sprKyun.x = 103;
		sprKyun.y = 156;
		sprKyun.opacity = 0;
		senGameOver.addChild(sprKyun);

		var sprSyan = new Sprite(203, 220);  //シンバル画像
		sprSyan.image = game.assets["images/animal3.png"];
		sprSyan.x = 100;
		sprSyan.y = 151;
		sprSyan.opacity = 0;
		senGameOver.addChild(sprSyan);

		var sprJhon = new Sprite(152, 252);  //ジョン画像
		sprJhon.image = game.assets["images/animal4.png"];
		sprJhon.x = 125;
		sprJhon.y = 135;
		sprJhon.opacity = 0;
		senGameOver.addChild(sprJhon);

		var sprGyoza = new Sprite(200, 190);  //ギョーザ画像
		sprGyoza.image = game.assets["images/animal5.png"];
		sprGyoza.x = 101;
		sprGyoza.y = 166;
		sprGyoza.opacity = 0;
		senGameOver.addChild(sprGyoza);

		var sprTokei = new Sprite(188, 200);  //時計画像
		sprTokei.image = game.assets["images/tokei.png"];
		sprTokei.x = 107;
		sprTokei.y = 161;
		sprTokei.opacity = 0;
		senGameOver.addChild(sprTokei);

		var labCome = new Label();  //小屋の中身コメント
		labCome.font = "30px Meiryo";
		labCome.color = 'rgba(255,255,255,1)';
		labCome.width = SCREEN_WIDTH;
		labCome.x = 90;
		labCome.y = 390;
		senGameOver.addChild(labCome);

		var labBonus2 = new Label();  //レベル５クリア回数表示
		labBonus2.font = "16px Meiryo";
		labBonus2.color = 'rgba(255,255,255,1)';
		labBonus2.width = SCREEN_WIDTH;
		labBonus2.x = 160;
		labBonus2.y = 440;
		labBonus2.opacity = 0;
		senGameOver.addChild(labBonus2);

		var labScore2 = new Label();  //スコア表示
		labScore2.font = "20px Meiryo";
		labScore2.color = 'rgba(255,255,255,1)';
		labScore2.width = SCREEN_WIDTH;
		labScore2.x = 160;
		labScore2.y = 460;
		senGameOver.addChild(labScore2);

		var sprRetry = new Sprite(107, 46);  //リトライボタン
		sprRetry.image = game.assets["images/retry.png"];
		sprRetry.x = 20;
		sprRetry.y = 440;
		sprRetry.ontouchend = function() {  //リトライ処理
			labBonus.opacity = 0;
			labBonus2.opacity = 0;
			sprNyan.opacity = 0;
			sprKyun.opacity = 0;
			sprSyan.opacity = 0;
			sprJhon.opacity = 0;
			sprGyoza.opacity = 0;
			sprTokei.opacity = 0;
			Score = 0;
			Level = 1;
			BonusCnt = 1;
			labLevel.x = 80;
			labLevel.text = "LEVEL 1";
			game.replaceScene(senLevel);
			LevelFCnt = 0;
		};
		senGameOver.addChild(sprRetry);

		var PreGameOver = function(Type) {  //シーン：ゲームオーバーへの遷移前処理
			game.assets['images/memo4-2.mp3'].stop();
			switch(Type) {
				case 1:
					sprNyan.opacity = 1;
					labCome.text = "ねこ     でした。";
					break;
				case 2:
					sprKyun.opacity = 1;
					labCome.text = "おとめ   でした。";
					break;
				case 3:
					sprSyan.opacity = 1;
					labCome.text = "シンバル でした。";
					break;
				case 4:
					sprJhon.opacity = 1;
					labCome.text = "ジョン   でした。";
					break;
				case 5:
					sprGyoza.opacity = 1;
					labCome.text = "ギョーザ でした。";
					break;
				case 6:
					sprTokei.opacity = 1;
					labCome.text = "時間切れ でした。";
					break;
			};
			if(BonusCnt > 1) {
				labBonus2.text = "LEVEL MAX " + (BonusCnt - 1) + "回クリア！";
				labBonus2.opacity = 1;
			};
			labScore2.text = "スコア  " + Score;
		};

	};
	game.start();
};
