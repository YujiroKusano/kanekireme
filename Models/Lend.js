var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


var commondb = require('./Common');
exports.runLendStage = function(user_id, reqText, pertner_id, name)  {
  commondb.getStage(user_id, (stage) => {
    if(stage == 0) {
      console.log('Lend::stage情報不正: ' + reqText);
    } else if(stage == 1) {
      console.log('Lend::stage１:: stage2実行: ' + reqText);
      stage2(user_id, pertner_id, reqText, name);
    } else if(stage == 2) {
      console.log('Lend::stage2:: stage3実行: ' + reqText);
      stage3(user_id, reqText);
    } else if(stage == 3) {
      console.log('Lend::stage3:: stage4実行: ' + reqText);
      stage4(user_id, reqText);
    } else if(stage == 4) {
      console.log('Lend::stage4:: stage5実行: ' + reqText);
      stage5(user_id, reqText);
    } else if(stage == 5) {
      console.log('Lend::stage5:: stage6実行: ' + reqText);
      stage6(user_id, reqText);
    }
  });
}

  //stage1
  var stage1 = function(user_id, partner_id, reqText, name) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      console.log(user_id + ': stage1');
      var collection = db.collection('users');
      var jsDate = new Date();
      jsDate.setHours(jsDate.getHours() + 9);
      // Update document where status is 1, set partner_id equal to 1
      collection.update(
      { 'Sign_id': user_id, 'stage': 0},
      { 
        $inc: { stage: 1 },
        $set: {
          Lend_id: user_id,
          Lend_name: name,
          Rent_id: partner_id,
          Rent_name: reqText,
          timeStamp: jsDate
          //last_date: jsDate.toDateString(),
          //last_time: jsDate.toLocaleTimeString()
         } 
      });
    });
};

  //stage2
var stage2 = function(user_id, partner_id, reqText) {
    MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
      // Get the documents collection
      console.log(user_id + ': stage1');
      var collection = db.collection('users');
      var jsDate = new Date();
      jsDate.setHours(jsDate.getHours() + 9);
      // Update document where status is 1, set partner_id equal to 1
      collection.update(
      { 'Sign_id': user_id, 'stage': 1},
      { 
        $inc: { stage: 1 },
        $set: { 
          Rent_id: partner_id,
          Rent_name: reqText,
          timeStamp: jsDate
          //last_date: jsDate.toDateString(),
          //last_time: jsDate.toLocaleTimeString()
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
    { 'Sign_id': user_id, 'stage': 2},
    { 
      $inc: { stage: 1 },
      $set: { 
        money: reqText,
        timeStamp: jsDate
        //last_date: jsDate.toDateString(),
        //last_time: jsDate.toLocaleTimeString()
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
    { 'Sign_id': user_id, 'stage': 3},
    { 
      $inc: { stage: 1 },
      $set: { 
        detail: reqText,
        timeStamp: jsDate
        //last_date: jsDate.toDateString(),
        //last_time: jsDate.toLocaleTimeString()
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
    { 'Sign_id': user_id, 'stage': 4},
    { 
      // $inc: { 
        
      // },
      $set: { 
        stage: 0, 
        date: reqDate,
        timeStamp: jsDate
        //last_date: jsDate.toDateString(),
        //last_time: jsDate.toLocaleTimeString()
       } 
    });
  });
};

// //stage5
// var stage6 = function(user_id, reqDate) {
//   MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
//     // Get the documents collection
//     var collection = db.collection('users');
//     var jsDate = new Date();
//     jsDate.setHours(jsDate.getHours() + 9);
//     // Update document where status is 1, set partner_id equal to 1
//     collection.update(
//     { 'user_id': user_id, 'stage': 5},
//     { 
//      // $inc: {  },
//       $set: { 
//         stage: 0,
//         last_date: jsDate.toDateString(),
//         last_time: jsDate.toLocaleTimeString()
//        } 
//     });
//   });
// };