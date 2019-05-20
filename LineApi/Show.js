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
        common.postMsg(req, JSON.stringify(result), function(result) {
            callback(null, result);
        })
    });

}
