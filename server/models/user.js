const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    auto: true 
  },
	username: { 
    type: String, 
    required: true, 
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: { 
    type: String, 
    required: true,
    min: 8,
  },
  quotes: [
    { type : mongoose.Schema.Types.ObjectId, ref: 'Quote' }
  ],
});

module.exports = mongoose.model('User', UserSchema);