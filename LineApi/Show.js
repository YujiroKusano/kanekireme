var common = require('./Common');
var registDb = require('../Models/Registration');

var async = require('async');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    var showModels = require('../Models/Show');
    async.waterfall([
        function (callback) {
            //返信内容を定義
            var rpdata = [{
                'replyToken': req.body['events'][0]['replyToken']
            }];
            showModels.getPartnerInfo(user_id, function(result){

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

                        // 返信内容にユーザー情報を付与
                        rpdata.push(rcdata);
                    })
                }
                callback(null, rpdata);
            });
        }],
        function(rpdata){
            common.SpecialpostMsg(req, rpdata, function(result){
                callback(result)
            });
        }
    )
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
