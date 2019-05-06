var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var counters = 'counters';
var users = 'users';

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


getNextId = function(callback) {
    require('dotenv').config();
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(counters);
        collection.update({_id: "user_id"},{ $inc: {count: 1}}, function() {
            collection.find({ _id: "user_id" }).toArray(function(err, docs) {
                db.close();
                callback(docs[0].count);
            });
        });
    });
}

exports.stage1 = function(user_id, mode) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      assert.equal(null, err);
      // Get the documents collection
      var collection = db.collection(users);
      var jsDate = new Date();
      jsDate.setHours(jsDate.getHours() + 9);
      getNextId(function(getId){
        // Insert some documents
        collection.insertMany([{  
          _id: getId,
          user_id: user_id, 
          stage: 1,
          mode: mode,
          timeStamp: jsDate
          //last_date: jsDate.toDateString(),
          //last_time: jsDate.toLocaleTimeString()
        }]);
      });
    });
  }


exports.getStage = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(users);
        // Find some documents if user_id and not stage
        collection.findOne({'user_id': user_id, 'stage': { $ne: 0 }}, function(err, getStatus) {
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
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(users);
        // Find some documents if user_id and not stage
        collection.findOne({'user_id': user_id, 'stage': { $ne: 0 }}, function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus.mode );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}

exports.resetStage = function(user_id){
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(users);
        // Find some documents if user_id and not stage
        collection.remove({ 'user_id': user_id, 'stage': { $ne: 0 }}, 
            function(err, result) {
                if (err) {
                    console.log('reset::ERROR')
                } 
            }
        )}
        
    );
}
    
exports.cancelStage = function(user_id){
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(users);
        // Find some documents if user_id and not stage
        collection.update(
            { 'user_id': user_id, 'stage': { $ne: 0 }},
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
        var collection = db.collection(users);
        var jsDate = new Date();
        jsDate.setHours(jsDate.getHours() + 9);
        //-8分を設定してそれを下回った場合8分以上経過したと判定
        jsDate.setMinutes(jsDate.getMinutes() - 8);
        collection.findOne({'user_id': user_id, 'stage': { $ne: 0 }},function(err, getStatus) {
            if(getStatus == null) {
                console.log('CheckDate:: Stage情報なし');
                callback(true);
            } else if(jsDate < getStatus.timeStamp) {
                //console.log('CheckDate::' + jsDate + ' < ' + getStatus.timeStamp);
                callback(true);
            } else {
                console.log('CheckDate:: 8分経過');
                callback(false);
            }
        });  
    });
}
