
//const fs = require('fs');
const Firebird = require('node-firebird');
//const { default: LatestInvoices } = require("../ui/dashboard/latest-invoices");

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

  /* kinezos */

function getConn() {
    const p = new Promise(function(resolve, reject) {
        Firebird.attach(options, function(err, db) {
            if (err) {
                reject(err);
                return;
            }
            resolve(db);
        });
    });
    return p;
};

function statmentExec(db, sql, params=[]) {
    const p = new Promise(function(resolve, reject) {
        db.execute(sql, params, function(err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
    return p;
}

function queryRun(db, sql, params=[])  {
    const p = new Promise(function(resolve, reject)  {
        db.query(sql, params, function(err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
    return p;
}

/*
async function main() {
    // データベースに接続
    const db = await attach(options);
    // データの削除
    await execute(db, "DELETE FROM blob_test");
    // 画像データの登録
    await execute(db, "INSERT INTO blob_test (image) values (?)", [fs.createReadStream('lena.png')]);
    // データ取得
    const rows = await query(db, "SELECT * FROM blob_test");
    // BLOBのデータ列はfunctionになっているのでコールバックを設定
    rows[0].IMAGE(function(err, name, e) {
        // データを読み出し結合
        let data = Buffer.alloc(0);
        e.on('data', function(chunk) {
            data = Buffer.concat([data, chunk]);
        });
        // ファイル出力
        e.on('end', function() {
            fs.writeFile('result.png', data, function() {
                db.detach();
            });
        });
    });
}
main();
*/

module.exports = {
    getConn,
    statmentExec,
    queryRun,
  }