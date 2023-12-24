// NOT IN USE
//import config from 'dotenv';
require('dotenv').config();
//import moment from 'moment';

var Firebird = require('node-firebird');

/*
config.config(); // gia na diavazei to .env
const PORT = process.env.PORT || 3001;
const DATABASE_HOST = process.env.DATABASE_HOST || 'Not applied yet';
const NODE_ENV = process.env.NODE_ENV || 'Not applied yet';
const DOPPLER_TOKEN  = process.env.DOPPLER_TOKEN || 'dp.st.dev.RJ1lqzZKzk2ugmE9KGs1dSZH0l1qFbn7axrd6n5zcnF';
const DB_PASS  = process.env.DB_PASS || 'PREPEI NA MHN VLEPEIS AYTO, alla ayto poy einai sto doppler';
*/


const options = {
    host: '127.0.0.1', //'192.168.100.36', //"host" : 'externalddns.ddns.net',  127.0.0.1
    port : 3050,
    database: 'G://Development//Delphi2007//Projects//CM//Data//CM.GDB',     //  G://Development//DB//CM_TEST/CM.GDB
    user : 'MANOS',
    password: 'capt@!n',
    lowercase_keys : true,
    //role : null,
    pageSize : 4096,
    //retryConnectionInterval = 1000; // reconnect interval in case of connection drop
    //blobAsText = false; // set to true to get blob as text, only affects blob subtype 1
    //encoding = 'UTF-8'; // default encoding for connection is UTF-8       
  };
  
 // 5 = the number is count of opened sockets
 var pool = Firebird.pool(1, options);

 //  dbpool.destroy(); PROSOXH TODO


async function getConnection() {
   return await new Promise((resolve, reject) => {
    pool.get(async function(err, db)   {
      if (err) {        
        reject(err)
      } else {        
        resolve(db);
      }
    })
  });
};

async function runQuery(queryString) {
  return new Promise(async function(resolve, reject) {
      var db = await getConnection();
      db.query(queryString, function (err, rows, fields) {
          if (err) {
            disconnectDb(db);
            return reject(err);
          }
          disconnectDb(db);
          resolve(rows);
      });
  });
}


// export 
let databaseWork = async (workload) => {
  var db = await getConnection();
  var trans;
  var result;
  try {
    trans = await beginTransaction(db);

    result = await workload(db);

    await commitTransaction(trans);
  } catch (err) {
    // a rollback might be neccesaary at that place
    throw err;
  } finally {
    db.detach();
  }

  return result;
}


function disconnectDb(db) {
  return new Promise((resolve, reject) => {
    try {
      db.detach();
      pool.destroy();
      resolve(); 
    } catch (err) {
        reject(err)              
      }
    })  
}

function beginTransaction(db){
  return new Promise( (resolve, reject) => {
    //async job
    db.transaction(Firebird.ISOLATION_READ_COMMITED,  function(err, transaction) {
      if (err) {reject(err);}
        resolve(transaction);
    });
  });
};



async function commitTransaction(transact) {
    return new Promise( (resolve, reject) => {
    //async job
      transact.commit( (err) => {
    //connection.commit( (err) => {
        if (err) {reject(err);}
          resolve();
        });
    });
};


//exports.databaseWork = databaseWork;
//module.exports.databaseWork = databaseWork;

module.exports = {
  getConnection,
  runQuery,
  beginTransaction,
  commitTransaction,
  disconnectDb
}