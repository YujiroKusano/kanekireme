var crypto = require('crypto');
var request = require('request');

var commonDb = require('../Models/Common');


//POSTされた情報を判定する
exports.postChecker = function(req, res, callback) {
    require('dotenv').config();
    //LINEから正式に送られてきたかを確認する
    if(!validate_signature(req.headers['x-line-signature'], req.body)) {
        console.log('LINE ERROR');
        return;
    }
    //TextまたはMessageが送られてきた場合のみ反応する
    if((req.body['events'][0]['type'] != 'message') || (req.body['events'][0]['message']['type'] != 'text')) {
        console.log('MESSAGE ERROR');
        return;
    }
    var reqText = req.body['events'][0]['message']['text'];
    console.log(reqText);

    //個人チャットの場合の処理
    if(req.body['events'][0]['source']['type'] == 'user') {
        //ユーザーIDからユーザー名を取得
        var user_id = req.body['events'][0]['source']['userId'];
        commonDb.getStage(user_id, function(getUser) {

            var get_profile_options = {
                url: 'https://api.line.me/v2/bot/profile/' + user_id,
                proxy: process.env.FIXIE_URL,
                json: true,
                headers: {
                    'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}'
                }
            };
            request.get(get_profile_options, function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    // callback(body['displayName'], getUser, user_id);
                    callback(getUser, user_id, reqText);
                } 
            });
        })
    } 
    //グループチャットの場合の処理
    else if('room' == req.body['events'][0]['source']['type']) {
        callback('あなた', stage);
    } else {
        console.log('aaaaaaa');
    }
}

//menu画面を返信する
exports.postBtn = function(req, button, stage) {
    require('dotenv').config();
    var resText = 'default';
    if(stage == 1) {
        resText = '相手を選択してください';
    } else if(stage = 2) {
        resText = '金額を入力してください'
    } else {

    }
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
            'text': resText,
            "quickReply": {
                "items": button
            }   
        },
    ],
};
    
    //オプションを定義
    var options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        proxy: process.env.FIXIE_URL,
        headers: headers,
        json: true,
        body: data
    };

    request.post(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log('error: ' + JSON.stringify(response));
        }
    });
}


function validate_signature(signature, body) {
    var buf1 = Buffer.from(JSON.stringify(body), 'utf8');
    return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(buf1).digest('base64');
}

