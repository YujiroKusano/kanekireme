var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.getUserInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection('users');
        // Find some documents if user_id and not stage
        collection.find({ 'user_id': user_id }).toArray(function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}