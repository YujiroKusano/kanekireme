var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


var commondb = require('./Common');
exports.runLendStage = function(user_id, reqText)  {
  commondb.getStage(user_id, (stage) => {
    if(stage == 0) {
      console.log('Lend::stage情報不正: ' + reqText);
    } else if(stage == 1) {
      console.log('Lend::stage１:: stage2実行: ' + reqText);
      stage2(user_id, reqText);
    } else if(stage == 2) {
      console.log('Lend::stage2:: stage3実行: ' + reqText);
      stage3(user_id, reqText);
    } else if(stage == 3) {
      console.log('Lend::stage3:: stage4実行: ' + reqText);
      stage4(user_id, reqText);
    } else if(stage == 4) {
      console.log('Lend::stage4:: stage5実行: ' + reqText);
      stage5(user_id, reqText);
    }
  });
}
  //stage2
var stage2 = function(user_id, reqText) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      console.log(user_id + ': stage1');
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
      });
    });
};

 //stage2
var stage3 = function(user_id, reqText) {
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
    });
  });
};

//stage3
var stage4 = function(user_id, reqText) {
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
    });
  });
};

//stage4
var stage5 = function(user_id, reqDate) {
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    // Get the documents collection
    var collection = db.collection('users');
    var jsDate = new Date();
    jsDate.setHours(jsDate.getHours() + 9);
    // Update document where status is 1, set partner_id equal to 1
    collection.update(
    { 'user_id': user_id, 'stage': 4},
    { 
     // $inc: {  },
      $set: { 
        stage: 0,
        date: reqDate,
        last_date: jsDate.toDateString(),
        last_time: jsDate.toLocaleTimeString()
       } 
    });
  });
};