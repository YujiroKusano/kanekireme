var common = require('./Common');
var showModels = require('../Models/Show');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    //返信内容を定義    
    showModels.getLentInfo(user_id, function(LendResult){
        showModels.getLentInfo(user_id, function(RentResult) {
            console.log('Lend: ' + JSON.stringify(LendResult));
            console.log('Rent: ' + JSON.stringify(RentResult));
            callback(true);
        })
        // var resText = '';
        // for (test in result) {
        //     if(test > 0) {
        //         resText += '\n';
        //     }
        //     resText += result[test]['_id'] + ' / ' + result[test]['money'];
        // }
        // if(resText != null) {
        //     common.postMsg(req, resText, function(result) {
        //         callback(result);
        //     })
        // } else {
        //     let eResText = 'err'
        //     common.postMsg(req, eResText, function(result) {
        //         callback(result);
        //     })
        // }
    });

}
