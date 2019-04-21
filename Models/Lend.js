var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var commonDb = require('./Common');

exports.stage1 = function(user_id, reqText) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    assert.equal(null, err);
    // Get the documents collection
    var collection = db.collection('users');
    var jsDate = new Date();
    var mode;
    if(reqText == '貸す'){
      mode = 3;
    }  
    commonDb.getNextId(function(getId){
      // Insert some documents
      collection.insertMany([{  
        _id: getId,
        user_id: user_id, 
        stage: 1,
        mode: mode,
        last_date: jsDate.toTimeString() + jsDate.toLocaleTimeString()
      }]);
    });
  })
}
  
  //stage2
exports.stage2 = function(db, status, callback) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      var collection = db.collection('users');
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
    })
};