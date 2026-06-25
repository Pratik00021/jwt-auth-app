const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

UserSchema.methods.matchPassword = function(entered) {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model("User", UserSchema);