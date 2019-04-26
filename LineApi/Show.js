
var request = require('request');
//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    var showModels = require('../Models/Show');
    showModels.getUserInfo(user_id, function(result){
        var userData = {'mode': result.mode, '相手': result.partner_name, 'タイムスタンプ': result.last_date+" "+result.last_time, "金額": result.money, "詳細": result.detail};
        
        //ヘッダー部を定義
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}',
        };

        //返信内容を定義
        var data = {
            'replyToken': req.body['events'][0]['replyToken'],
            "messages": [{
                "type": "text",
                "text": JSON.stringify(userData)
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
                console.log('LINAPI.SHOW: ' + body);
                callback(true);
            } else {
                console.log('LINEAPI.SHOW::ERROR: ' + JSON.stringify(response));
                callback(false);
            }
        });
    })
}