var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

  //stage1
exports.stage1 = function(user_id, reqText) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      console.log(user_id + ': stage2');
      var collection = db.collection('users');
      var jsDate = new Date();
      jsDate.setHours(jsDate.getHours() + 9);
      // Update document where status is 1, set partner_id equal to 1
      collection.update(
      { 'user_id': user_id, 'stage': 1},
      { 
        $inc: { stage: 1 },
        $set: { 
          partner_name: reqText,
          last_date: jsDate.toDateString(),
          last_time: jsDate.toLocaleTimeString()
         } 
      })
    })
};

 //stage2
 exports.stage2 = function(user_id, reqText) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    // Get the documents collection
    var collection = db.collection('users');
    var jsDate = new Date();
    jsDate.setHours(jsDate.getHours() + 9);
    // Update document where status is 1, set partner_id equal to 1
    collection.update(
    { 'user_id': user_id, 'stage': 2},
    { 
      $inc: { stage: 1 },
      $set: { 
        money: reqText,
        last_date: jsDate.toDateString(),
        last_time: jsDate.toLocaleTimeString()
       } 
    })
  })
};

//stage3
exports.stage3 = function(user_id, reqText) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    // Get the documents collection
    var collection = db.collection('users');
    var jsDate = new Date();
    jsDate.setHours(jsDate.getHours() + 9);
    // Update document where status is 1, set partner_id equal to 1
    collection.update(
    { 'user_id': user_id, 'stage': 3},
    { 
      $inc: { stage: 1 },
      $set: { 
        detail: reqText,
        last_date: jsDate.toDateString(),
        last_time: jsDate.toLocaleTimeString()
       } 
    })
  })
};