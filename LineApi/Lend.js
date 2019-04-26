var fs = require('fs');
var button = JSON.parse(fs.readFileSync('./config/lend.json', 'utf8'));

var commondb = require('../Models/Common');
var lenddb = require('../Models/Lend');

var request = require('request');

//menu画面を返信する
exports.postBtn = function(req, user_id, reqText, callback) {
    require('dotenv').config();
    commondb.getStage(user_id, (stage) => {
        var resText = ['相手を選択してください', '金額を入力してください', '詳細を入力してください',  '', '処理が完了しました',];
        //ヘッダー部を定義
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}',
        };

        var data;
        //返信内容を定義
        if(stage == 4) {
            //返信内容を定義
            data = {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "title": '貸した日付',
                        "text": "ボタンを押下してください",
                        "actions": [
                            {
                            "type": "datetimepicker",
                            "label": "日付を入力する",
                            "mode": 'date',
                            "data": "action=datetemp&selectId=1"
                            }
                        ]
                    }
                }
        } else {
            data = {
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
                console.log('LineApi.POSTBUTTON:正常終了');
                callback(true);
            } else {
                console.log('LineApi.POSTBUTTON:異常終了')
                callback(false);
            }
        });
    })
}

        

