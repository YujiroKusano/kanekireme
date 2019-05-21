

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


exports.updateButtonName = function(user_id, name) {
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
exports.updateButtonId = function(user_id, name) {
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
exports.getUserButton = function(user_id, callback) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      var collection = db.collection(userButton);
      // Find some documents if user_id and not stage
      collection.find({user_id: { $ne: user_id }}).toArray(function(err, getButton) {
          if(getButton != null) { //成功した場合
              callback( getButton['action']['name'] );
          } else { //失敗した場合
              callback( 0 );
          }
      });
  });
}

exports.getUserName = function(user_id, callback) {
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