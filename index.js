// パス追加
//require.paths.push('/Users/hoge/lib/node');
var exec = require('child_process').exec;
// express
var express = require('express');
//var server = express.createServer();
var server = express();
var favicon = require('serve-favicon');

// テンプレートエンジンejsの設定
var ejs = require('ejs');
server.set('view engine', 'ejs');
server.set('view options', { layout: false });
server.set('views', __dirname + '/views/page');
server.use(express.static(__dirname + '/public'));
server.use('/bower_components',  express.static(__dirname + '/bower_components'));
server.use(favicon(__dirname + '/public/img/favicon.png'));

// ポート指定
var port = 8124;

// http://127.0.0.1:8124/にアクセス時の処理
server.get('/', function(req, res){
    // 描画
    var companies=["NHK総合", "NHKEテレ","TVK","日テレ", "テレ朝", "TBS", "テレビ東京","フジテレビ","　","　","　","放送大学"];
    var items = [];
    for(var i=1; i<=12; i++){
	if(9 <= i && i<= 11){
	    continue;
	}
	var value;
	if(i<10){
	    value="KEY_" + i;
	}else{
	    value="KEY_F" + i;
	}
	
	items[items.length]={num: i + "<br/>" + companies[i-1], value: value};
    }
	
    res.render('tv.ejs', {items: items});
});

function sendButton(button){
    exec('irsend SEND_ONCE panasonic_tv.conf ' + button, function(err, stdout, stderr){
	console.log("executed");
    });
}

server.get('/tvapi', function(req, res){
    key = req.query.button
    console.log(key)
    if(key == "TV_MODE"){
	sendButton("KEY_MODE")
	sendButton("KEY_1")
    }else if(key =="HDMI_MODE"){
	sendButton("KEY_MODE")
	sendButton("KEY_4")
    }else{
	sendButton(key)
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: 200 }));
    res.end();
});

// サーバ起動
server.listen(port);
