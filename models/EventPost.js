const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//Create EventPost Schema for admin
const EventPostSchema= new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'

    },
    eventName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    interested: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    going: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }]
});

module.exports= EventPosts= mongoose.model('EventPost', EventPostSchema);
