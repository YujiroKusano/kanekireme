var common = require('./Common');
var showModels = require('../Models/Show');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    //返信内容を定義    
    showModels.getLendInfo(user_id, function(LendResult){
        showModels.getRentInfo(user_id, function(RentResult) {
            console.log('Lend: ' + JSON.stringify(LendResult));
            console.log('Rent: ' + JSON.stringify(RentResult));
            var resText = '';
            for (test in LendResult) {
                if(test > 0) {
                    resText += '\n';
                }
                resText += LendResult[test]['_id'] + ' / ' + (LendResult[test]['money'] + (RentrResult[test]['money'] * -1));
            }
            if(resText != null) {
                common.postMsg(req, resText, function(result) {
                    callback(result);
                })
            } else {
                let eResText = 'err'
                common.postMsg(req, eResText, function(result) {
                    callback(result);
                })
            }
        })
    });

}
