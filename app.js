//yujiro.kusano.1106@gmail.com

var express = require('express');
var bodyParser = require('body-parser');
//var mongo = require('./Models/Common');
var fs = require('fs');

var commonjson = fs.readFileSync('./config/common.json', 'utf8');
var commonItem = JSON.parse(commonjson);

//"貸す"ボタン
var Lendbtn = fs.readFileSync('./config/lend.json', 'utf8');
var lendItem = JSON.parse(Lendbtn);

//"貸す"データベース操作モジュール
var lendModel = require('./Models/Lend');

//"一覧"データベース操作モジュール
var showModel = require('./Models/Show');

//送られてきた内容を確認するモジュール
var LineApi = require('./LineApi/Common');

var app = express();
app.set('port', (process.env.PORT || 8000));
// JSONの送信を許可
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/callback', function(req, res) {
    require('dotenv').config();
    LineApi.postChecker(req, res, (result) => {
        if(result == true) {
            console.log('app: 正常終了');
        } else {
            console.log('app: 異常終了');
        }
    });
});

app.listen(app.get('port'), function() {
    //mongo.connectUsersDb();
    console.log('Node app is running');
});
