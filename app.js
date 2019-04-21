//yujiro.kusano.1106@gmail.com

var express = require('express');
var bodyParser = require('body-parser');
//var mongo = require('./Models/Common');
var fs = require('fs');

var commonjson = fs.readFileSync('./config/common.json', 'utf8');
var commonItem = JSON.parse(commonjson);

var Lendbtn = fs.readFileSync('./config/lend.json', 'utf8');
var lendItem = JSON.parse(Lendbtn);

var lendModel = require('./Models/Lend');

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
    LineApi.postChecker(req, res, function(stage, user_id, reqText) {
        if(stage == 1) {
            LineApi.postBtn(req, lendItem.stage2, stage);
            lendModel.stage2(user_id, reqText);
        } else if(stage == 2) {
            
        } else if(stage == 3) {
            LineApi.postBtn(req, lendItem.stage3, stage);
        } else if(stage == 4) {
            LineApi.postBtn(req, lendItem.stage4, stage);
        } else if(stage == 5) {
            LineApi.postBtn(req, lendItem.stage5, stage);
        } else if(stage == 6) {
            LineApi.postBtn(req, lendItem.stage6, stage);
        } else if(stage == 7) {
            LineApi.postBtn(req, ltenItem.stage7, stage);
        } else {
            // LineApi.postBtn(req, commonItem.stage1);
            lendModel.stage1(user_id, reqText);
            LineApi.postBtn(req, lendItem.stage2, stage);
        }
    });
});

app.listen(app.get('port'), function() {
    //mongo.connectUsersDb();
    console.log('Node app is running');
});
