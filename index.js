// パス追加
//require.paths.push('/Users/hoge/lib/node');
var exec = require('child_process').exec;
var child_process = require('child_process');
// express
var express = require('express');
//var server = express.createServer();
var server = express();
var favicon = require('serve-favicon');

var zerorpc = require("zerorpc");
var __ = require("underscore");

var client = new zerorpc.Client();
//client.connect("tcp://127.0.0.1:4242");




// テンプレートエンジンejsの設定
var ejs = require('ejs');
server.set('view engine', 'ejs');
server.set('view options', { layout: false });
server.set('views', __dirname + '/views/page');
server.use(express.static(__dirname + '/public'));
server.use('/bower_components',  express.static(__dirname + '/bower_components'));
server.use(favicon(__dirname + '/public/img/favicon.png'));

// ポート指定
var port = 8125;
var playlists = [];

process.stdin.resume();


exec('pkill vlc', function(err, stdout, stderr){
	console.log("pkill vlc");
});


/*
var child_p = exec('python /home/yusuke/git/googlemusic/googlemusic.py', function(err, stdout, stderr){
	console.log("start python");
    console.log(err);
    console.log(stdout);
});
*/


var child_p = child_process.spawn('python' ,['\/home\/yusuke\/git\/googlemusic\/googlemusic.py']);

setTimeout(() => {
    client.connect("tcp://127.0.0.1:4242");
    console.log("connect to music api");
}, 5000);

process.on('SIGINT', function () {
    console.log("kill");
    child_p.kill('SIGINT');

    exec('pkill vlc', function(err, stdout, stderr){
	console.log("pkill vlc");
    });

    process.exit();
});


// http://127.0.0.1:8124/にアクセス時の処理
server.get('/', function(req, res){
    client.invoke("getPlaylists", function(error, response, more) {
	console.log(error);
	exec('amixer get PCM  | grep "Left" | grep "dB" | sed -e "s/^.*\\[\\(.*\\)\\%].*$/\\1/"', function(err, stdout, stderr){
	    volume = stdout;
	    //console.log(volume);
	    playlists = response;
	    console.log(response);
	    //console.log(response);
	    res.render('music.ejs', {items: response, volume: volume});
	});
    });
    // 描画

});


function sendButton(button){
    exec('irsend SEND_ONCE panasonic_tv.conf ' + button, function(err, stdout, stderr){
	console.log("executed");
    });
}

server.get('/musicapi', function(req, res){
    var action = req.query.action;
    if(action == "playlist"){
	var index = req.query.index;
	var shuffle = req.query.shuffle;
	console.log("shuffle");
	console.log(shuffle);
	console.log(playlists);
	var tracks = playlists[index]["tracks"];
	if(shuffle == "true"){
	    tracks = __.shuffle(tracks);
	    console.log("シャッフルします");
	}
	console.log(index);

	client.invoke("setMusicList", tracks);
	client.invoke("playMusic", function(error, response, more) {
	    console.log(response);
	});

    }else if(action == "play"){
	var command = req.query.command;
	console.log(command);
	if(command == "stop"){
	    client.invoke("stopMusic");
	}else if(command == "play"){
	    client.invoke("playMusic");
	}else if(command == "next"){
	    client.invoke("playNext");
	}else if(command == "prev"){
	    client.invoke("playPrev");
	}
    }else if(action == "volume"){
	var volume = req.query.volume;
	console.log(volume);
	exec('amixer set PCM ' + volume + '%', function(err, stdout, stderr){
	    console.log(stdout);
	});
    }else{
	key = req.query.button;
	console.log(key);
	if(key == "play"){
	    client.invoke("playMusic", function(error, response, more) {
		console.log(response);
	    });
	}else if(key== "stop"){
	    client.invoke("stopMusic", function(error, response, more) {
		console.log(response);
	    });

	}else{
	    sendButton(key)
	}
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: 200 }));
    res.end();
});

// サーバ起動
server.listen(port);
