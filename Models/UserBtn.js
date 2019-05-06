

var userButton = 'userButton';
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.insertAcount = function(user_id, name) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      var collection = db.collection(userButton);
        // Insert some documents
        collection.insertMany([{  
          type: "action",
          imageUrl: "",
          user_id: user_id,
          action: {
              type: "message",
              label: name,
              text: name
          }
      }])
    });
  }


exports.updateButtonId = function(user_id, name) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        var collection = db.collection(userButton);
        // Find some documents if user_id and not stage
        collection.update(
            { user_id: user_id },
            { $set: {
              action: {
                  type: "message",
                  label: name,
                  text: name
              } 
            } 
          }
        );
    });
}
exports.updateButtonName = function(user_id, name) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      var collection = db.collection(userButton);
      // Find some documents if user_id and not stage
      collection.update(
          { name: name },
          { $set: {
            user_id: user_id,
            action: {
                type: "message",
                label: name,
                text: name
            } 
          } 
        }
      );
  });
}
exports.getUserButton = function(callback) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      var collection = db.collection(userButton);
      // Find some documents if user_id and not stage
      collection.find({}).toArray(function(err, getButton) {
          if(getButton != null) { //成功した場合
              callback( getButton );
          } else { //失敗した場合
              callback( 0 );
          }
      });
  });
}