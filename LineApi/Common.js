var request = require('request');

//ボタンを表示処理
exports.postBtn = function(req, resText, button, callback) {
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
                'type': 'text',
                'text': resText,
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
                console.log('POST::Button: 正常終了');
                callback(true);
            } else {
                console.log('POST::Button: 異常終了');
                callback(false);
            }
        });
}

//LINEメッセージ送信処理
exports.postMsg = function(req, resText, callback) {
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
            callback(true);
        } else {
            console.log('POST::Message: 異常終了');
            callback(false);
        }
    });
}

//日付選択ピッカー処理
exports.postDPick = function(req, resText, callback) {
    var data = {
        'replyToken': req.body['events'][0]['replyToken'],
        'messages': [{
            "type": "template",
            "altText": '日付ピッカー',
            "template": {
                "type": "buttons",
                "title": '貸した日付',
                "text": resText,
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
            console.log('POST::DayPicker: 正常終了');
            callback(true);
        } else {
            console.log('POST::DayPicker: 異常終了');
            callback(false);
        }
    });

}