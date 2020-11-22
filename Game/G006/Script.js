enchant();

enchant.Sound.enabledInMobileSafari = true;

if(location.protocol == 'file:'){
    enchant.ENV.USE_WEBAUDIO = false;
    console.log('1');
}

var SCREEN_WIDTH  = 400;  // 画面の幅
var SCREEN_HEIGHT = 500;  // 画面の高さ

window.onload = function() {

	var game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT);
	game.fps = 24;

	///////////////////////////////////////////////// 読み込み
	game.preload('images/Bg/0.jpg');
	game.preload('images/Bg/1a.jpg');
	game.preload('images/Bg/1b.jpg');
	game.preload('images/Bg/2.jpg');
	game.preload('images/Bg/3.jpg');
	game.preload('images/Bg/4.jpg');
	game.preload('images/Bg/5.jpg');
	game.preload('images/Bg/6.jpg');
	game.preload('images/Bg/7.jpg');
	game.preload('images/Bg/8.jpg');
	game.preload('images/retrybtn.png');
	game.preload('images/twin.png');
	game.preload('images/stopbtn.png');
	game.preload('images/left_stopbtn.png');
	game.preload('images/right_stopbtn.png');
	game.preload('images/msg.png');
	game.preload('images/teruko.png');
	game.preload('images/over.png');
	game.preload('images/aku.png');
	game.preload('images/bgm2-6.mp3');
	game.preload('images/switch1.mp3');
	game.preload("images/question1.mp3");
	game.preload("images/trumpet1.mp3");
	game.preload("images/incorrect1.mp3");

	game.onload = function() {

		///////////////////////////////////////////////// グローバル変数
		var State = 0;         // ゲームの状態
		var FrameCnt = 0;      // フレームカウント
		var LastSec = 10.00;   // 残り時間（秒）
		var Score = 0;         // スコア
		var Percent = 0;       // 変身完成度
		var Twin = 0;          // 装備
		var TwinCtrl = 0;      // 装備制御
		var LeftFlag = 0;      // 左ボタンタッチフラグ
		var RightFlag = 0;     // 右ボタンタッチフラグ
		var SpeedL = 0;        // 左側移動スピード
		var SpeedR = 0;        // 右側移動スピード
		var LupFlag = 0;       // 左側上昇フラグ
		var RupFlag = 0;       // 右側上昇フラグ

		///////////////////////////////////////////////// メインループ
		game.onenterframe = function() {
			if(State == 3) {  // シーン３：装備選択
				FrameCnt += 1;
				LastSec = ((240 - FrameCnt) / 24).toFixed(2);  // 残り秒数算出（fps24 前提）
				labLastSec.text = '残り ' + LastSec + ' 秒';
				TwinCtrl =　FrameCnt % 12  // TwinCtrl = 0~11
				if(TwinCtrl <= 3) {
					Twin = 0;  //ツインテール
				} else if(TwinCtrl <= 7) {
					Twin = 1;  //バナナ
				} else {
					Twin = 2;  //サンマ
				};
				switch(Twin) {
					case 0:
						sprTwinL.frame = 0;
						sprTwinR.frame = 1;
						break;
					case 1:
						sprTwinL.frame = 2;
						sprTwinR.frame = 3;
						break;
					case 2:
						sprTwinL.frame = 4;
						sprTwinR.frame = 5;
						break;
				};
				if(LastSec < 0) {
					labLastSec.text = '残り 0.00 秒';
					Twin = 2;
					PreScene4();
					game.replaceScene(Scene4);
					State = 4;
					FrameCnt = 0;
				};
			};
			if(State == 5) {  // シーン５：位置決定
				FrameCnt += 1;
				LastSec = ((240 - FrameCnt) / 24).toFixed(2);  // 残り秒数算出（fps24 前提）
				labLastSec2.text = '残り ' + LastSec + ' 秒';
				if(LeftFlag == 1) {
					if(RightFlag == 1) {
						game.replaceScene(Scene6);
						game.assets['images/question1.mp3'].clone().play();
						State = 6;
						FrameCnt = 0;
					};
				};
				if(LeftFlag == 0) {
					if(sprTwinL3.y <= 150) {
						if(LupFlag == 1) {
							LupFlag = 0;
						};
					};
					if(sprTwinL3.y >= 250) {
						if(LupFlag == 0) {
							LupFlag = 1;
						};
					};
					if(LupFlag == 1) {
						sprTwinL3.y = sprTwinL3.y - SpeedL
					} else {
						sprTwinL3.y = sprTwinL3.y + SpeedL
					};
				};
				if(RightFlag == 0) {
					if(sprTwinR3.y <= 150) {
						if(RupFlag == 1) {
							RupFlag = 0;
						};
					};
					if(sprTwinR3.y >= 250) {
						if(RupFlag == 0) {
							RupFlag = 1;
						};
					};
					if(RupFlag == 1) {
						sprTwinR3.y = sprTwinR3.y - SpeedR
					} else {
						sprTwinR3.y = sprTwinR3.y + SpeedR
					};
				};
				if(LastSec < 0) {
					labLastSec2.text = '残り 0.00 秒';
					LeftFlag = 1;
					RightFlag = 1;
					game.replaceScene(Scene6);
					game.assets['images/question1.mp3'].clone().play();
					State = 6;
					FrameCnt = 0;
				};
			};
			if(State == 7) {  // シーン７
				FrameCnt += 1;
				if(FrameCnt > 36) {  // 1.5秒経過でシーン遷移
					PreScene8();
					game.replaceScene(Scene8_GameOver);
					State = 8;
				};
			};
		};

		///////////////////////////////////////////////// ルートシーン：タイトル
		var sprTitleBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprTitleBg.image = game.assets['images/Bg/0.jpg'];
		sprTitleBg.ontouchend = function() {  // 画面タッチでシーン遷移
			game.assets['images/bgm2-6.mp3'].play();
			game.replaceScene(Scene1a);
			State = 11;
		};
		game.rootScene.addChild(sprTitleBg);

		///////////////////////////////////////////////// シーン１Ａ
		var Scene1a = new Scene();
		var sprScene1aBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene1aBg.image = game.assets['images/Bg/1a.jpg'];
		sprScene1aBg.ontouchend = function() {  // 画面タッチでシーン遷移
			game.replaceScene(Scene1b);
			State = 12;
		};
		Scene1a.addChild(sprScene1aBg);

		///////////////////////////////////////////////// シーン１Ｂ
		var Scene1b = new Scene();
		var sprScene1bBg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene1bBg.image = game.assets['images/Bg/1b.jpg'];
		sprScene1bBg.ontouchend = function() {  // 画面タッチでシーン遷移
			game.replaceScene(Scene2);
			State = 2;
		};
		Scene1b.addChild(sprScene1bBg);

		///////////////////////////////////////////////// シーン２
		var Scene2 = new Scene();
		var sprScene2Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene2Bg.image = game.assets['images/Bg/2.jpg'];
		sprScene2Bg.ontouchend = function() {  // 画面タッチでシーン遷移
			game.replaceScene(Scene3_Select);
			State = 3;
			FrameCnt = 0;
		};
		Scene2.addChild(sprScene2Bg);

		///////////////////////////////////////////////// シーン３：装備選択
		var Scene3_Select = new Scene();
		var sprScene3Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene3Bg.image = game.assets['images/Bg/3.jpg'];
		Scene3_Select.addChild(sprScene3Bg);

		var labLastSec = new Label();  // 残り秒数表示
		labLastSec.font = '20px Meiryo';
		labLastSec.color = 'rgba(255,255,255,1)';
		labLastSec.width = SCREEN_WIDTH;
		labLastSec.x = 50;
		labLastSec.y = 70;
		Scene3_Select.addChild(labLastSec);

		var sprStopBtn = new Sprite(122, 71);  // ストップボタン
		sprStopBtn.image = game.assets['images/stopbtn.png'];
		sprStopBtn.x = 240;
		sprStopBtn.y = 20;
		sprStopBtn.ontouchend = function() {  // タッチでシーン遷移
			PreScene4();
			game.replaceScene(Scene4);
			State = 4;
			FrameCnt = 0;
		};
		Scene3_Select.addChild(sprStopBtn);

		var sprTwinL = new Sprite(100, 200);  // 装備左
		sprTwinL.image = game.assets['images/twin.png'];
		sprTwinL.frame = 0;
		sprTwinL.x = 100;
		sprTwinL.y = 100;
		Scene3_Select.addChild(sprTwinL);

		var sprTwinR = new Sprite(100, 200);  // 装備右
		sprTwinR.image = game.assets['images/twin.png'];
		sprTwinR.frame = 1;
		sprTwinR.x = 200;
		sprTwinR.y = 100;
		Scene3_Select.addChild(sprTwinR);

		var PreScene4 = function() {  // シーン４への遷移前処理
			switch(Twin) {
				case 0:
					sprTwinL2.frame = 0;
					sprTwinR2.frame = 1;
					break;
				case 1:
					sprTwinL2.frame = 2;
					sprTwinR2.frame = 3;
					break;
				case 2:
					sprTwinL2.frame = 4;
					sprTwinR2.frame = 5;
					break;
			};
		};

		///////////////////////////////////////////////// シーン４
		var Scene4 = new Scene();
		var sprScene4Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene4Bg.image = game.assets['images/Bg/4.jpg'];
		sprScene4Bg.ontouchend = function() {  // 画面タッチでシーン遷移
			PreScene5();
			game.replaceScene(Scene5_Position);
			State = 5;
			FrameCnt = 0;
		};
		Scene4.addChild(sprScene4Bg);

		var sprTwinL2 = new Sprite(100, 200);  // 装備左
		sprTwinL2.image = game.assets['images/twin.png'];
		sprTwinL2.frame = 0;
		sprTwinL2.x = 100;
		sprTwinL2.y = 190;
		Scene4.addChild(sprTwinL2);

		var sprTwinR2 = new Sprite(100, 200);  // 装備右
		sprTwinR2.image = game.assets['images/twin.png'];
		sprTwinR2.frame = 1;
		sprTwinR2.x = 200;
		sprTwinR2.y = 190;
		Scene4.addChild(sprTwinR2);

		var PreScene5 = function() {  // シーン５への遷移前処理
			SpeedL = Math.round(Math.random() * 5) + 2;  // SpeedL = 2~7
			SpeedR = Math.round(Math.random() * 5) + 2;  // SpeedL = 2~7
			sprTwinL3.y = Math.round(Math.random() * 100) + 130;  // sprTwinL3.y = 130~230
			sprTwinR3.y = Math.round(Math.random() * 100) + 130;  // sprTwinR3.y = 130~230
			LupFlag = 1;
			RupFlag = 1;
			switch(Twin) {
				case 0:
					sprTeruko.frame = 0;
					sprTwinL3.frame = 2;
					sprTwinR3.frame = 3;
					break;
				case 1:
					sprTeruko.frame = 4;
					sprTwinL3.frame = 6;
					sprTwinR3.frame = 7;
					SpeedL = SpeedL + 3;
					SpeedR = SpeedR + 3;
					break;
				case 2:
					sprTeruko.frame = 8;
					sprTwinL3.frame = 10;
					sprTwinR3.frame = 11;
					SpeedL = SpeedL + 5;
					SpeedR = SpeedR + 5;
					break;
			};
			sprLeftStopBtn.opacity = 1;
			sprRightStopBtn.opacity = 1;
			LeftFlag = 0;
			RightFlag = 0;
		};

		///////////////////////////////////////////////// シーン５：位置決定
		var Scene5_Position = new Scene();
		var sprScene5Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene5Bg.image = game.assets['images/Bg/5.jpg'];
		Scene5_Position.addChild(sprScene5Bg);

		var labLastSec2 = new Label();  // 残り秒数表示
		labLastSec2.font = '20px Meiryo';
		labLastSec2.color = 'rgba(255,255,255,1)';
		labLastSec2.width = SCREEN_WIDTH;
		labLastSec2.x = 20;
		labLastSec2.y = 450;
		Scene5_Position.addChild(labLastSec2);

		var sprLeftStopBtn = new Sprite(163, 71);  // 左ストップボタン
		sprLeftStopBtn.image = game.assets['images/left_stopbtn.png'];
		sprLeftStopBtn.x = 25;
		sprLeftStopBtn.y = 70;
		sprLeftStopBtn.ontouchend = function() {  // タッチで非表示
			sprLeftStopBtn.opacity = 0;
			if(LeftFlag == 0) {
				game.assets['images/switch1.mp3'].clone().play();
				LeftFlag = 1;
			};
		};
		Scene5_Position.addChild(sprLeftStopBtn);

		var sprRightStopBtn = new Sprite(163, 71);  // 右ストップボタン
		sprRightStopBtn.image = game.assets['images/right_stopbtn.png'];
		sprRightStopBtn.x = 212;
		sprRightStopBtn.y = 70;
		sprRightStopBtn.ontouchend = function() {  // タッチで非表示
			sprRightStopBtn.opacity = 0;
			if(RightFlag == 0) {
				game.assets['images/switch1.mp3'].clone().play();
				RightFlag = 1;
			};
		};
		Scene5_Position.addChild(sprRightStopBtn);

		var sprTeruko = new Sprite(367, 291);  // 照子
		sprTeruko.image = game.assets['images/teruko.png'];
		sprTeruko.frame = 0;
		sprTeruko.x = 17;
		sprTeruko.y = 200;
		Scene5_Position.addChild(sprTeruko);

		var sprTwinL3 = new Sprite(367, 291);  // 装備左
		sprTwinL3.image = game.assets['images/teruko.png'];
		sprTwinL3.frame = 2;
		sprTwinL3.x = 17;
		sprTwinL3.y = 200;
		Scene5_Position.addChild(sprTwinL3);

		var sprTwinR3 = new Sprite(367, 291);  // 装備右
		sprTwinR3.image = game.assets['images/teruko.png'];
		sprTwinR3.frame = 3;
		sprTwinR3.x = 17;
		sprTwinR3.y = 200;
		Scene5_Position.addChild(sprTwinR3);

		///////////////////////////////////////////////// シーン６
		var Scene6 = new Scene();
		var sprScene6Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene6Bg.image = game.assets['images/Bg/6.jpg'];
		sprScene6Bg.ontouchend = function() {  // 画面タッチでシーン遷移
			PreScene7();
			game.replaceScene(Scene7);
			State = 7;
		};
		Scene6.addChild(sprScene6Bg);

		var PreScene7 = function() {  // シーン７への遷移前処理
			switch(Twin) {
				case 0:
					sprMsg.frame = 0;
					sprTeruko2.frame = 1;
					sprTwinL4.frame = 2;
					sprTwinR4.frame = 3;
					break;
				case 1:
					sprMsg.frame = 1;
					sprTeruko2.frame = 5;
					sprTwinL4.frame = 6;
					sprTwinR4.frame = 7;
					break;
				case 2:
					sprMsg.frame = 2;
					sprTeruko2.frame = 9;
					sprTwinL4.frame = 10;
					sprTwinR4.frame = 11;
					break;
			};
			sprTwinL4.y = sprTwinL3.y - 20;
			sprTwinR4.y = sprTwinR3.y - 20;
		};

		///////////////////////////////////////////////// シーン７
		var Scene7 = new Scene();
		var sprScene7Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene7Bg.image = game.assets['images/Bg/7.jpg'];
		Scene7.addChild(sprScene7Bg);

		var sprMsg = new Sprite(331, 57);  // 変身メッセージ
		sprMsg.image = game.assets['images/msg.png'];
		sprMsg.frame = 0;
		sprMsg.x = 35;
		sprMsg.y = 70;
		Scene7.addChild(sprMsg);

		var sprTeruko2 = new Sprite(367, 291);  // 照子
		sprTeruko2.image = game.assets['images/teruko.png'];
		sprTeruko2.frame = 0;
		sprTeruko2.x = 17;
		sprTeruko2.y = 180;
		Scene7.addChild(sprTeruko2);

		var sprTwinL4 = new Sprite(367, 291);  // 装備左
		sprTwinL4.image = game.assets['images/teruko.png'];
		sprTwinL4.frame = 2;
		sprTwinL4.x = 17;
		sprTwinL4.y = 180;
		Scene7.addChild(sprTwinL4);

		var sprTwinR4 = new Sprite(367, 291);  // 装備右
		sprTwinR4.image = game.assets['images/teruko.png'];
		sprTwinR4.frame = 3;
		sprTwinR4.x = 17;
		sprTwinR4.y = 180;
		Scene7.addChild(sprTwinR4);

		var PreScene8 = function() {  // シーン８への遷移前処理
			switch(Twin) {
				case 0:
					sprTeruko3.frame = 1;
					sprTwinL5.frame = 2;
					sprTwinR5.frame = 3;
					break;
				case 1:
					sprTeruko3.frame = 5;
					sprTwinL5.frame = 6;
					sprTwinR5.frame = 7;
					break;
				case 2:
					sprTeruko3.frame = 9;
					sprTwinL5.frame = 10;
					sprTwinR5.frame = 11;
					break;
			};
			sprTwinL5.y = sprTwinL3.y - 50;
			sprTwinR5.y = sprTwinR3.y - 50;
			Percent = 100;
			if(sprTwinL3.y < 200) {
				Percent = Percent - (200 - sprTwinL3.y)
			} else if(sprTwinL3.y > 200) {
				Percent = Percent - (sprTwinL3.y - 200)
			};
			if(sprTwinR3.y < 200) {
				Percent = Percent - (200 - sprTwinR3.y)
			} else if(sprTwinR3.y > 200) {
				Percent = Percent - (sprTwinR3.y - 200)
			};
			Score = Percent * SpeedL * SpeedR * 10;
			labPercent.text = '変身完成度  ' + Percent + ' ％';
			labScore.text = 'スコア  ' + Score + ' 点';
			if(Percent >= 70) {
				sprTeruko3.opacity = 1;
				sprTwinL5.opacity = 1;
				sprTwinR5.opacity = 1;
				sprAku.opacity = 0;
				sprOver.frame = 0;
				game.assets['images/trumpet1.mp3'].clone().play();
			} else {
				sprTeruko3.opacity = 0;
				sprTwinL5.opacity = 0;
				sprTwinR5.opacity = 0;
				sprAku.opacity = 1;
				switch(Twin) {
					case 0:
						sprOver.frame = 1;
						break;
					case 1:
						sprOver.frame = 2;
						break;
					case 2:
						sprOver.frame = 3;
						break;
				};
				game.assets['images/incorrect1.mp3'].clone().play();
			};
		};

		///////////////////////////////////////////////// シーン８：ゲームオーバー
		var Scene8_GameOver = new Scene();
		var sprScene8Bg = new Sprite(SCREEN_WIDTH, SCREEN_HEIGHT);
		sprScene8Bg.image = game.assets['images/Bg/8.jpg'];
		Scene8_GameOver.addChild(sprScene8Bg);

		var sprOver = new Sprite(400, 230);  // ゲームオーバー画面表示
		sprOver.image = game.assets['images/over.png'];
		sprOver.frame = 0;
		sprOver.x = 0;
		sprOver.y = 0;
		Scene8_GameOver.addChild(sprOver);

		var labPercent = new Label();  // 変身完成度表示
		labPercent.font = '20px Meiryo';
		labPercent.color = 'rgba(255,255,255,1)';
		labPercent.width = SCREEN_WIDTH;
		labPercent.x = 20;
		labPercent.y = 90;
		Scene8_GameOver.addChild(labPercent);

		var labScore = new Label();  // スコア表示
		labScore.font = '20px Meiryo';
		labScore.color = 'rgba(255,255,255,1)';
		labScore.width = SCREEN_WIDTH;
		labScore.x = 20;
		labScore.y = 110;
		Scene8_GameOver.addChild(labScore);

		var sprTeruko3 = new Sprite(367, 291);  // 照子
		sprTeruko3.image = game.assets['images/teruko.png'];
		sprTeruko3.frame = 0;
		sprTeruko3.x = 0;
		sprTeruko3.y = 150;
		Scene8_GameOver.addChild(sprTeruko3);

		var sprTwinL5 = new Sprite(367, 291);  // 装備左
		sprTwinL5.image = game.assets['images/teruko.png'];
		sprTwinL5.frame = 2;
		sprTwinL5.x = 0;
		sprTwinL5.y = 150;
		Scene8_GameOver.addChild(sprTwinL5);

		var sprTwinR5 = new Sprite(367, 291);  // 装備右
		sprTwinR5.image = game.assets['images/teruko.png'];
		sprTwinR5.frame = 3;
		sprTwinR5.x = 0;
		sprTwinR5.y = 150;
		Scene8_GameOver.addChild(sprTwinR5);

		var sprAku = new Sprite(111, 250);  // 悪人
		sprAku.image = game.assets['images/aku.png'];
		sprAku.x = 80;
		sprAku.y = 180;
		Scene8_GameOver.addChild(sprAku);

		var sprRetryBtn = new Sprite(145, 54);  // リトライボタン
		sprRetryBtn.image = game.assets['images/retrybtn.png'];
		sprRetryBtn.x = 10;
		sprRetryBtn.y = 435;
		sprRetryBtn.ontouchend = function() {  // リトライ処理
			game.assets['images/bgm2-6.mp3'].play();
			game.replaceScene(Scene2);
			State = 2;
		};
		Scene8_GameOver.addChild(sprRetryBtn);

	};
	game.start();
};