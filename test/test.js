//yujiro.kusano.1106@gmail.com

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

//メニュー画面を取得する
var menujson = fs.readFileSync('./config/common.json', 'utf8');
var menuBtn = JSON.parse(menujson);
app.set('port', (process.env.PORT || 8000));

//送られてきた内容を確認するモジュール
var LineApi = require('../modules/LineApi');

// JSONの送信を許可
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.post('/callback', function(req, res) {
    require('dotenv').config();
    LineApi.textChecker(req, res, function() {
        LineApi.postText(displayName);
    });
});

app.listen(app.get('port'), function() {
    console.log('Node app is running');
});
