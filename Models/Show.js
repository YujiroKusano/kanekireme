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

exports.getPartnerInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        // Get the documents collection
        var collection = db.collection('users');
        collection.aggregate([
            { $match: { 'partner_name': user_id } },
            { $group: {  _id: null, money: { $sum: '$money' } } },
            { $project: { partner_name: 1, money: 1 } }
        ]).toArray(function(err, status) {
            if(!err) { //成功した場合
                callback( status );
            } else { //失敗した場合
                console.log(err);
                callback( 0 );
            }
        });
    });
}