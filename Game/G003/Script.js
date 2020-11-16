enchant();

window.onload = function () {
	//////////////////////////////////////
	//定数・変数定義(ゲーム開始前に必要なもの)
	//////////////////////////////////////

	//チュートリアル 文字列
	var C_sTutorial ="TEXT INVADER" + "\t"	
					+ "スマホの場合は画面をタップで、" + "\t"
					+ "PCの場合は画面を左クリックで、" + "\t"
					+ "弾丸が発射します。" + "\t"
					+ "自機は左の青字、" + "\t"
					+ "敵は赤字です。" + "\t"
					+ "襲いかかるテキストをすべて撃退してください。" + "\t"
					+ "スマホの場合は画面を横にしたほうが、" + "\t"					
					+ "見やすいと思います。" + "\t"						
					+ "チュートリアルは、" + "\t"
					+ "あらかじめ用意されたテキストが表示されます。" + "\t"
					+ "それ以外のゲームは、" + "\t"
					+ "テキストファイルが必要なので、" + "\t"
					+ "スマホでは遊びにくいかもです。" + "\t"					
					+ "それ以外のゲームは" + "\t"
					+ "お手数ですがご自分で" + "\t"
					+ "文字コードが「UTF-8」の"+ "\t"
					+ "テキストファイルを用意してください。" + "\t"
					+ "サーバーには一切"+ "\t"
					+ "テキストファイルを保管しませんが。" + "\t"
					+ "念のため、" + "\t"
					+ "見られらくないファイルは使わないほうがよいでしょう。" + "\t"
					+ "特に使うテキストファイルが" + "\t"
					+ "思いつかない場合は、" + "\t"
					+ "青空文庫(Aozora Bunko)様の" + "\t"
					+ "短めの小説がおすすめです。" + "\t"
					+ "開発段階では" + "\t"					
					+ "太宰治 作 / 走れメロス" + "\t"	
					+ "(こんな読み方して誠に申し訳ないです)" + "\t"												
					+ "ほかにもUTF-8であれば" + "\t"	
					+ "お好きなドラマや、" + "\t"	
					+ "お好きな映画や、" + "\t"
					+ "お好きなアニメのセリフでも、" + "\t"	
					+ "ニュースでも、" + "\t"
					+ "メールでも、" + "\t"	
					+ "プログラムのソースでも、" + "\t"											
					+ "なんでも使えると思います。" + "\t"				
					+ "ああ、それから、" + "\t"		
					+ "スコアが上がると武器が変わります。" + "\t"	
					+ "それではお楽しみください！！！。" + "\t";

	var C_sImgPath = "image/";	
	var B_imgTitle = C_sImgPath + "imgTitle.png";
	var B_imgStart = C_sImgPath + "imgStart.png";
	var B_imgRetry = C_sImgPath + "imgRetry.png";
	var B_imgBackHome = C_sImgPath + "imgBackHome.png";
	var B_imgBomb   = C_sImgPath + "imgBom.png";
	var C_nFrameWidth = 480;		//フレーム 横幅
	var C_nFrameHeight = 360;		//フレーム 高さ

	var game = new Game(C_nFrameWidth, C_nFrameHeight);	//画面サイズ
	game.preload([B_imgTitle]);
	game.preload([B_imgStart]);	
	game.preload([B_imgRetry]);
	game.preload([B_imgBackHome]);	
	game.preload([B_imgBomb]);	

	//ゲーム開始
	game.start();

	//読み込み終わり
	/////////////////////////////////////////////////
	game.onload = function () {	//ロードが終わった後にこの関数が呼び出される
		//////////////////////////////////////
		//定数・変数定義(ゲームで使用するもの)
		//////////////////////////////////////
		var C_nTitleWidth = 400;		//タイトル 横幅
		var C_nTitleHeight = 100;		//タイトル 高さ
		var C_nMargin = 10;				//						
		var C_sFont = "Meiryo";			//フォント
		var C_nFontSizeSS =12;			//フォントサイズ SS
		var C_nFontSizeS =16;			//フォントサイズ S
		var C_nFontSizeM =18;			//フォントサイズ M
		var C_nFontSizeL =20;			//フォントサイズ L
		var C_sDefMyNm ="猫山"; 		//自機名初期値
		var C_sBombs = new Array("爆弾","無駄","ネコ","無理"); 	//弾
		var C_nPowerUpScore = 70;		//武器がパワーアップするスコア
		var m_clearFlg = 0;				//クリア状態　0:失敗, 1:成功
		var m_MyNm ="";					//自機表示名
		var Score = 0;					//スコア
		var stringAry = [];				//テキストファイル内容格納

		//開始画面 シーン関連	
		var S_Start = new Scene();				//シーン作成 オープニング						
		var S_LoadingTxt = new Label();
		var S_inputFile = new Entity();	

		//メイン シーン関連
		var S_MAIN = new Scene();				//シーン作成 メイン
		var S_Text = new Label(); 				//現在のスコア
		var S_Hero  = new Label(); 				//自機
		var idxString =- 1;						
		var MonsterAry = [];					//モンスタースプライトを管理する配列
		var BombAry = [];						//爆弾スプライトを管理する配列

		//結果画面 シーン関連			
		var S_END = new Scene();
		var S_GameOverText1 = new Label(); 		//ラベル ゲームオーバー1
		var S_GameOverText2 = new Label(); 		//ラベル ゲームオーバー2

		//////////////////////////////////////
		//開始画面 表示
		//////////////////////////////////////	
		displayStart();	
	
		//////////////////////////////////////
		//各種 関数
		//////////////////////////////////////	
		//フォント設定用 文字列取得
		function getFont(nFontSize,bBold=false) {							
			var ret;
			ret ="";
			if (bBold == true){
				ret = "bold "
			}
			ret = ret + nFontSize + "px " + C_sFont; //フォント設定
			return ret;
		}

		//文字列置換
		var replaceAll = function(str, before, after) {
			return str.split(before).join(after);
		  };

		//読み込んだテキストを配列へ変換
		var convertTxttoArray = function (str){ // 
			var result = []; // 最終的な二次元配列を入れるための配列
			var tmp = str;
			//tmp = replaceAll(tmp,",",",\n") ;
			tmp = replaceAll(tmp,"\.","\.\n") ;
			//tmp = replaceAll(tmp,"、","、\n") ;
			tmp = replaceAll(tmp,"。","。\n") ;
			tmp = replaceAll(tmp,"\t","\n") ;
		
			var tmp2 = tmp.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
		
			var j=-1
			for(var i=0;i<tmp2.length;++i){
				if (tmp2[i].trim().length > 0) {
					//１文字以上あったら配列に格納
					j++;
					result[j] = tmp2[i].trim();
				}
			}
			return result;
		}

		//開始画面 表示
		function displayStart(){
			//タイトル画像
			var S_Title = new Sprite(C_nTitleWidth, C_nTitleHeight);				
			//テキスト
			var S_StartTxt1 = new Label(); 	
			var S_StartTxt2 = new Label();
			var S_StartTxt3 = new Label();
			var S_StartTxt4 = new Label();		
			var S_StartTxt5 = new Label();	
			var S_StartA = new Sprite(100, 30);	
			var S_inputMyNm = new Entity();	
			var S_StartB = new Sprite(100, 30);	

			game.pushScene(S_Start);  					//S_MAINシーンオブジェクトを画面に設置
			S_Start.backgroundColor = "black"; 			//S_MAINシーンの背景は黒色

			//画像
			S_Title.image = game.assets[B_imgTitle];
			S_Title.x = (C_nFrameWidth - C_nTitleWidth) / 2;  							
			S_Title.y = 0;									
			S_Start.addChild(S_Title);	

			S_StartTxt1.font = getFont(C_nFontSizeS,false);
			S_StartTxt1.color = 'rgba(255,255,255,1)';	
			S_StartTxt1.width = C_nFrameWidth  - C_nMargin * 2;	
			S_StartTxt1.moveTo(C_nMargin, S_Title.y + S_Title.height + C_nMargin); 	
			S_StartTxt1.text ='チュートリアル(まずはこちらをお選びください)';
			S_Start.addChild(S_StartTxt1);
	
			//チュートリアル 開始 ボタン(画像)			
			S_StartA.image = game.assets[B_imgStart];
			S_StartA.x = C_nFrameWidth - S_StartA.width - C_nMargin; 							
			S_StartA.y = S_StartTxt1.y + C_nFontSizeS;								
			S_Start.addChild(S_StartA);
	
			S_StartTxt2.font = getFont(C_nFontSizeS,false);	
			S_StartTxt2.color = S_StartTxt1.color;	
			S_StartTxt2.width = S_StartTxt1.width;	
			S_StartTxt2.moveTo(C_nMargin, S_StartA.y + S_StartA.height + C_nMargin*2);	
			S_StartTxt2.text ='テキストを指定して遊ぶ';
			S_Start.addChild(S_StartTxt2);	
	
			S_StartTxt3.font = getFont(C_nFontSizeSS,false);	
			S_StartTxt3.color = S_StartTxt1.color;	
			S_StartTxt3.width = C_nFrameWidth  - C_nMargin * 4;	
			S_StartTxt3.moveTo(C_nMargin * 3, S_StartTxt2.y + C_nFontSizeS  + C_nMargin);	
			S_StartTxt3.text ='・名前を入力してください（半角で6文字以内、全角で3文字以内)。';
			S_Start.addChild(S_StartTxt3);	
	
			//inputBox
			S_inputMyNm._element = document.createElement('input');
			S_inputMyNm._element.setAttribute('type','text');
			S_inputMyNm._element.setAttribute('value',C_sDefMyNm);
			S_inputMyNm._element.setAttribute('id','inputMyNm');
			S_inputMyNm.width = C_nFontSizeS * 5;
			S_inputMyNm.height = C_nFontSizeS;
			S_inputMyNm.x = C_nMargin * 4; 
			S_inputMyNm.y = S_StartTxt3.y + C_nFontSizeSS + C_nMargin	;
			S_Start.addChild(S_inputMyNm);
			var obj1 = document.getElementById("inputMyNm");
	
			S_StartTxt4.font = getFont(C_nFontSizeSS,false);	
			S_StartTxt4.color = S_StartTxt1.color;	
			S_StartTxt4.width = S_StartTxt3.width;	
			S_StartTxt4.moveTo(C_nMargin * 3, S_inputMyNm.y + C_nFontSizeS  + C_nMargin);	
			S_StartTxt4.text ='・テキストファイル(UTF-8)を選択してください。';
			S_Start.addChild(S_StartTxt4);	
	
			//inputBox
			S_inputFile._element = document.createElement('input');
			S_inputFile._element.setAttribute('type','file');
			S_inputFile._element.setAttribute('id','inputfile');
			S_inputFile.width = C_nFrameWidth  - C_nMargin * 5;
			S_inputFile.height = C_nFontSizeL;
			S_inputFile.x = C_nMargin * 4; 
			S_inputFile.y = S_StartTxt4.y + C_nFontSizeSS + C_nMargin ;
			S_Start.addChild(S_inputFile);
			var obj2 = document.getElementById("inputfile");
	
			//開始 ボタン(画像)			
			S_StartB.image = game.assets[B_imgStart];
			S_StartB.x =  C_nFrameWidth - S_StartB.width - C_nMargin; 					
			S_StartB.y = S_inputFile.y + S_inputFile.height;								
			S_Start.addChild(S_StartB);
			
			S_LoadingTxt.font = getFont(C_nFontSizeS,false); 		//フォント設定
			S_LoadingTxt.color = S_StartTxt1.color;			//色　RGB+透明度　白
			S_LoadingTxt.width = C_nFrameWidth  - C_nMargin * 11;	//横幅指定　
			S_LoadingTxt.moveTo(C_nMargin * 10, S_StartB.y + S_StartB.height + C_nMargin); //移動位置指定
			S_LoadingTxt.text ='';
			S_Start.addChild(S_LoadingTxt);						//S_MAINシーンにこの画像を埋め込む

			//ダイアログでファイルが選択された時
			obj2.addEventListener("change",function(evt){
				var file = evt.target.files;
				var reader = new FileReader();	//FileReaderの作成
				reader.readAsText(file[0]);		//テキスト形式で読み込む
				reader.onload = function(ev){	//読込終了後の処理
					stringAry = convertTxttoArray(reader.result);	//テキストエリアに表示する
				}
			},false);	

			//S_StartAクリック
			S_StartA.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
				//var file = evt.target.files;
				stringAry = convertTxttoArray(C_sTutorial);	//テキストエリアに表示する				
				S_LoadingTxt.text ='・・・戦闘を開始します。';
				var sMyNmTmp = document.getElementById("inputMyNm").value;
				if (sMyNmTmp.length > 0){
					m_MyNm = sMyNmTmp;
				} else {
					m_MyNm = C_sDefMyNm;
				}

				setTimeout(startMain,1500); //メイン画面実行
			};

			//S_StartBクリック
			S_StartB.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
				if (stringAry.length == 0) {
					alert('テキストファイルを選択してください');
					return;
				}

				S_LoadingTxt.text ='・・・戦闘を開始します。';
				var sMyNmTmp = document.getElementById("inputMyNm").value;
				if (sMyNmTmp.length > 0){
					m_MyNm = sMyNmTmp;
				} else {
					m_MyNm = C_sDefMyNm;
				}

				setTimeout(startMain,1500); //メイン画面実行
			};
		}		

		//メイン画面 開始
		var startMain = function (){
			game.popScene();
			game.pushScene(S_MAIN); //S_MAINシーンオブジェクトを画面に設置
			init();				//関数初期化
			displayMain();		//メイン画面表示			
		}

		//メイン画面 表示
		function displayMain(){
			S_MAIN.backgroundColor = "black"; 			//S_MAINシーンの背景は黒くした

			//スコアテキスト
			S_Text.font =  getFont(C_nFontSizeM,false);	//フォント
			S_Text.color = 'rgba(255,255,255,1)';		//色　RGB+透明度　白
			S_Text.width = C_nFontSizeM * 7; 			//横幅指定
			S_Text.moveTo(C_nFrameWidth - C_nFontSizeM * 7, C_nMargin);
			S_MAIN.addChild(S_Text);					
			S_Text.text = "現在：" + Score;				//テキストに文字表示 Score表示
			
			//自機
			S_Hero.font = getFont(C_nFontSizeS,false);	//フォント
			S_Hero.color = 'rgba(0,200,255,1)';			//RGB+透明度
			S_Hero.width = C_nFontSizeS * 2 ;			
			S_Hero.text = m_MyNm;
			S_Hero.moveTo(0, (C_nFrameHeight / 2));				//自機の位置
			S_MAIN.addChild(S_Hero);							//S_MAINシーンに貼る
			S_Hero.time = 0;									//Sin波で自機を左右に移動させるので、カウントが必要
			S_MAIN.time = 0;									//S_MAIN内で使用するカウント用変数
		}

		///////////////////////////////////////////////////
		//メインループ			
		S_MAIN.onenterframe = function () {
			S_Text.text = "現在：" + Score;						//テキストに文字表示 Scoreは変数なので、ここの数字が増える
			this.time++;										//毎フレームカウントを１増やす
			if (stringAry.length <= Score) {					//読み込んテキストが終了したら
				m_clearFlg =1;
				game.popScene();								//S_MAINシーンを外して
				game.pushScene(S_END);							//S_ENDシーンを見せる
				dsiplayEnd();									//結果画面表示
			}	
			if (this.time >= 55 - Score) {						//カウントが55 - Scoreを超えたら
				this.time = 0;
				var S_Monster  = new Label(); 					//モンスター		
				idxString++;
				if (stringAry.length > idxString) {				//				
					S_Monster.font =  getFont(C_nFontSizeS,false); //フォント
					S_Monster.color = 'rgba(255,0,0,1)';			//赤色
					S_Monster.width = C_nFontSizeS * stringAry[idxString].length;	

					S_Monster.text = stringAry[idxString]; 
					S_Monster.x = C_nFrameWidth;										//出現X座標
					S_Monster.y = Math.random() * (C_nFrameHeight - C_nFontSizeS) ; 	//出現Y座標
					S_MAIN.addChild(S_Monster);						//S_MAINシーンに追加
					S_Monster.number = MonsterAry.length;			//自分がMonsterAryのどこにいるか覚えておく(削除するときに使う)
					MonsterAry.push(S_Monster);						//MonsterAry（モンスター管理用配列）に格納
				}

				S_Monster.onenterframe = function () {				//モンスターの動作
					this.x -= 2;									//左へ移動
					if (this.x <= 0) {								//モンスターが左端まで行ったら
						game.popScene();							//S_MAINシーンを外して
						game.pushScene(S_END);						//S_ENDシーンを見せる
						dsiplayEnd();								//結果画面表示
					}
				};
			}
		};

		///////////////////////////////////////////////////
		//クリックで球を発射
		S_MAIN.ontouchend = function () {
			var S_Bomb = new Label();
			S_Bomb.font =  getFont(C_nFontSizeS,false);　//フォント
			S_Bomb.color = 'rgba(0,255,255,1)';				//青色
			S_Bomb.width = C_nFontSizeS * 2;	
			if (Score <= C_nPowerUpScore) {
				//通常武器
				S_Bomb.text = C_sBombs[0];
			} else {
				//武器のパワーアップ
				S_Bomb.font = getFont(C_nFontSizeS,true);
				S_Bomb.color = 'rgba(255,255,0,1)';
				var rand = Math.floor(Math.random() * 10 ) + 1;
				switch (rand){
					case 1:
						S_Bomb.text = C_sBombs[3];
						break;
					case 2:
					case 3:
						S_Bomb.text = C_sBombs[2];
						break;
					default:
						S_Bomb.text = C_sBombs[1];
						break;
				}
			}

			S_Bomb.moveTo(S_Hero.x, S_Hero.y);				//自機の位置に持ってくる
			S_MAIN.addChild(S_Bomb);						//S_MAINシーンに貼る
			S_Bomb.number = BombAry.length;					//
			BombAry.push(S_Bomb);							//配列に格納

			S_Bomb.onenterframe = function () {				//毎フレーム毎に実行
				this.x += 5;								//右に進む
				for (var i = 0; i < MonsterAry.length; i++) {	//爆弾とスライムの衝突処理(MonsterAryに入っているすべてのモンスターに対して当たり判定を行う)
					if (MonsterAry[i] != null) {				//もう削除済みなら次のインデックスを見る
						if (Math.sqrt(((this.x - 8) - (MonsterAry[i].x - 8)) * ((this.x - 8) - (MonsterAry[i].x - 8)) + ((this.y - 8) - (MonsterAry[i].y - 8)) * ((this.y - 8) - (MonsterAry[i].y - 8))) < 32) {//衝突判定
							Score++;		//スコアを１足す
							var S_Effect = new Sprite(16, 16);									//爆発エフェクト
							S_Effect.moveTo(MonsterAry[i].x, MonsterAry[i].y);					//敵機と同じ位置に爆発エフェクトを設置
							S_MAIN.addChild(S_Effect);											//S_MAINシーンに表示
							S_Effect.image = game.assets[B_imgBomb];							//爆発画像
							S_Effect.onenterframe = function () {								//毎フレーム処理
								if (this.frame >= 5) this.parentNode.removeChild(this);			//フレームが最後だったら消える
								else this.frame++;												//そうでなかったら、フレームを１増やす
							};

							MonsterAry[i].parentNode.removeChild(MonsterAry[i]);				//敵機をS_MAINから外す
							MonsterAry[i] = null;												//管理用配列の自分の部分はNULLに置き換える
							if (Score <= C_nPowerUpScore){
								this.parentNode.removeChild(this);								//thisは爆弾なので、爆弾を消す
								BombAry[this.number] = null;
							}
							
							return;
						}
					}
				}
				if (this.x > C_nFrameWidth + C_nMargin *2) {
					this.parentNode.removeChild(this);
					BombAry[this.number] = null;
				}	//画面外に出たら、S_MAINシーンから外す。
			};
		};

		S_Hero.onenterframe = function () {
			this.time++;									//カウントを１増やす
			this.y = Math.sin(this.time / 10) * ((C_nFrameHeight - C_nFontSizeS) / 2 ) + (C_nFrameHeight - C_nFontSizeS) / 2 ;	//Sin波で自機を上下に移動させる
		};

		//初期化用関数
		function init() {							
			Score = 0;
			idxString =-1;
			m_clearFlg =0;
			S_LoadingTxt.text ='';
			S_inputFile._element.setAttribute('value','');
			
			//敵機をすべて削除
			for (var i = 0; i < MonsterAry.length; i++) {
				if (MonsterAry[i] != null) MonsterAry[i].parentNode.removeChild(MonsterAry[i]);		//画面にスライムが残っていれば削除する
			}
			MonsterAry = [];		//モンスター管理用の配列を初期化

			//爆弾をすべて削除
			for (var i = 0; i < BombAry.length; i++) {
				if (BombAry[i] != null) BombAry[i].parentNode.removeChild(BombAry[i]);	
			}
			BombAry = [];

		}

		//結果画面表示
		function dsiplayEnd() {	
			var S_Retry = new Sprite(120, 60);					//画像 画像
			var S_BackHome = new Sprite(120, 60);				//画像 Homeに戻る

			S_END.backgroundColor = "black";

			//ラベル ゲームオーバー1
			S_GameOverText1.font = getFont(C_nFontSizeL,false); 
			S_GameOverText1.color = 'rgba(255,255,255,1)';		
			S_GameOverText1.width = C_nFrameWidth - C_nMargin * 5; 
			S_GameOverText1.moveTo(C_nMargin * 4, C_nMargin * 8);	
			S_END.addChild(S_GameOverText1);

			//ラベル ゲームオーバー2
			S_GameOverText2.font = getFont(C_nFontSizeL,false);
			S_GameOverText2.color = 'rgba(255,255,255,1)';
			S_GameOverText2.width = S_GameOverText1.width;
			S_GameOverText2.moveTo(S_GameOverText1.x, S_GameOverText1.y + C_nFontSizeL + C_nMargin);
			S_END.addChild(S_GameOverText2);

			//リトライボタン
			S_Retry.moveTo(C_nMargin * 4, S_GameOverText2.y + C_nFontSizeL + C_nMargin * 4);	//コインボタンの位置
			S_Retry.image = game.assets[B_imgRetry];		//読み込む画像の相対パスを指定。　事前にgame.preloadしてないと呼び出せない
			S_END.addChild(S_Retry);						//S_MAINにこのコイン画像を貼り付ける 

			//HOMEボタン
			S_BackHome.moveTo(C_nMargin * 8 + S_Retry.width, S_Retry.y);
			S_BackHome.image = game.assets[B_imgBackHome];	
			S_END.addChild(S_BackHome);						

			//S_Retryクリック
			S_Retry.ontouchend = function () {				//S_Retryボタンをタッチした（タッチして離した）時にこの中の内容を実行する
				init();										//スコアなど、変化する変数を初期化する関数
				game.popScene();							//S_ENDシーンを外す
				game.pushScene(S_Start);					//S_MAINシーンを入れる
			};

			//S_BackHomeクリック
			S_BackHome.ontouchend = function () {				//HOMEへ移動
				window.location.href = '../../index.html'; 
			};
		}

		//S_END onenterframe
		S_END.onenterframe = function () {
			var sClear="";
			if (m_clearFlg ==1){
				sClear ="クリア！！！！";
			} else {
				sClear ="Game Over";
			}
			S_GameOverText1.text = sClear;
			S_GameOverText2.text = Score + "体　敵を倒した！";
		};
	};
};