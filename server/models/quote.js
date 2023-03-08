const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
	_id: { 
		type: mongoose.Schema.Types.ObjectId, 
		auto: true,
	},
	name: { 
		type: String, 
		required: true, 
	},
	value: { 
		type: String, 
		required: true, 
	},
},
{
	timestamps: true,
}
);

module.exports = mongoose.model('Quote', LocationSchema);