var fs = require('fs');
var button = fs.readFileSync('./config/lend.json', 'utf8');
var stage1btn = JSON.parse(button);

var commondb = require('../Models/Common');
var lenddb = require('../Models/Lend');

var request = require('request');

//menu画面を返信する
exports.postBtn = function(req, user_id ,callback) {
    require('dotenv').config();
    commondb.getStage(user_id, (stage) => {

        var resText = ['default', '相手を選択してください', '金額を入力してください', '詳細を入力してください'];
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
                'text': resText[stage],
                'quickReply': {
                    "items": button['stage'][stage]
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
                lenddb.stage2(user_id, resText[stage]);
                callback(true);
            } else {
                console.log('L::ERROR: ' + response);
                console.log('stage: ' + stage);
                console.log('button: ' + button);
        
                callback(false);
            }
        });
    })
}