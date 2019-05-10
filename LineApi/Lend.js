var fs = require('fs');
var button = JSON.parse(fs.readFileSync('./config/lend.json', 'utf8'));

var common = require('./Common');
var lendDb = require('../Models/Lend');

//menu画面を返信する
exports.postBtn = function(req, user_id, reqText, callback) {
    console.log('aaaaaaaaa');
    require('dotenv').config();
    commondb.getStage(user_id, function(stage) {
        var resText = ['相手を選択してください', '金額を入力してください', '詳細を入力してください', 'ボタンを押下してください', '処理が完了しました',];

        //返信内容を定義
        if(stage == 3) { // 金額入力時処理

        } else if(stage == 4) { //日付入力時の場合
            
            //Database登録処理
            lendDb.runLendStage(user_id, reqText);

            // 日付ピッカーを送信
            common.postDPick(req, resText[stage], function(result){
                console.log('Lend:DayPicker:Result: ' + result);
                callback(result);
            });

        } else {
            
            //Database登録処理
            lendDb.runLendStage(user_id, reqText);

            // ボタンを送信
            common.postBtn(req, resText[stage], button['stage'][stage], function(result) {
                console.log('Lend:Button:Result: ' + result);
                callback(result);
            });

        }
    })
}

        

