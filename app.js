//yujiro.kusano.1106@gmail.com

var express = require('express');
var bodyParser = require('body-parser');
//var mongo = require('./Models/Common');
var fs = require('fs');

var commonjson = fs.readFileSync('./config/common.json', 'utf8');
var stage1Btn = JSON.parse(commonjson);

var Lendbtn = fs.readFileSync('./config/common.json', 'utf8');
var lendStage1 = JSON.parse(Lendbtn);

//送られてきた内容を確認するモジュール
var LineApi = require('./modules/LineApi');

var app = express();
app.set('port', (process.env.PORT || 8000));
// JSONの送信を許可
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.post('/callback', function(req, res) {
    require('dotenv').config();
    LineApi.postChecker(req, res, function(displayName, stage) {
        if(stage == 1) {
            LineApi.postBtn(req, stage1Btn.stage1, displayName);
        } else if(stage == 2) {
            LineApi.postBtn(req, lendStage1.stage1, displayName);
        }
    });
});

app.listen(app.get('port'), function() {
    //mongo.connectUsersDb();
    console.log('Node app is running');
});
