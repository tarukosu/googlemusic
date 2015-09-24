$(function(){
    var url="musicapi";
    function sendKey(key){
	$.ajax({
	    url: url,
	    cache:false,
	    data: {
		button: key
	    }
	});
    }

    function playList(index, shuffle){
	$.ajax({
	    url: url,
	    cache:false,
	    data: {
		action: "playlist",
		index: index,
		shuffle: shuffle
	    }
	});
    }

    function play(command){
	$.ajax({
	    url: url,
	    cache:false,
	    data: {
		action: "play",
		command: command
	    }
	});
    }

    function volume(volume){
	$.ajax({
	    url: url,
	    cache:false,
	    data: {
		action: "volume",
		volume: volume
	    }
	});
    }


    $(".normalplay").click(function(){
	playList(this.value, false);
    });

    $(".randomplay").click(function(){
	playList(this.value, true);
    });

    $(".stop").click(function(){
	play("stop");
    });

    $(".play").click(function(){
	play(this.value);
    });

    $('#volume').slider().on('slide', function(e) {
	volume(e.value);
	console.log(e.value);
    });

    /*
    $("button").click(function(){
	//alert(this.value);
	sendKey(this.value);
    });
    */
});
