const mongoose = require("mongoose");
// const URI = 'mongodb+srv://admin:admin123456@meterantest-kda09.azure.mongodb.net/meteran?retryWrites=true&w=majority'

mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect to MongoDB");
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
