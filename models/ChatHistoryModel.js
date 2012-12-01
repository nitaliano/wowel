var mongoose = require('mongoose/');

var chatHistorySchema = new mongoose.Schema({
		userid : String,
		msg : String,
		timestamp : String
}); 

module.exports = mongoose.model('ChatHistory', chatHistorySchema);