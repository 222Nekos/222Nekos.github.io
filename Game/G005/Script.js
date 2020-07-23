enchant();

var SCREEN_WIDTH  = 400;  // 画面の幅
var SCREEN_HEIGHT = 500;  // 画面の高さ

window.onload = function() {

	var game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = 24;

	///////////////////////////////////////////////// 読み込み
	game.preload('images/title.png');
	game.preload('images/field.png');
	game.preload('images/mimizuku.png');
	game.preload('images/hukubtn.png');
	game.preload('images/hukuhito.png');
	game.preload('images/kaze.png');
	game.preload('images/mess.png');
	game.preload('images/retrybtn.png');
	game.preload('images/scale.png');

	game.onload = function() {

		///////////////////////////////////////////////// グローバル変数
		var State = 0;        // ゲームの状態
		var LevelFCnt = 0;    // シーン：レベル表示の経過フレーム数
		var MainFCnt = 0;     // シーン：ゲーム画面の経過フレーム数
		var ClearFCnt = 0;    // シーン：クリア画面の経過フレーム数
		var Level = 1;        // レベル（ステージ）
		var Score = 0;        // スコア
		var BonusCnt = 1;     // ボーナス倍率
		var LastSec = 10.00;  // ゲーム画面残り秒数
		var GoodCnt = 0;      // 「たまらん」数
		var Bad1Cnt = 0;      // 弱すぎの数
		var Bad2Cnt = 0;      // 強すぎの数

		///////////////////////////////////////////////// メインループ
		game.onenterframe = function() {
			if(State == 1) {  // シーン：レベル表示
				LevelFCnt += 1;
				if(LevelFCnt > 24) {  // 1秒経過でシーン遷移
					PreMain(Level);
					game.replaceScene(senMain);
					State = 2;
					MainFCnt = 0;
				};
			};
			if(State == 2) {  // シーン：ゲーム画面＆吹くボタン押下前
				MainFCnt += 1;
				LastSec = ((240 - MainFCnt) / game.fps).toFixed(2);  // 残り秒数算出
				labLastSec.text = '残り ' + LastSec + ' 秒';
				if (LastSec < 0) {
					labLastSec.text = '残り 0.00 秒';
					PreGameOver(3);
					RemoveObj();
					game.replaceScene(senGameOver);
					State = 5;
				};
				for(i = 0; i < MimiNum; i++) {  // i = 0~(みみずく数 -1)
					Pow[i] = Pow[i] - MtrSpd[i];
					if(Pow[i] <= -201) Pow[i] = 0;
					surface[i].clear();
					surface[i].context.fillRect (PowMtrX[i], 220, 10, Pow[i]);
				};
			};
			if(State == 3) {  // シーン：ゲーム画面＆吹くボタン押下後
				MainFCnt += 1;
				for(i = 0; i < MimiNum; i++) {  // i = 0~(みみずく数 -1)
					sprKaze[i].x -= 2;
				};
				if (MainFCnt > 24) {            // 1秒経過で吹く人と風消す
					for(i = 0; i < MimiNum; i++) {  // i = 0~(みみずく数 -1)
						senMain.removeChild(sprHukuhito[i]);
						senMain.removeChild(sprKaze[i]);
					};
				};
				if (MainFCnt > 48) {            // 2秒経過でシーン遷移
					if(GoodCnt >= ClearLine) {  // クリア条件を満たしていたら
						PreClear();
						RemoveObj();
						game.replaceScene(senClear);
						State = 4;
						ClearFCnt = 0;
					} else {                    // クリア条件を満たしていなかったら
						if(Bad1Cnt > Bad2Cnt) {
							PreGameOver(1);
						} else {
							PreGameOver(2);
						};
						RemoveObj();
						game.replaceScene(senGameOver);
						State = 5;
					};
				};
			};
			if(State == 4) {  // シーン：クリア
				ClearFCnt += 1;
				if(ClearFCnt > 48) {  // 2秒経過でシーン遷移
					GoodCnt = 0;
					Bad1Cnt = 0;
					Bad2Cnt = 0;
					PreLevel();
					game.replaceScene(senLevel);
					State = 1;
					LevelFCnt = 0;
				};
			};
		};

		///////////////////////////////////////////////// ルートシーン：タイトル
		var sprTitleBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprTitleBg.image = game.assets['images/title.png'];
		sprTitleBg.ontouchend = function() {  // 画面タッチでシーン遷移
			game.replaceScene(senLevel);
			State = 1;
			LevelFCnt = 0;
		};
		game.rootScene.addChild(sprTitleBg);

		///////////////////////////////////////////////// シーン：レベル表示
		var senLevel = new Scene();
		var sprLevelBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprLevelBg.image = game.assets['images/field.png'];
		senLevel.addChild(sprLevelBg);

		var labLevel = new Label();  // レベル表示
		labLevel.font = '60px Meiryo';
		labLevel.color = 'rgba(255,255,255,1)';
		labLevel.width = SCREEN_WIDTH;
		labLevel.x = 80;
		labLevel.y = 200;
		labLevel.text = 'LEVEL 1';
		senLevel.addChild(labLevel);

		var labClearLine = new Label();  // クリアライン表示
		labClearLine.font = '20px Meiryo';
		labClearLine.color = 'rgba(255,255,255,1)';
		labClearLine.width = SCREEN_WIDTH;
		labClearLine.x = 60;
		labClearLine.y = 270;
		labClearLine.text = '1 匹 ぞくぞくさせればクリア！';
		senLevel.addChild(labClearLine);

		var PreLevel = function() {  // シーン：レベル表示への遷移前処理
			if(Level < 5) Level += 1;
			labLevel.text = 'LEVEL ' + Level;
			if(Level == 5) {
				labLevel.x = 30;
				labLevel.text = 'LEVEL MAX';
			};
			if(Level == 1) labClearLine.text = '1 匹 ぞくぞくさせればクリア！';
			if(Level == 2) labClearLine.text = '1 匹 ぞくぞくさせればクリア！';
			if(Level == 3) labClearLine.text = '2 匹 ぞくぞくさせればクリア！';
			if(Level == 4) labClearLine.text = '3 匹 ぞくぞくさせればクリア！';
			if(Level == 5) labClearLine.text = '5 匹 ぞくぞくさせればクリア！';
		};

		///////////////////////////////////////////////// シーン：ゲーム画面
		var senMain = new Scene();
		var sprMainBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprMainBg.image = game.assets['images/field.png'];
		senMain.addChild(sprMainBg);

		var labLastSec = new Label();  // 残り秒数表示
		labLastSec.font = '20px Meiryo';
		labLastSec.color = 'rgba(255,255,255,1)';
		labLastSec.width = SCREEN_WIDTH;
		labLastSec.x = 70;
		labLastSec.y = 460;
		senMain.addChild(labLastSec);

		var clsMimi = Class.create(Sprite, {  // みみずくのクラス宣言
			initialize: function(x, y, Scale) {
				Sprite.call(this, 207, 207);
				this.x = x;
				this.y = y;
				this.scale(Scale, Scale);
				this.image = game.assets['images/mimizuku.png'];
				this.frame = 0;
				senMain.addChild(this);
			}
		});

		var clsHukuhito = Class.create(Sprite, {  // 吹く人のクラス宣言
			initialize: function(x, y, Scale) {
				Sprite.call(this, 120, 90);
				this.x = x;
				this.y = y;
				this.scale(Scale, Scale);
				this.image = game.assets['images/hukuhito.png'];
				this.opacity = 0;
				senMain.addChild(this);
			}
		});

		var clsKaze = Class.create(Sprite, {  // 風のクラス宣言
			initialize: function(x, y, Scale) {
				Sprite.call(this, 96, 44);
				this.x = x;
				this.y = y;
				this.scale(Scale, Scale);
				this.image = game.assets['images/kaze.png'];
				this.opacity = 0;
				senMain.addChild(this);
			}
		});

		var i;
		var j;
		var ClearLine;
		var MimiNum;
		var MimiScale;
		var MimiX;
		var MimiY;
		var PowMtrX;
		var sprPowMtr;
		var surface;
		var Pow;
		var MtrSpd;
		var AjsPosi;
		var sprMimi;
		var sprHukuhito;
		var sprKaze;
		var PreMain = function(Level) {  // シーン：ゲーム画面への遷移前処理
			MimiX = new Array();
			MimiY = new Array();
			PowMtrX = new Array();
			switch(Level) {
				case 1:
					ClearLine = 1;    // クリアに必要な「たまらん」数
					MimiNum = 1;      // みみずくの設置数
					MimiScale = 1;    // みみずくの表示倍率
					AjsPosi = 0;      // 吹き出しのＹ座標調整値
					MimiX   = [ 50];  // みみずくのＸ座標
					MimiY   = [170];  // みみずくのＹ座標
					PowMtrX = [295];  // パワーメーターのＸ座標
					break;
				case 2:
					ClearLine = 1;
					MimiNum = 2;
					MimiScale = 1;
					AjsPosi = 0;
					MimiX   = [ 10, 150];
					MimiY   = [170, 170];
					PowMtrX = [325, 340];
					break;
				case 3:
					ClearLine = 2;
					MimiNum = 4;
					MimiScale = 0.8;
					AjsPosi = 40;
					MimiX   = [  0,   0, 120, 240];
					MimiY   = [ 80, 200, 200, 200];
					PowMtrX = [280, 295, 310, 325];
					break;
				case 4:
					ClearLine = 3;
					MimiNum = 6;
					MimiScale = 0.8;
					AjsPosi = 40;
					MimiX   = [-10,  80, -10,  80, 170, 260];
					MimiY   = [ 80,  80, 200, 200, 200, 200];
					PowMtrX = [265, 280, 295, 310, 325, 340];
					break;
				case 5:
					ClearLine = 5;
					MimiNum = 10;
					MimiScale = 0.6;
					AjsPosi = 80;
					MimiX   = [-50,   0,  50, 100, -50,   0,  50, 100, 150, 200];
					MimiY   = [ 80,  80,  80,  80, 200, 200, 200, 200, 200, 200];
					PowMtrX = [235, 250, 265, 280, 295, 310, 325, 340, 355, 370];
					break;
			};

			sprMimi = new Array();
			sprHukuhito = new Array();
			sprKaze = new Array();
			for(i = 0; i < MimiNum; i++) {  // みみずく・吹く人・風のインスタンス作成
				sprMimi[i] = new clsMimi(MimiX[i], MimiY[i], MimiScale);
				sprHukuhito[i] = new clsHukuhito(MimiX[i] + 200 - AjsPosi, MimiY[i] - 45 + AjsPosi, MimiScale);
				sprKaze[i] = new clsKaze(MimiX[i] + 130 - AjsPosi, MimiY[i] + AjsPosi, MimiScale);
			};

			sprPowMtr = new Array();  // パワーメーター
			surface = new Array();    // Surfaceオブジェクト　※これを sprPowMtr に連結する
			Pow = new Array();        // メーター初期値
			MtrSpd = new Array();     // メータースピード
			for(i = 0; i < MimiNum; i++) {             // i = 0~(みみずく数 -1)
				sprPowMtr[i] = new Sprite(400, 300);
				surface[i] = new Surface(400, 300);
				sprPowMtr[i].image = surface[i];       // Surfaceオブジェクトを sprPowMtr に連結
				senMain.addChild(sprPowMtr[i]);
				surface[i].context.fillStyle = "red";  // 赤い四角形を描く ※色のみ設定しておく
				j = Math.round(Math.random() * 1000);  // j = 0~1000 ※生成数が小さいと偏る気がするので
				Pow[i] = (j % 201) - 200;              // Pow = -200~0、中央値は -100
				MtrSpd[i] = (j % 7) + 2;               // MtrSpd = 2~8、性質的に 0 と 1 は無し
			};

		};

		var sprScale = new Sprite(145, 201);  // スケール
		sprScale.image = game.assets['images/scale.png'];
		sprScale.x = 235;
		sprScale.y = 20;
		senMain.addChild(sprScale);

		var sprHukuBtn = new Sprite(153, 97);  //吹くボタン
		sprHukuBtn.image = game.assets['images/hukubtn.png'];
		sprHukuBtn.x = 230;
		sprHukuBtn.y = 390;
		sprHukuBtn.ontouchend = function() {  //吹きかけ処理
			if(State == 2) {
					State = 3;     //状態変更し、処理重複防止
					MainFCnt = 0;  //フレームカウントリセット
					for(i = 0; i < MimiNum; i++) {
						sprHukuhito[i].opacity = 1;
						sprKaze[i].opacity = 1;
						if(Pow[i] < -130) {                    // 強すぎる
							Bad2Cnt += 1;
							sprMimi[i].frame = 3;
						};
						if(Pow[i] >= -130 && Pow[i] <= -70) {  // ちょうどいい
							GoodCnt += 1;
							surface[i].context.fillStyle = "yellow";
							surface[i].context.fillRect (PowMtrX[i], 220, 10, Pow[i]);
							sprMimi[i].frame = 1;
						};
						if(Pow[i] > -70) {                     // 弱すぎる
							Bad1Cnt += 1;
							sprMimi[i].frame = 2;
						};
					};
			};
		};
		senMain.addChild(sprHukuBtn);

		var RemoveObj = function() {  // 画面遷移前にオブジェクト削除
			for(i = 0; i < MimiNum; i++) {
				senMain.removeChild(sprPowMtr[i]);
				senMain.removeChild(surface[i]);
				senMain.removeChild(sprMimi[i]);
			};
		};

		///////////////////////////////////////////////// シーン：クリア
		var senClear = new Scene();
		var sprClearBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprClearBg.image = game.assets['images/field.png'];
		senClear.addChild(sprClearBg);

		var sprMimi2 = new Sprite(207, 207);  // みみずく画像
		sprMimi2.image = game.assets['images/mimizuku.png'];
		sprMimi2.frame = 1;
		sprMimi2.x = 100;
		sprMimi2.y = 150;
		senClear.addChild(sprMimi2);

		var sprMess = new Sprite(300, 150);  //「たまらん」画像
		sprMess.image = game.assets['images/mess.png'];
		sprMess.frame = 0;
		sprMess.x = 50;
		sprMess.y = 10;
		senClear.addChild(sprMess);

		var labBonus = new Label();  // ボーナス表示
		labBonus.font = '20px Meiryo';
		labBonus.color = 'rgba(255,255,255,1)';
		labBonus.width = SCREEN_WIDTH;
		labBonus.x = 50;
		labBonus.y = 370;
		labBonus.opacity = 0;
		senClear.addChild(labBonus);

		var labClearSec = new Label();  // 正解時残り時間
		labClearSec.font = '20px Meiryo';
		labClearSec.color = 'rgba(255,255,255,1)';
		labClearSec.width = SCREEN_WIDTH;
		labClearSec.x = 100;
		labClearSec.y = 400;
		senClear.addChild(labClearSec);

		var labGetScore = new Label();  // 獲得スコア
		labGetScore.font = '20px Meiryo';
		labGetScore.color = 'rgba(255,255,255,1)';
		labGetScore.width = SCREEN_WIDTH;
		labGetScore.x = 100;
		labGetScore.y = 430;
		senClear.addChild(labGetScore);

		var labScore = new Label();  // 合計スコア
		labScore.font = '20px Meiryo';
		labScore.color = 'rgba(255,255,255,1)';
		labScore.width = SCREEN_WIDTH;
		labScore.x = 100;
		labScore.y = 460;
		senClear.addChild(labScore);

		var ClearSec;
		var GetScore;
		var PreClear = function() {  // シーン：クリアへの遷移前処理
			ClearSec = LastSec;
			GetScore = GoodCnt * 2 * (240 - MainFCnt) * Level * BonusCnt;
			Score = Score + GetScore;
			if(BonusCnt > 1) {
				labBonus.text = 'LEVEL MAX CLEAR BONUS x' + BonusCnt + ' !!';
				labBonus.opacity = 1;
			};
			if(Level == 5) BonusCnt += 1;
			labClearSec.text = '残り時間     ' + ClearSec + ' 秒';
			labGetScore.text = '獲得スコア  ' + GetScore + ' ぞく';
			labScore.text = '合計スコア  ' + Score + ' ぞく';
		};

		///////////////////////////////////////////////// シーン：ゲームオーバー
		var senGameOver = new Scene();
		var sprGameOverBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprGameOverBg.image = game.assets['images/field.png'];
		senGameOver.addChild(sprGameOverBg);

		var sprMimi3 = new Sprite(207, 207);  // みみずく画像
		sprMimi3.image = game.assets['images/mimizuku.png'];
		sprMimi3.x = 100;
		sprMimi3.y = 120;
		senGameOver.addChild(sprMimi3);

		var sprMess2 = new Sprite(300, 150);  // 「激しすぎる」画像
		sprMess2.image = game.assets['images/mess.png'];
		sprMess2.x = 50;
		sprMess2.y = 10;
		senGameOver.addChild(sprMess2);

		var labCome = new Label();  // コメント
		labCome.font = '20px Meiryo';
		labCome.color = 'rgba(255,255,255,1)';
		labCome.width = SCREEN_WIDTH;
		labCome.x = 20;
		labCome.y = 350;
		senGameOver.addChild(labCome);

		var labBonus2 = new Label();  // レベル５クリア回数表示
		labBonus2.font = '16px Meiryo';
		labBonus2.color = 'rgba(255,255,255,1)';
		labBonus2.width = SCREEN_WIDTH;
		labBonus2.x = 180;
		labBonus2.y = 440;
		labBonus2.opacity = 0;
		senGameOver.addChild(labBonus2);

		var labScore2 = new Label();  // スコア表示
		labScore2.font = '20px Meiryo';
		labScore2.color = 'rgba(255,255,255,1)';
		labScore2.width = SCREEN_WIDTH;
		labScore2.x = 180;
		labScore2.y = 460;
		senGameOver.addChild(labScore2);

		var sprRetryBtn = new Sprite(154, 98);  // リトライボタン
		sprRetryBtn.image = game.assets['images/retrybtn.png'];
		sprRetryBtn.x = 15;
		sprRetryBtn.y = 390;
		sprRetryBtn.ontouchend = function() {  // リトライ処理
			GoodCnt = 0;
			Bad1Cnt = 0;
			Bad2Cnt = 0;
			Score = 0;
			Level = 1;
			BonusCnt = 1;
			labLevel.x = 80;
			labLevel.text = 'LEVEL 1';
			labClearLine.text = '1 匹 ぞくぞくさせればクリア！';
			game.replaceScene(senLevel);
			State = 1;
			LevelFCnt = 0;
		};
		senGameOver.addChild(sprRetryBtn);

		var PreGameOver = function(Type) {  // シーン：ゲームオーバーへの遷移前処理
			switch(Type) {
				case 1:
					sprMimi3.frame = 2;
					sprMess2.frame = 1;
					labCome.text = Bad1Cnt + ' 匹 弱すぎ、' + Bad2Cnt + ' 匹 激しすぎでした。';
					break;
				case 2:
					sprMimi3.frame = 3;
					sprMess2.frame = 2;
					labCome.text = Bad1Cnt + ' 匹 弱すぎ、' + Bad2Cnt + ' 匹 激しすぎでした。';
					break;
				case 3:
					sprMimi3.frame = 0;
					sprMess2.frame = 3;
					labCome.text = '          時間切れ でした。';
					break;
			};
			if(BonusCnt > 1) {
				labBonus2.text = 'LEVEL MAX ' + (BonusCnt - 1) + '回クリア！';
				labBonus2.opacity = 1;
			};
			labScore2.text = 'スコア  ' + Score + ' ぞく';
		};

	};
	game.start();
};