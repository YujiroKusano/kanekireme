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
            showModels.getPartnerInfo(user_id, function(result){
                var resText;
                for(var element in result){
                    registDb.getAcountName(result[element]['_id'], function(name) {
                        console.log('name: ' + name );
                        console.log('money: ' + result[element]['money']);
                       
                        resText += name + ': ' +result[element]['money'] + '\n';
                   
                        console.log("rpdata" + JSON.stringify(rpdata));
                    })
                }
                callback(null, resText);
            });
        },
        function(err, rpdata){
            console.log(JSON.stringify(rpdata))
            common.postMsg(req, rpdata, function(result){
                callback(result)
            });
        }
    ],

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
