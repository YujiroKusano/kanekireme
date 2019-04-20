//yujiro.kusano.1106@gmail.com

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var crypto = require('crypto');
var async = require('async');
var fs = require('fs');

//メニュー画面を取得する
var menujson = fs.readFileSync('./config/common.json', 'utf8');
var menuBtn = JSON.parse(menujson);
app.set('port', (process.env.PORT || 8000));

//送られてきた内容を確認するモジュール
// var LineApi = require('./modules/LineApi');
// LineApi.textChecker(function() {

// });
// JSONの送信を許可
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var keyword = 'test';
app.post('/callback', function(req, res) {
    require('dotenv').config();
    async.waterfall([
        function(callback) {
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
            //keywordの文字を含む場合のみ反応する
            if(req.body['events'][0]['message']['text'].indexOf(keyword) == -1) {
                console.log('text ERROR');
                return;
            }
            //個人チャットの場合の処理
            if(req.body['events'][0]['source']['type'] == 'user') {
                //ユーザーIDからユーザー名を取得
                var user_id = req.body['events'][0]['source']['userId'];
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
                        callback(body['displayName']);
                    }
                });
            } 
            //グループチャットの場合の処理
            else if('room' == req.body['events'][0]['source']['type']) {
                callback('あなた');
            }
        },
    ],
    function(displayName) {
        require('dotenv').config();
        var messageText = 'message';
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
                'text': displayName + messageText,
                "quickReply": {
                    "items": menuBtn.menu
                }   
            }
        ]};
        
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
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running');
});

function validate_signature(signature, body) {
    var buf1 = Buffer.from(JSON.stringify(body), 'utf8');
    return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(buf1).digest('base64');
}