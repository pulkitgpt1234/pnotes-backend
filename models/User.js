const mongoose = require("mongoose");
const { Schema } = mongoose;
//mongoose provides abstraction layer on top of mongo db so that we don't have to worry about the internal process of pushing data in db and 
//we make schema(logical representation) and things are handled by mongoose easily.
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);

