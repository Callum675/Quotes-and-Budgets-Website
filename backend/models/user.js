const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quotes: [{ type : mongoose.Schema.Types.ObjectId, ref: 'Quote' }],
});

module.exports = mongoose.model('User', UserSchema);