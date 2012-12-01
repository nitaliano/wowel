var express = require('express')
 ,  app = express()
 ,	server = require('http').createServer(app)
 ,  io = require('socket.io').listen(server);
 
var  url = require('url')
 , http = require('http')
 , path = require('path');
  
var loginRoute = require('./routes/login')
 , indexRoute = require('./routes/index')
 , userRoute = require('./routes/user');

// var siteUrl = "ec2-50-17-29-137.compute-1.amazonaws.com";
var siteUrl = "localhost";

var mongoose = require('mongoose/')
 ,  db = mongoose.connect(siteUrl + '/userDb'); 

var user = require('./models/User.js')
 ,  chatHistory = require('./models/ChatHistory.js');

mongoose.connection.on('error',function(err){
	console.log(err);
}); 


server.listen(80);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', loginRoute.login);
app.get('/login', loginRoute.login);
app.get('/index', indexRoute.index);
app.get('/users', userRoute.list);

 var registerSocket = io
 	.of('/register')
 	.on('connection', function(socket){
 		
 		socket.on('register', function(regObj){
 			console.log(regObj.email + " " + regObj.password + " " + regObj.name);
 			
 			
 			user.isExistingUser( regObj, function(err, userCount){
 				if(userCount == 0){
 					user.addUser(regObj);
 					socket.emit('redirect', {
 						userId : regObj.email,
 						url : 'index/?u=' + regObj.email
 					});
 				}
 			});
 			
 		});
 		
 	});
 
 
 var loginSocket = io
 	.of('/login')
 	.on('connection', function(socket){
 		
 		socket.on('login', function(loginObj){
 			console.log(loginObj.email + "  " + loginObj.password);
 			
 			user.isExistingUser(loginObj, function(err, userCount){
 				if(userCount == 1){
 					socket.emit('redirect', {
 						userId : loginObj.email,
 						url : 'index/?u=' + loginObj.email
 					});
 				}
 			});
 		});
 		
 	});
 
 var indexSocket = io
 	.of('/index')
 	.on('connection', function(socket){
 		console.log('SS : User Connected');
 		
 		chatHistory.getHistory(function(cmsgs){
 			
 			console.log(cmsgs);
 			
 			socket.emit('history',{
 				msgs :  cmsgs
 			});
 			
 		});
 	
 		socket.on('message', function(msgObj){
 			console.log(msgObj);
 			console.log('SS : Message from client ' + msgObj.userId);
 			chatHistory.addMsg(msgObj);
 			
 			var htmlString ="<li class='chatRow'>";
			htmlString += "<ul class='chatList'>";
			htmlString += "<li class='chatUser them'>" + msgObj.userId + "</li>";
			htmlString += "<li class='chatMsgBox them'>" + msgObj.msg + "</li>";
			htmlString += "</ul></li>";
 			
 			socket.broadcast.emit('updatemsg', htmlString);
 		});
 	
 	});