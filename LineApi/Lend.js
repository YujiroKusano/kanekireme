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

        } else if(stage == 2) { // 金額 -> 詳細入力ボタンを表示

            // 金額が正常に入力されているかを判定
            if(!isNaN(Number(reqText))){

                // 金額をDatabaseに登録
                lendDb.runLendStage(user_id, reqText);

                // 日付ピッカーを送信
                common.postBtn(req, resText[stage],  button['stage'][stage], function(result){
                    console.log('Lend:DayPicker:Result: ' + result);
                    callback(result);
                });

            } else {
                
                //エラーメッセージを送信
                var resText = '正しい金額を入力してください';
                common.postMsg(req, resText, function(result) {
                    callback(result);
                });
            }
        } else if(stage == 3) { // 詳細 -> 日付入力ボタンを表示
            
            // 詳細をDatabaseに登録
            lendDb.runLendStage(user_id, reqText);

            // 日付ピッカーを送信
            common.postDPick(req, resText[stage], function(result){
                console.log('Lend:DayPicker:Result: ' + result);
                callback(result);
            });

        } else if(stage == 4){ //日付 -> 完了ボタンを表示
 
            if(req.body['events'][0]['type'] === 'postback') {

                //日付をDatabaseに登録
                lendDb.runLendStage(user_id, reqText);

                // 完了ボタンを送信
                common.postBtn(req, resText[stage], button['stage'][stage], function(result) {
                    console.log('Lend:Button:Result: ' + result);
                    callback(result);
                });

            } else { //日付以外のデータが送信された場合

                //エラーメッセージを送信
                var resText = '正しい日付を入力してください';
                common.postMsg(req, resText, function(result) {
                    callback(result);
                });

            }

        }
    });
}

        

