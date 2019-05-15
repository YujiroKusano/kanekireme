var crypto = require('crypto');
var request = require('request');
var async = require('async');

var commonDb = require('../Models/Common');
var registDb = require('../Models/Registration');
var lendDb = require('../Models/Lend');
var userBtnDb = require('../Models/UserBtn');

var common = require('./Common');
var lend = require('./Lend');
var show = require('./Show');
var regist = require('./Registration');

//POSTされた情報を判定する
exports.postChecker = function(req, res, callback) {
    async.waterfall([

        // 例外文字判定
        function(callback) {
            //送られてきたuser_idを取得する
            var user_id = req.body['events'][0]['source']['userId'];
            
            // reqTextを初期化
            var reqText = 'default';

            //環境変数を読み込む処理
            require('dotenv').config();
            
            //LINEから正式に送られてきたかを確認する
            if(!validate_signature(req.headers['x-line-signature'], req.body)) {
                console.log('LINE ERROR');
                return;
            }

            //送られてきたデータがメッセージまたは、日付ピッカー以外の場合処理を終了する
            if(req.body['events'][0]['type'] === 'message'){
                reqText = req.body['events'][0]['message']['text'];
            } else if (req.body['events'][0]['type'] === 'postback') {
                reqText = req.body['events'][0]['postback']['params']['date'];
            } else {
                console.log('MessageError:: データ不正');
                return;
            }
            
            //取り消しボタン押下時には処理が終了する
            if(reqText == '取り消し') { 
                commonDb.resetStage(user_id);
                var deleteText = '取り消し完了';
                common.postMsg(req, deleteText, function(result) {
                    console.log('取り消し完了');
                });
            }

            //完了ボタン押下時は処理なし
            if(reqText == '完了') { return }

            //アカウント登録処理
            registAcount(user_id);

            //日付を確認してfalseが帰ってきた場合stage情報をリセット
            commonDb.checkdDate(user_id, function(result) { //callbackのため処理の中に記載
                if(!result) {

                    //Stage情報をリセットする処理
                    commonDb.resetStage(user_id);

                    //タイムアウトエラーの結果を送信する処理
                    var deleteText = '前の操作から一定時間経過したため前の操作を取り消しました。';
                    common.postMsg(req, deleteText, function(result) {
                        return;
                    });
                    console.log(deleteText);
                }
                callback(user_id, reqText);
            });
        }
    ],
    //処理開始
    function(user_id, reqText) {
        //個人チャットの場合の処理
        if(req.body['events'][0]['source']['type'] == 'user') {

            //modeごとの分岐
            commonDb.getMode(user_id, function(mode) {

                if(reqText == '一覧'){ //一覧表示処理

                    //DB内を返却
                    show.postdbs(req, user_id, function(result) {
                        callback(result);
                    });

                } else if(mode == 0) { //初回処理
                    
                    //modeを定義
                    var reqMode = {'借りる': 2, '貸す': 3, '返済': 4};

                    //モード選択時に対象外の文字が入力された時の判定処理
                    if(reqMode[reqText] == null || reqMode[reqText] == undefined) {
                        console.log('LineApi.common:Mode0: 対象外のモードです。');
                        return;
                    } else {

                        //stageを1に進めるための処理
                        commonDb.stage1(user_id, reqMode[reqText]);
                        
                        //登録されたユーザーを取得
                        userBtnDb.getUserButton(user_id, function(button) {

                            //からではないことを確認
                            if(button != 0) {
                                
                                //相手を選択してくださいボタンを表示
                                var reqText = '相手を選択してください';
                                common.postBtn(req, reqText, button, function(result){
                                    callback(result);
                                });

                            } else { //相手が存在しない時の処理

                                //Stage情報をリセットする処理
                                commonDb.resetStage(user_id);

                                //タイムアウトエラーの結果を送信する処理
                                var deleteText = '相手が存在しません';
                                common.postMsg(req, deleteText, function(result) {
                                    callback(result);
                                });
                            }
                        });
                        return;
                    }
  
                } else if(mode == 2) { //借りる処理

                } else if(mode == 3) { //貸す処理
                    //Button表示処理＆返信テキスト処理
                    lend.postBtn(req, user_id, reqText, function(result) {
                        callback(result);
                    });
                    
                } else if(mode == 4) { //返済処理

                }
            });

            var get_profile_options = {
                url: 'https://api.line.me/v2/bot/profile/' + user_id,
                proxy: process.env.FIXIE_URL,
                json: true,
                headers: {
                    'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}'
                }
            };

            request.get(get_profile_options, function(err, res, body) {
                if(!err && res.statusCode == 200) {
                    console.log('COMMON::response: 返信正常');
                    callback(true);
                } else {
                    console.log('COMMON::response: 返信異常' + err);
                    callback(false);
                }
            });
        
        } 
        //グループチャットの場合の処理
        else if('room' == req.body['events'][0]['source']['type']) {
            callback('あなた', stage);
        } else {
            console.log('aaaaaaa');
        }
    }
)}

//LINEメッセージ整合性確認処理
function validate_signature(signature, body) {
    var buf1 = Buffer.from(JSON.stringify(body), 'utf8');
    return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(buf1).digest('base64');
}

//アカウント登録処理
function registAcount(user_id) {
    regist.getName(user_id, function(name) { //LINEAPIから名前を取得
        console.log('COMMON:LINEAPI: name: ' + name);
        registDb.alreadyId(user_id, function(result) { //既に登録されているuser_idか判断
            if(result == true) {
                registDb.alreadyName(name, function(result) { //名前に変更がないか判断
                    if(result == true) {
                        //変更なし(名前もIDも両方登録されている状態);
                        console.log('名前,idに変更ありません。');
                    } else {
                        registDb.updateAcount(user_id, name);
                        userBtnDb.updateButtonId(user_id, name);
                        console.log(name + 'の名前を変更しました');
                    }
                })                               
            } else {
                userBtnDb.insertAcount(user_id, name);
                console.log('新規に' + name + 'を登録しました。');
            }
            return;
        });
    });
}