var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

exports.stage1 = function(db, status, callback) {
    // Get the documents collection
    var collection = db.collection('Users');
    var jsDate = new Date();
    getNextId(function(getId){
      // Insert some documents
      collection.insertMany([{  
        _id: getId,
        user_id: status.user_id, 
        stage: 1,
        mode: status.mode,
        last_date: jsDate
      }], function(err, result) {
        console.log("stage1");
        callback(err, result);
      });
    });
  }
  
  //stage2
exports.stage2 = function(db, status, callback) {
    // Get the documents collection
    var collection = db.collection('Users');
    // Update document where status is 1, set partner_id equal to 1
    collection.update({ 'status' : { $ne: 0 } },
    { 
      $inc: { stage: 1 },
      $set: { partner_name: status.partner_name } 
    },
    function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated partner_name");
      callback(result);
    })
};