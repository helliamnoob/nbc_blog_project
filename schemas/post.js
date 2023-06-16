const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postNum: {
        type: Number,
        required: true,

    },
    title: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    password: {
        type: Number,
        required: true,
    }

})

module.exports = mongoose.model("Posts", postSchema);