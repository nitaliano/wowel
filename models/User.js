var mongoose = require('mongoose/')
 ,  UserModel = require('./UserModel.js');

var addUser = function(userObj){
	new UserModel({
		email : userObj.email,
		password : userObj.password,
		name : userObj.name
	}).save();
}
 
 var isExistingUser = function(userObj, callback){
 	UserModel.count({ email : userObj.email }, function(err, count){
 		callback(err, !! count);
 	});
 }
 
 var listUsers = function(){
 	UserModel.find(function(err, users){
 		console.log(users);
 	});
 }
 
 exports.isExistingUser = isExistingUser;
 exports.listUsers = listUsers;
 exports.addUser = addUser;