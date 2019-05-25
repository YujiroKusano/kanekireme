let fs = require('fs');
let button = JSON.parse(fs.readFileSync('./config/button.json', 'utf8'));

let common = require('./Common');
let commonDb = require('../Models/Common');
let RentDb = require('../Models/repay');
let registDb = require('../Models/Registration');
let userBtnDb = require('../Models/UserBtn');

//menu画面を返信する
exports.postBtn = function(req, user_id, reqText, callback) {
    require('dotenv').config();

    commonDb.getStage(user_id, function(stage) {
        
        var resText = ['相手を選択してください', '金額を入力してください', '詳細を入力してください', 'ボタンを押下してください', '処理が完了しました',];

        //返信内容を定義
        if(stage == 1) { // 名前登録 -> 金額入力時処理
            registDb.alreadyName(reqText,function(result) {
                if(result) {
                    registDb.getAcountName(user_id, function(name) { //LINEAPIから名前を取得 
                        // 相手のIDをデータベースに登録
                        registDb.getAcountId(reqText, function(result) {   
                            // 名前Database登録処理
                            RentDb.runRentStage(user_id, reqText, result, name);
                        });
                    });

                    // 金額ボタンを送信
                    common.postBtn(req, resText[stage], button['stage'][stage], function(result) {
                        console.log('Rent:Button:Result: ' + result);
                        callback(result);
                    });
                } else {
                    // 金額ボタンを送信
                    userBtnDb.getUserButton(user_id, function(button) {

                        //からではないことを確認
                        if(button != 0) {
                            //相手を選択してくださいボタンを表示
                            var eResText = '正しいユーザーを選択してください';
                            common.postBtn(req, eResText, button, function(result){
                                callback(result);
                            });
                        } else {
                            console.error('情報不正：ユーザ取得の際にDBが操作されました')
                        }
                    })
                    //エラーメッセージを送信
                }

            })
            
        } else if(stage == 2) { // 金額 -> 詳細入力ボタンを表示

            // 金額が正常に入力されているかを判定
            if(!isNaN(Number(reqText))){
                console.log('reqtext: 金額: ' + reqText);
                // 金額をDatabaseに登録
                RentDb.runRentStage(user_id, Number(reqText));

                // 日付ピッカーを送信
                common.postBtn(req, resText[stage],  button['stage'][stage], function(result){
                    console.log('Rent:DayPicker:Result: ' + result);
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
            var str_obj = new String(reqText);
            var len = str_obj.length;

            if(len <= 30) {
                // 詳細をDatabaseに登録
                RentDb.runRentStage(user_id, reqText);

                // 日付ピッカーを送信
                common.postDPick(req, resText[stage], function(result){
                    console.log('Rent:DayPicker:Result: ' + result);
                    callback(result);
                });
            } else {
                
                //エラーメッセージを送信
                var resText = '30文字以内で入力してください';
                common.postMsg(req, resText, function(result) {
                    callback(result);
                });
            }
            

        } else if(stage == 4){ //日付 -> 完了ボタンを表示
 
            //requestの中身が日付ッピッカーから入力された情報かを判定
            if(req.body['events'][0]['type'] === 'postback') {

                //日付をDatabaseに登録
                RentDb.runRentStage(user_id, reqText);

                // 完了ボタンを送信
                common.postBtn(req, resText[stage], button['stage'][stage], function(result) {
                    console.log('Rent:Button:Result: ' + result);
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

        

