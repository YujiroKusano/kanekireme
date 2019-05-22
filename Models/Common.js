var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


const counters = 'counters';
const users = 'users';

// IDを生成する処理
exports.connectUsersDb = function() {
    require('dotenv').config();
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    assert.equal(null, err);
    
    //カウンター(_id値)定義データベースを初期化
    var collection = db.collection(counters);
    collection.insertMany([{
        _id: "user_id",
        count: 0
    }]);
    console.log('Connecting to MongoDB');
    db.close();
  });
}

// IDを加算していく処理
getNextId = function(callback) {
    require('dotenv').config();
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(counters);
        collection.update({_id: "user_id"},{ $inc: {count: 1}}, function() {
            collection.find({ _id: "user_id" }).toArray(function(err, docs) {
                callback(docs[0].count);
            });
        });
    });
}

// Stage1処理
exports.stage1 = function(user_id, name, mode) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {

        // Get the documents collection
        var collection = db.collection(users);
        var jsDate = new Date();
        jsDate.setHours(jsDate.getHours() + 9);
        getNextId(function(getId){

        // Insert some documents
        collection.insertMany([{  
            _id: getId,
            Sign_id: user_id,
            stage: 1,
            mode: mode,
            timeStamp: jsDate
        }]);
      });
    });
  }


exports.getStage = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {

        // Get the documents collection
        var collection = db.collection(users);

        // Find some documents if user_id and not stage
        collection.findOne({'Sign_id': user_id, 'stage': { $ne: 0 }}, function(err, getStatus) {

            if(getStatus != null) { //成功した場合
                callback( getStatus.stage );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}

exports.getMode = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {

        // Get the documents collection
        var collection = db.collection(users);

        // Find some documents if user_id and not stage
        collection.findOne({'Sign_id': user_id, 'stage': { $ne: 0 }}, function(err, getStatus) {

            if(getStatus != null) { //成功した場合
                callback( getStatus.mode );

            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}

// Stage情報を初期化する処理
exports.resetStage = function(user_id){
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {

        // Get the documents collection
        var collection = db.collection(users);
        
        // Find some documents if user_id and not stage
        collection.remove({ 'Sign_id': user_id, 'stage': { $ne: 0 }}, function(err, result) {
                // リセットに失敗した場合
                if (err) {
                    console.log('reset::ERROR')
                } 
            }
        )}
        
    );
}

// Stage情報を一つ前の状態に戻す処理
exports.cancelStage = function(user_id){
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(users);
        // Find some documents if user_id and not stage
        collection.update(
            { 'Sign_id': user_id, 'stage': { $ne: 0 }},
            { $inc: { stage: -1 } }
        );
    });
}

/**
 * 詳細: 操作中のドキュメントが時間経過していないかを判定
 * 戻値: 8分以上経過していた場合false,それ以外の場合はtrue
 */
exports.checkdDate = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        
        // Get the documents collection
        var collection = db.collection(users);

        // Javascriptないで日付を取得
        var jsDate = new Date();

        // 日付を日本時刻に変更
        jsDate.setHours(jsDate.getHours() + 9);

        // -8分を設定してそれを下回った場合8分以上経過したと判定
        jsDate.setMinutes(jsDate.getMinutes() - 8);

        // Stage情報を取得
        collection.findOne({'Sign_id': user_id, 'stage': { $ne: 0 }},function(err, getStatus) {

            if(getStatus == null) { // Stage0以外のデータが存在しない場合
                console.log('CheckDate:: Stage情報なし');
                callback(true);

            } else if(jsDate < getStatus.timeStamp) { // 前操作が8分以内の場合
                console.log('CheckDate:: タイムスタンプ異常なし');
                callback(true);

            } else { // 前処理から8分を経過していた場合
                console.log('CheckDate:: 8分経過');
                callback(false);
            }
        });  
    });
}

exports.updateName = function(user_id, name) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(users);
        // Find some documents if user_id and not stage
        collection.update(
            { Sign_id: user_id },
            { $set: { name: name } }
        ) 
    });
}

exports.updatePertnerName = function(user_id, name) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      var collection = db.collection(users);
      // Find some documents if user_id and not stage
      collection.update(
          { pertner_id: user_id },
          { $set: { Pertner_name: name } }
      );
  });
}

//---------------------------------------------------------------------
exports.getAllDb = function(callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection('users');
        // Find some documents if user_id and not stage
        collection.find({ }).toArray(function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}

// Stage情報を初期化する処理
exports.deleteeAll = function(callback){
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {

        // Get the documents collection
        var collection = db.collection(users);
        
        // Find some documents if user_id and not stage
        collection.remove({ }, function(err, result) {
                // リセットに失敗した場合
                if (err) {
                    callback('reset::ERROR');
                } else {
                    callback('削除成功');
                }
            }
        )}
        
    );
}
//---------------------------------------------------------------------
