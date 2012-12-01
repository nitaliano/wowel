var mongoose = require('mongoose/')
 ,  ChatHistoryModel = require('./ChatHistoryModel.js');
 
 var addMsg = function(msgObj){
 	new ChatHistoryModel({
 		userid : msgObj.userId, 
 		msg : msgObj.msg,
 		timestamp : msgObj.timestamp
 	}).save();
 }
 
 var getHistory = function(callback){
 	ChatHistoryModel.find(function(err, msgs){
 		callback(msgs);
 	});
 }
  
 exports.addMsg = addMsg;
 exports.getHistory = getHistory;