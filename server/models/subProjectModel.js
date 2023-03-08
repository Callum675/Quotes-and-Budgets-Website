const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
	_id: { 
		type: mongoose.Schema.Types.ObjectId, 
		auto: true,
	},
	project: [
		{ 
			type : mongoose.Schema.Types.ObjectId, 
			ref: 'Project'
		},
	],
	value: {
		type: String, 
		required: true, 
	},
},
{
	timestamps: true,
}
);

module.exports = mongoose.model('Sub', LocationSchema);