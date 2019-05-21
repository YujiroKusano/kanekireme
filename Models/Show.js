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

exports.getRentInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        // Get the documents collection
        var collection = db.collection('users');
        collection.aggregate([
            { $match: { 'Rent_name':  user_id  } },
            { $group: {  _id: "$Lent_name", money: { $sum: '$money' } } },
            // { $project: { partner_name: 1, money: 1 } }
        ]).toArray(function(err, status) {
            if(!err) { //成功した場合
                callback( status );
            } else { //失敗した場合
                console.log('show::DB: ' + err);
                callback( 0 );
            }
        });
    });
}

exports.getLentInfo = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        // Get the documents collection
        var collection = db.collection('users');
        collection.aggregate([
            { $match: { 'Lent_name':  user_id  } },
            { $group: {  _id: "$Rent_name", money: { $sum: '$money' } } },
            // { $project: { partner_name: 1, money: 1 } }
        ]).toArray(function(err, status) {
            if(!err) { //成功した場合
                console.log('show::db: ' + status)
                callback( status );
            } else { //失敗した場合
                console.log('show::DB: ' + err);
                callback( 0 );
            }
        });
    });
}