var common = require('./Common');
var registDb = require('../Models/Registration');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    var showModels = require('../Models/Show');
    showModels.getPartnerInfo(user_id, function(result){
        //返信内容を定義
        var rpdata = {
            'replyToken': req.body['events'][0]['replyToken']
        };

        var rrdata = JSON.stringify(rpdata);
        for(var element in result){
            registDb.getAcountName(result[element]['_id'], function(name) {
                console.log('name: ' + name );
                console.log('money: ' + result[element]['money']);
                var rcdata = {
                    'messages': [{
                        "type": "text",
                        "text": name + ': ' +result[element]['money']
                    }]
                }
                rrdata.push(rcdata);
            })
        }
        common.postMsg(req, rrdata, function(result){
            callback(result)
        });
    })
}

// exports.postdbs = function(req, user_id, callback) {
//     require('dotenv').config();
//     var showModels = require('../Models/Show');
//     showModels.getUserInfo(user_id, function(result){
//         common.postMsg(req, JSON.stringify(result), function(result){
//             callback(result)
//         });
//     })
// }
