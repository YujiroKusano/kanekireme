var fs = require('fs');
var button = JSON.parse(fs.readFileSync('./config/lend.json', 'utf8'));

var commondb = require('../Models/Common');
var lenddb = require('../Models/Lend');

var request = require('request');

//menu画面を返信する
exports.postBtn = function(req, user_id, callback) {
    require('dotenv').config();
    commondb.getStage(user_id, (stage) => {
        var resText = ['相手を選択してください', '金額を入力してください', '詳細を入力してください', 'ボタンを押下してください', '処理が完了しました',];
        
        //ヘッダー部を定義
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}',
        };


        //返信内容を定義
        if(stage == 3) {
            var data = {
                'replyToken': req.body['events'][0]['replyToken'],
                'messages': [{
                    "type": "template",
                    "altText": '日付ピッカー',
                    "template": {
                        "type": "buttons",
                        "title": '借りた日付',
                        "text": resText[stage],
                        "actions": [
                            {
                            "type": "datetimepicker",
                            "label": "日付を入力する",
                            "mode": 'date',
                            "data": "action=datetemp&selectId=1"
                            }
                        ]
                    }
                },
            ]};
        } else {
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
        }
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
                console.log('LineApi.POST:BORROW:BUTTON:正常終了');
                callback(true);
            } else {
                console.log('LineApi.POST:BORROW:BUTTON:異常終了' + button['stage'][stage]);
                callback(false);
            }
        });
    })
}

        

