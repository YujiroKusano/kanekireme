var common = require('./Common');
var registDb = require('../Models/Registration');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    var showModels = require('../Models/Show');
    showModels.getPartnerInfo(user_id, function(result){
        var data = new Map();
        console.log('result: ' + JSON.stringify(result));
        for(var element in result){
            registDb.getAcountName(result[element]['_id'], function(name) {
                console.log('name: ' + name );
                console.log('money: ' + result[element]['money']);
                data.put(name, result[element]['money']);
            })
        }
        common.postMsg(req, JSON.stringify(data), function(result){
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
