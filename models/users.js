const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");

const emailRegexp = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)([\w-]+\.)+[\w-]{2,4})?$/;
const purposeList = ["starter", "pro", "business"];

const userSchema = new Schema({
 password: {
    type: String,
    required: [true, 'Password is required'],
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
    token: {
    type: String,
    default: null,

  },
  avatarURL: {
    type: String,
    required: true,

  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    default:""
  },
  // verificationToken: {
  //   type: String,
  //   required: [true, 'Verify token is required'],
  // },
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string().valid(...purposeList),
    //token: Joi.string().required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    //token: Joi.string().required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid(...purposeList).required(),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  subscriptionSchema,
}
const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}