const mongoose = require('mongoose');


mongoose.connection.on("error", err => {
    console.error("몽고디비 연결 에러", err);
});

const connect = async () => {
    await mongoose
    .connect("mongodb://127.0.0.1:27017/mongodb_prac",{ connectTimeoutMS: 20000 })
    .then(() => console.log('몽고디비 연결!'))
    .catch(err => console.log(err));
};

module.exports = connect;