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
            var findFlag = false;
            // for (test in LendResult) {
            //     if(test > 0) {
            //         resText += '\n';
            //     }
            //     if(RentResult[test]) {
            //         if(RentResult[test]['_id'] == LendResult[test]['_id']) {
            //             resText += LendResult[test]['_id'] + ' / ' + (LendResult[test]['money'] + (RentResult[test]['money'] * -1));
            //         }
            //     } else {
            //         resText += LendResult[test]['_id'] + ' / ' + LendResult[test]['money']
            //     }
            // }
            // for (test in RentResult) {
            //     if(!LendResult[test]) {
            //         if(resText) {
            //             resText += '\n';
            //         }
            //         resText += REndResult[test]['_id'] + ' / ' + (RentResult[test]['money'] * -1);
            //     } 
            // }
            /**貸借計算処理 */
            for (LendCnt in LendResult) {
                for (RentCnt in RentResult) {
                    if(RentResult[RentCnt]['_id'] == LendResult[LendCnt]['_id']) {  //両方に存在した場合
                        if(LendCnt > 0 || LendCnt > 0) {
                            resText += '\n';
                        }
                        resText += LendResult[LendCnt]['_id'] + ' / ¥' + (LendResult[LendCnt]['money'] + (RentResult[RentCnt]['money'] * -1));
                        findFlag = true;
                        break;
                    }
                }
                if(!findFlag) { //Lendのみ存在していた場合
                    if(LendCnt > 0 || LendCnt > 0) {
                        resText += '\n';
                    }
                    resText += LendResult[LendCnt]['_id'] + ' / ¥' + LendResult[LendCnt]['money'];
                } else { //両方に存在した場合
                    findFlag = false;
                }
            }
            for (RentCnt in RentResult) {
                for (LendCnt in LendResult) {
                    if(RentResult[RentCnt]['_id'] == LendResult[LendCnt]['_id']) {
                        findFlag = true;
                        break;
                    }
                }
                if(!findFlag) { //Rentのみ存在していた場合
                    if(LendCnt > 0 || LendCnt > 0) {
                        resText += '\n';
                    }
                    resText += RentResult[RentCnt]['_id'] + ' / ¥' + (RentResult[RentCnt]['money'] * -1);
                } else { //両方に存在した場合
                    findFlag = false;
                }
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
