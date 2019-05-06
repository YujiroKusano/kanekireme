var crypto = require('crypto');
var request = require('request');

var commonDb = require('../Models/Common');
var registDb = require('../Models/Registration');
var nameButton = require('../Models/UserBtn');
var lendDb = require('../Models/Lend');
var lend = require('./Lend');
var show = require('./Show');
var regist = require('./Registration');

//POSTされた情報を判定する
exports.postChecker = function(req, res, callback) {
    require('dotenv').config();
    console.log('req: ' + JSON.stringify(req.body));
    //LINEから正式に送られてきたかを確認する
    if(!validate_signature(req.headers['x-line-signature'], req.body)) {
        console.log('LINE ERROR');
        return;
    }
    var user_id = req.body['events'][0]['source']['userId'];
    console.log(req.body['events'][0]['type']);
    if(req.body['events'][0]['type'] === 'message'){
        var reqText = req.body['events'][0]['message']['text'];
    } else if (req.body['events'][0]['type'] === 'postback') {
        var reqText = req.body['events'][0]['postback']['params']['date'];
    } else {
        console.log('MessageError:: データ不正');
        return;
    }
    
    //取り消しボタン押下時には
    if(reqText == '取り消し') { 
        commonDb.resetStage(user_id);
        var deleteText = '取り消し完了';
        postMsg(req, deleteText, function(result) {
            console.log('取り消し完了');
        });
    }
    //完了ボタン押下時は処理なし
    if(reqText == '完了' || reqText == '取り消し') { return }

    //アカウント登録処理
    registAcount(user_id);

    //日付を確認してfalseが帰ってきた場合stage情報をリセット
    commonDb.checkdDate(user_id, function(result) {
        if(result == false) {
            commonDb.resetStage(user_id);
            var deleteText = '前の操作から一定時間経過したため前の操作を取り消しました。';
            if(postMsg(req, deleteText) == false){
                return;
            }
            console.log(deleteText);
            callback(true);
            return;
        }
  
        console.log('Text: ' + reqText);
        //個人チャットの場合の処理
        if(req.body['events'][0]['source']['type'] == 'user') {
            //modeごとの分岐
            commonDb.getMode(user_id, function(mode) {
                if(reqText == '一覧'){ //一覧表示処理
                    show.postdbs(req, user_id, function(result) {
                        callback(result);
                    });
                } else if(mode == 0) { //初回処理
                    var reqMode = {'借りる': 2, '貸す': 3, '返済': 4};
                    //モード選択時に対象外の文字が入力された時の判定処理
                    if(reqMode[reqText] == null || reqMode[reqText] == undefined) {
                        console.log('LineApi.common:Mode0: 対象外のモードです。');
                        return;
                    } else {
                        //相手を選択してくださいボタンを表示
                        postBtn(req, user_id, reqText, function(result){
                            callback(result);
                        });
                        //stageを1に進めるための処理
                        commonDb.stage1(user_id, reqMode[reqText]);
                    }
  
                } else if(mode == 2) { //借りる処理

                } else if(mode == 3) { //貸す処理
                    //Button表示処理＆返信テキスト処理
                    lend.postBtn(req, user_id, function(result) {
                        callback(result);
                    });
                    //Database登録処理
                    lendDb.runLendStage(user_id, reqText);
                } else if(mode == 4) { //返済処理

                } else if(mode == 5) { //アカウント登録ボタン
                    
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
                    console.log('COMMON::response: 返信正常' + body);
                    callback(true);
                } else {
                    console.log('COMMON::response: 返信異常' + body);
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

// var fs = require('fs');
// var button = JSON.parse(fs.readFileSync('./config/common.json', 'utf8'));

    //LINEボタン発生処理
    postBtn = function(req, callback) {
        nameButton.getUserButton(function(button) {
        
        require('dotenv').config();
        var resText = ['相手を選択してください'];
        //ヘッダー部を定義
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}',
        };

        //返信内容を定義
        var data = {
            'replyToken': req.body['events'][0]['replyToken'],
            'messages': [{
                'type': 'text',
                'text': resText[0],
                'quickReply': {
                    "items": button
                }   
            },
        ]};
        //オプションを定義
        var options = {
            url: 'https://api.line.me/v2/bot/message/reply',
            proxy: process.env.FIXIE_URL,
            headers: headers,
            json: true,
            body: data
        };
        
        //返信処理
        request.post(options, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                return(true);
            } else {
                callback(false);
            }
        })
    })
    }

//LINEメッセージ送信処理
postMsg = function(req, resText) {
    require('dotenv').config();
    //ヘッダー部を定義
    var headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}',
    };

    //返信内容を定義
    var data = {
        'replyToken': req.body['events'][0]['replyToken'],
        'messages': [{
            "type": "text",
            "text": resText
        }]
    };
    //オプションを定義
    var options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        proxy: process.env.FIXIE_URL,
        headers: headers,
        json: true,
        body: data
    };
    
    //返信処理
    request.post(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            console.log('POST::Message: 正常終了');
            return true;
        } else {
            console.log('POST::Message: 異常終了');
            return false;
        }
    });
}

//アカウント登録処理
registAcount = function(user_id) {
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
                        nameButton.updateButtonId(user_id, name);
                        console.log(name + 'の名前を変更しました');
                    }
                })                               
            } else {
                nameButton.insertAcount(user_id, name);
                registDb.insertAcount(user_id, name);

                console.log('新規に' + name + 'を登録しました。');
            }
        });
    });
}