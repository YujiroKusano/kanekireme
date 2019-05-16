//yujiro.kusano.1106@gmail.com

var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('./Models/Common');
//送られてきた内容を確認するモジュール
var LineApi = require('./LineApi/RunProcess');

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
            console.log('app:: 正常終了');
        } else {
            console.log('app:: 異常終了');
        }
    });
});

app.listen(app.get('port'), function() {
    //mongo.connectUsersDb();
    console.log('Node app is running');
});

const test = require('./Models/Common');

app.get('/showDb', function(req, res, err) {
    test.getAllDb(function(result){
        res.send(result);
    })
})

app.get('/deleteDb', function(req, res, err) {
    test.deleteeAll(function(result){
        //res.send(result);
        res.send("<form>"+
        "<input type='submit' name='action' value='送信'></form>");
    })
})