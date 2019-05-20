var common = require('./Common');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    var showModels = require('../Models/Show');
    //返信内容を定義
    var data = {
        'replyToken': req.body['events'][0]['replyToken'],
    };
    //返信内容を定義    
    showModels.getPartnerInfo(user_id, function(result){
        var resText;
        for (test in result) {
            resText += result[test]['_id'] + ' / ' + result[test]['money'] + '\n';
        }
        common.postMsg(req, resText, function(result) {
            callback(null, result);
        })
    });

}
