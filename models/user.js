import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = mongoose.Schema;

// creating a schema for user model
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// plugin adds: username, hash, salt, and auth methods
userSchema.plugin(passportLocalMongoose.default);

const User = mongoose.model("User", userSchema);
export default User;
