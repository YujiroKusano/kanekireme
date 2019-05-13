var fs = require('fs');
var button = JSON.parse(fs.readFileSync('./config/lend.json', 'utf8'));

var common = require('./Common');
var commonDb = require('../Models/Common');
var lendDb = require('../Models/Lend');

//menu画面を返信する
exports.postBtn = function(req, user_id, reqText, callback) {
    require('dotenv').config();

    commonDb.getStage(user_id, function(stage) {
        
        var resText = ['相手を選択してください', '金額を入力してください', '詳細を入力してください', 'ボタンを押下してください', '処理が完了しました',];

        //返信内容を定義
        if(stage == 1) { // 名前登録 -> 金額入力時処理

            // 名前Database登録処理
            lendDb.runLendStage(user_id, reqText);

            // 金額ボタンを送信
            common.postBtn(req, resText[stage], button['stage'][stage], function(result) {
                console.log('Lend:Button:Result: ' + result);
                callback(result);
            });

        } else if(stage == 3) { // 金額 -> 日付入力時の場合
            
            //送られてきたテキストが数字だった場合
            if(!isNaN(Number(reqText))){

                // 日付ピッカーを送信
                common.postDPick(req, resText[stage], function(result){
                    console.log('Lend:DayPicker:Result: ' + result);
                    callback(result);
                });

                // 金額Database登録処理
                lendDb.runLendStage(user_id, reqText);

            } else {
                
                //stage情報を一つ下げる
                // commonDb.cancelStage(user_id);

                //エラーメッセージを送信
                var resText = '正しい値を入力してください';
                common.postMsg(req, resText, function(result) {
                    callback(result);
                });
            }

        } else {

            //Database登録処理
            lendDb.runLendStage(user_id, reqText);

            // ボタンを送信
            common.postBtn(req, resText[stage], button['stage'][stage], function(result) {
                console.log('Lend:Button:Result: ' + result);
                callback(result);
            });
        }
    });
}

        

