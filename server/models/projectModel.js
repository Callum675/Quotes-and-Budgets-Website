const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Project', LocationSchema);