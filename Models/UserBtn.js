

var userButton = 'userButton';
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.insertAcount = function(user_id, name) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      var collection = db.collection(userButton);
        // Insert some documents
        collection.insertMany([{  
            stage: [ 
                [{
                    type: "action",
                    imageUrl: "",
                    action: {
                        type: "message",
                        label: name,
                        text: name
                    }
                }]
            ]
      }]);
    });
  }


exports.updateButton = function(beforName, afterName) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(userButton);
        // Find some documents if user_id and not stage
        collection.update(
            { name: beforName },
            { $set: { name  : afterName } }
        );
    });
}
