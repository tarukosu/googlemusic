$(function(){
    var url="tvapi";
    function sendKey(key){
	$.ajax({
	    url: url,
	    cache:false,
	    data: {
		button: key
	    }
	});
    }
    $("#power").click(function(){
	//sendKey("KEY_POWER");
    });

    $("button").click(function(){
	//alert(this.value);
	sendKey(this.value);
    });
    

});
