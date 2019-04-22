var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.connectUsersDb = function() {
    require('dotenv').config();
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    assert.equal(null, err);
    //カウンター(_id値)定義データベースを初期化
    var collection = db.collection('counters');
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
        var collection = db.collection('counters');
        collection.update({_id: "user_id"},{ $inc: {count: 1}}, function() {
            collection.find({ _id: "user_id" }).toArray(function(err, docs) {
                console.log('getNextId');
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
      var collection = db.collection('users');
      var jsDate = new Date();
      jsDate.setHours(jsDate.getHours() + 9);
      getNextId(function(getId){
        // Insert some documents
        collection.insertMany([{  
          _id: getId,
          user_id: user_id, 
          stage: 1,
          mode: mode,
          last_date: jsDate.toDateString(),
          last_time: jsDate.toLocaleTimeString()
        }]);
      });
    });
  }


exports.getStage = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection('users');
        // Find some documents if user_id and not stage
        collection.findOne({'user_id': user_id, 'stage': { $ne: 0 }}, function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus.stage );
                console.log(getStatus.stage);
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
        var collection = db.collection('users');
        // Find some documents if user_id and not stage
        collection.findOne({'user_id': user_id, 'stage': { $ne: 0 }}, function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus.mode );
                console.log(getStatus.mode);
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}


exports.checkdDate = function(db, callback) {
    var collection = db.collection('users');
    var nwDate = new Date();
    var chDate = new Date();
    collection.findOne({}).toArray(function(err, getStatus) {
        assert.equal(err, null);
        callback(dateResult);
    });  
}
