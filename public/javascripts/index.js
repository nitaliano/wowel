$(function(){
	console.log(sessionStorage.getItem('userId'));
	
	//var siteUrl = "ec2-50-19-168-11.compute-1.amazonaws.com";
	var siteUrl = "localhost";
	
	var socket = io.connect('http://' + siteUrl + '/index');
	socket.on('connect',function(data){
		console.log("User connected");
	});
	
	socket.on('history', function(msgs){
		
		var htmlString = "";
		
		for(var i = 0 ; i < msgs['msgs'].length; i++){
				console.log(msgs);
			
				if( sessionStorage.getItem('userId') == msgs['msgs'][i]['userid'] ){
					htmlString += "<li class='chatRow'>";
					htmlString += "<ul class='chatList'>";
					htmlString += "<li class='chatUser me'>" + msgs['msgs'][i]['userid'] + "</li>";
					htmlString += "<li class='chatMsgBox me'>" + msgs['msgs'][i]['msg']  + "</li>";
					htmlString += "</ul></li>";
				} else {
					htmlString += "<li class='chatRow'>";
					htmlString += "<ul class='chatList'>";
					htmlString += "<li class='chatUser them'>" + msgs['msgs'][i]['userid'] + "</li>";
					htmlString += "<li class='chatMsgBox them'>" + msgs['msgs'][i]['msg'] + "</li>";
					htmlString += "</ul></li>";
				}					
			
		}
		
		$("#mainList").append(htmlString); 
		
	});
	
	socket.on('updatemsg', function(msg){
		$("#mainList").append(msg);
	});
	
	$('#myBtn').click(function(){
		
		console.log("Client-Side this is my msg " + $('#myMsg').val());
		
		var curDate = new Date();
		
		console.log(curDate);
		
		var htmlString = "<li class='chatRow'>";
				htmlString += "<ul class='chatList'>";
				htmlString += "<li class='chatUser me'>" + sessionStorage.getItem('userId') + "</li>";
				htmlString += "<li class='chatMsgBox me'>" + $('#myMsg').val() + "</li>";
				htmlString += "</ul></li>";
		
		$("#mainList").append(htmlString);
		
		socket.emit('message', {
			userId : sessionStorage.getItem('userId'),
			msg : $('#myMsg').val(),
			timestamp : String(curDate)
		});
		
	});
	
});