const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	name: { type: String, required: true },
});

module.exports = mongoose.model('Quote', LocationSchema);