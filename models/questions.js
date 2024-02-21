const mongoose = require("mongoose")
const Schema = mongoose.Schema

const questionsSchema = new Schema({
    optionA: {
        type: String,
        required: true,
    },
    optionB: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    likedOptionA: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    likedOptionB: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

})

module.exports = mongoose.model("Questions", questionsSchema)
