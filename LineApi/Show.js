var common = require('./Common');
var showModels = require('../Models/Show');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    //返信内容を定義    
    showModels.getRentInfo(user_id, function(result){
        var resText = '';
        for (test in result) {
            if(test > 0) {
                resText += '\n';
            }
            resText += result[test]['_id'] + ' / ' + result[test]['money'];
        }
        common.postMsg(req, resText, function(result) {
            console.log(result)
            callback(null, result);
        })
    });

}
