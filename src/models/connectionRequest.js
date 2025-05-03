const mongoose = require('mongoose');

const ConnectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        // this is just a string no need to import User model 
        // as mongoose will take care of it by tracking all the models globally
        // basically moongoose tracks all the models globally and this is just string
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['ignored', 'interested', 'accepted', 'rejected'],
        required: true
    },
}, { timestamps: true });

const connectionRequestModel = mongoose.model('ConnectionRequest', ConnectionRequestSchema);
module.exports = connectionRequestModel;
// ConnectionRequest is name of the model 