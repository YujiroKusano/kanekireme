var common = require('./Common');
var request = require('request');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    var showModels = require('../Models/Show');
    showModels.getPartnerInfo(user_id, function(result){
        common.postMsg(req, JSON.stringify(result), function(result){
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
