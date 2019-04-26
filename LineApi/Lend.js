var fs = require('fs');
var button = JSON.parse(fs.readFileSync('./config/lend.json', 'utf8'));

var commondb = require('../Models/Common');
var lenddb = require('../Models/Lend');

var request = require('request');

//menu画面を返信する
exports.postBtn = function(req, user_id, reqText, callback) {
    require('dotenv').config();
    commondb.getStage(user_id, (stage) => {
        var resText = ['相手を選択してください', '金額を入力してください', '詳細を入力してください', '処理が完了しました', ''];
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
                if(stage == 0) {

                } else if(stage == 1) {
                    lenddb.stage2(user_id, reqText);
                } else if(stage == 2) {
                    lenddb.stage3(user_id, reqText);
                } else if(stage == 3) {
                    lenddb.stage4(user_id, reqText);
                } else if(stage == 4){
                    lenddb.stage5(user_id, reqText);
                }
                console.log('LineApi.Lend:正常終了');
                callback(true, );
            } else {
                console.log('LineApi.Lend:異常終了')
                callback(false);
            }
        });
    })
}