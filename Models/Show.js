var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.getUserInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection('users');
        // Find some documents if user_id and not stage
        collection.find({ 'Sign_id': user_id }).toArray(function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}

exports.getLendInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        // Get the documents collection
        var collection = db.collection('users');
        collection.aggregate([
            { $match: { Lend_id: user_id } },
            { $group: {  _id: '$Rent_name', money: { $sum: '$money' } } }
        ]).toArray(function(err, status) {
            if((status != null) || (status != undefined)) { //成功した場合
                callback( status );
            } else { //失敗した場合
                console.error(err);
                callback( 0 );
            }
        });
    });
}

exports.getRentInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        // Get the documents collection
        var collection = db.collection('users');
        collection.aggregate([
            { $match: { Rent_id: user_id } },
            { $group: {  _id: '$Lend_name', money: { $sum: '$money' } } },
            { $sort: { _id:1 } }
        ]).toArray(function(err, status) {
            if((status != null) || (status != undefined)) { //成功した場合
                callback( status );
            } else { //失敗した場合
                console.error(err);
                callback( 0 );
            }
        });
    });
}