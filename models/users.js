const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)([\w-]+\.)+[\w-]{2,4})?$/;
const purposeList = ["starter", "pro", "business"];

const userSchema = new Schema({
 password: {
    type: String,
    required: [true, 'Set password for user'],
    minlength:6,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: emailRegexp,
  },
  subscription: {
    type: String,
    enum: purposeList,
    default: "starter"
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: String
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string().validate(...purposeList),
    //token: Joi.string().required(),
});

const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
  
    //token: Joi.string().required(),
});

const schemas = {
    registerSchema,
    loginSchema,
}
const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}