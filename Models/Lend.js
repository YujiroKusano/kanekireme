var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var commonDb = require('./Common');

exports.stage1 = function(user_id, reqText) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    assert.equal(null, err);
    // Get the documents collection
    var collection = db.collection('users');
    var jsDate = new Date();
    jsDate.setHours(jsDate.getHours() + 9);
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
        last_date: jsDate.toDateString(),
        last_time: jsDate.toLocaleTimeString()
      }]);
    });
  })
}
  
  //stage2
exports.stage2 = function(user_id, reqText) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      var collection = db.collection('users');
      var jsDate = new Date();
      jsDate.setHours(jsDate.getHours() + 9);
      // Update document where status is 1, set partner_id equal to 1
      collection.update({ 'user_id': user_id, 'status': 1},
      { 
        $inc: { stage: 1 },
        $set: { 
          partner_name: reqText,
          last_date: jsDate.toDateString(),
          last_time: jsDate.toLocaleTimeString()
         } 
      }, function(err, result) {
        if (err!=null) { console.log(err)}
        else { console.log(result)}
      })
    })
};