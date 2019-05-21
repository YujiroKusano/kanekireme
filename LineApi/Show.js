var common = require('./Common');
var showModels = require('../Models/Show');

//一覧を返信する
exports.postdbs = function(req, user_id, callback) {
    require('dotenv').config();
    //返信内容を定義    
    showModels.getLentInfo(user_id, function(result){
        console.log('itirann: ' + result)
        var resText = '';
        for (test in result) {
            if(test > 0) {
                resText += '\n';
            }
            resText += result[test]['_id'] + ' / ' + result[test]['money'];
        }
        if(resText != null) {
            common.postMsg(req, resText, function(result) {
                callback(null, result);
            })
        } else {
            console.log('itiran::error')
        }

    });

}
