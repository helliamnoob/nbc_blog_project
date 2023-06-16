const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    number: {
        type:Number,
    },
    name: {
        type:String,
        required: true,
    },
    text: {
        type:String,
        required: true,
    },
    password: {
        type:Number,
        required: true,
    }

})

module.exports = mongoose.model("Comments", commentSchema);