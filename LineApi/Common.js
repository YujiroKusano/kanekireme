var crypto = require('crypto');
var request = require('request');

var commonDb = require('../Models/Common');
var lend = require('./Lend');
var show = require('./Show');

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
    console.log('Text: ' + reqText);
    //個人チャットの場合の処理
    if(req.body['events'][0]['source']['type'] == 'user') {
        //ユーザーIDからユーザー名を取得
        var user_id = req.body['events'][0]['source']['userId'];
        var reqMode = {'一覧': 1, '借りる': 2, '貸す': 3, '返済': 4};

        commonDb.getMode(user_id, (mode) => {
            if(reqText == '一覧'){ //一覧表示処理
                show.postdbs(req, user_id, (result) => {
                    callback(result);
                });
            } else if(mode == 0) { //初回処理
                commonDb.stage1(user_id, reqMode[reqText]);

            } else if(mode == 2) { //借りる処理

            } else if(mode == 3) { //貸す処理
                lend.postBtn(req, user_id, (result) => {
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
                console.log('response: 返信正常' + body);
                callback(true);
            } else {
                console.log('response: 返信異常' + body);
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

function validate_signature(signature, body) {
    var buf1 = Buffer.from(JSON.stringify(body), 'utf8');
    return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(buf1).digest('base64');
}

