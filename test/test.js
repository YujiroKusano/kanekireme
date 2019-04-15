var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var crypto = require('crypto');
var async = require('async');
var fs = require('fs');
var button = fs.readFileSync('./config/richMenu.json', 'utf8');
var btnItem = JSON.parse(button);
app.set('port', (process.env.PORT || 8000));

// JSONの送信を許可
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
var keyword = 'test';
app.post('/callback', function(req, res) {
    require('dotenv').config();
    async.waterfall(
        function(req) {
            require('dotenv').config();
            var messageText = 'message';
            //ヘッダー部を定義
            var headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS + '}',
            };
            //返信内容を定義        
            オプションを定義
            var options = {
                url: 'https://api.line.me/v2/bot/richmenu',
                proxy: process.env.FIXIE_URL,
                headers: headers,
                json: true,
                body: btnItem
            };

            request.post(options, function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    console.log(body);
                    
                } else {
                    console.log('error: ' + JSON.stringify(response));
                }
            });
        }
    )}
);


app.listen(app.get('port'), function() {
    console.log('Node app is running');
});

function validate_signature(signature, body) {
    var buf1 = Buffer.from(JSON.stringify(body), 'utf8');
    return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(buf1).digest('base64');
}