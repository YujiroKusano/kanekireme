var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.getNextId = function(callback) {
    var CounterDb = 'mongodb://localhost:27017/counters';
    MongoClient.connect(CounterDb, function(err, db) {
        var collection = db.collection('counters');
        collection.insertMany([{
            _id: "user_id",
            count: 0
        }]);
        collection.update({_id: "user_id"},{ $inc: {count: 1}}, function() {
            collection.find({ _id: "user_id" }).toArray(function(err, docs) {
                callback(docs[0].count);
            });
        });
    });
}

exports.getStage = function(db, getStatus, callback) {
    // Get the documents collection
        var collection = db.collection('Users');
        // Find some documents if user_id and not stage
        collection.findOne({'user_id': getStatus.user_id, 'stage': { $ne: getStatus.stage }}).toArray(function(err, getStatus) {
            assert.equal(err, null);
            console.log("status: " + getStatus.stage );
            callback( getStatus.stage );
        });      
    }

exports.checkdDate = function(db, callback) {
    var collection = db.collection('Users');
    var nwDate = new Date();
    var chDate = new Date();
    collection.findOne({}).toArray(function(err, getStatus) {
        assert.equal(err, null);
        var nowDate =  
        if() {

        }
        callback(dateResult);
    });  
}