const acount = 'userButton';
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// exports.insertAcount = function(user_id, name) {

//     MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
//       // Get the documents collection
//       var collection = db.collection(acount);
//         // Insert some documents
//         collection.insertMany([{  
//             name: name,
//             user_id: user_id
//       }]);
//     });
//   }


exports.updateAcount = function(user_id, name) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(acount);
        // Find some documents if user_id and not stage
        collection.update(
            { 'user_id': user_id },
            { $set: { action: { type : 'message', text  : name , label: name } } }
        );
    });
}

exports.getAcountName = function(user_id, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(acount);
        // Find some documents if user_id and not stage
        collection.findOne({'user_id': user_id}, function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus.action['text'] );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}

exports.getAcountId= function(name, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        assert.equal(null, err);
        // Get the documents collection
        var collection = db.collection(acount);
        // Find some documents if user_id and not stage
        collection.findOne({'name': name}, function(err, getStatus) {
            if(getStatus != null) { //成功した場合
                callback( getStatus.user_id );
            } else { //失敗した場合
                callback( 0 );
            }
        });
    });
}


exports.alreadyName = function(name, callback) {
    require('dotenv').config();
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(acount);
        collection.findOne({ 
            "action": {
                "type": "message",
                "label": "中村航太",
                "text": "中村航太"
            } 
        },
        function(err, docs) {
            if(docs != null) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
}
exports.alreadyId = function(user_id, callback) {
    require('dotenv').config();
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(acount);
        collection.findOne({ user_id: user_id },function(err, docs) {
            if(docs != null) {
                callback(true);
            } else {
                callback(false);
            }
        });
    });
}
