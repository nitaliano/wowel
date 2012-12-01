//var siteUrl = "ec2-50-19-168-11.compute-1.amazonaws.com";
var siteUrl = "localhost";

var Login = function(email, password){
	this.email = email;
	this.password = password;
};

Login.prototype.isElementEmpty = function(ele){
	if(ele == null || $.trim(ele).length == 0)
		return true;
		
	return false;
};

Login.prototype.areFormElementsEmpty = function(){
	if(this.isElementEmpty(this.email))
		return true;
	if(this.isElementEmpty(this.password))
		return true;

	return false;
};

var Registration = function(email, password, confirmPassword, name){
	this.email = email;
	this.password = password;
	this.confirmPassword = confirmPassword;
	this.name = name;
};

Registration.prototype.arePasswordsMatching = function(){

	if(!this.areFormElementsEmpty())
		if(this.password == this.confirmPassword)
			return true;

	return false;
};

Registration.prototype.isJustWhiteSpaces = function(ele){

	if($.trim(ele).length == 0)
		return true;

	return false;
};

Registration.prototype.areFormElementsEmpty = function(){

	if(this.email == null || this.password == null || this.confirmPassword == null || this.name == null){
		// do front end stuff
	} else {

		if(this.isJustWhiteSpaces(this.email)){
			// do front end stuff
			return true;
		}
		if(this.isJustWhiteSpaces(this.password)){
			// do front end stuff
			return true;
		}
		if(this.isJustWhiteSpaces(this.confirmPassword)){
			// do front end stuff
			return true;
		}
		if(this.isJustWhiteSpaces(this.name)){
			// do front end stuff
			return true;
		}	

		return false;
	}

};

$(function(){
	
	$(".login-btn").click(function(){
		var login = new Login( $(".login-email").val(), $(".login-pw").val());
		
		if(!login.areFormElementsEmpty()){
		
			var socket = io.connect('http://' + siteUrl + '/login');
			
			socket.emit('login', {
				email : login.email,
				password : login.password
			});
			
			socket.on('redirect', function(data){
				sessionStorage.setItem('userId', data.userId);
				window.location.href = data.url;
			});
		}
		
	});
	
	
	$(".registration-btn").click(function(){
		var registration = new Registration($('.registration-email').val(), $('.registration-pw').val(), $('.registration-cpw').val(), $('.registration-name').val());
		
		if(!registration.areFormElementsEmpty() && registration.arePasswordsMatching()){
		
			var socket = io.connect('http://' + siteUrl + '/register');
			
			socket.emit('register', {
				email : $('.registration-email').val(),
				password : $('.registration-pw').val(),
				name : $('.registration-name').val()
			});
			
			socket.on('redirect', function(data){
				sessionStorage.setItem('userId', data.userId);
				window.location.href = data.url;
			});
			
		}
		
	});
	
});