var mongoose = require('mongoose/');

var userSchema = new mongoose.Schema({	
		email : { type: String, unique : true, index : true },
		password : String,
		name : String
}); 

module.exports = mongoose.model('User', userSchema);