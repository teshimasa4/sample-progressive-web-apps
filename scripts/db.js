var module = {
  db : null
};

module.init = function() {
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.msIndexedDB;
  if (indexedDB) {
    // データベースを削除したい場合はコメントを外します。
    //indexedDB.deleteDatabase("mydb");
    var openRequest = indexedDB.open("mydb", 1.0);

    openRequest.onupgradeneeded = function(event) {
      var db = event.target.result;
      var store = db.createObjectStore("mystore", { keyPath: "mykey"});
    };

    openRequest.onsuccess = function(event) {
      module.db = (event.target) ? event.target.result : event.result;
    };
  } else {
    window.alert("このブラウザではIndexed DataBase API は使えません。");
  }
};

module.add = function(key, value) {
  var db = module.db;
  var transaction = db.transaction(["mystore"], "readwrite");
  var store = transaction.objectStore("mystore");
  var request = store.put({ mykey: key, myvalue: value});

  request.onsuccess = function (event) {
    // 更新後の処理
  }
};

module.getAll = function(renderer) {
    
    var db = module.db;
    var tx = db.transaction(["mystore"], "readwrite");
    var store = tx.objectStore("mystore");

    // keyPathに対して検索をかける範囲を取得
    var range = IDBKeyRange.lowerBound(0);
    // その範囲を走査するカーソルリクエストを生成
    var cursorRequest = store.openCursor(range);
    // カーソルリクエストが成功したら...
    cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        // 注）走査すべきObjectがこれ以上無い場合
        //     result == null となります！
        if (!!result == false) return;
        // ここにvalueがくる！
        console.log(result.value);

        var li = document.createElement('li');
        li.innerHTML = result.value.mykey + ':' + result.value.myvalue;
        document.getElementById("result").appendChild(li);

        // カーソルを一個ずらす
        result.continue();
    }
    // カーソルリクエストが失敗したら...
    cursorRequest.onerror = function(err) {
        console.log("XXX3", err);
    }
};
