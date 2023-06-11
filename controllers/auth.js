const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const { User } = require("../models/users");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
//const { patch } = require("../app");
const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, "../", "public", "avatars");

 
const register = async (req, res) => {
    //перед тим як зареєстр перевіримо в базі чи є вже людина з таким мейлом
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //якщо є то викидаємо унікальний меседж
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationCode = nanoid();

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode });
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}>"Click verify email</a>`
    }; 

    await sendEmail(verifyEmail);

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
}

const verifyEmail = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" });

    res.json({
         message: 'Verification successful',
    })
}
 
const resendVerifyEmail = async (req, res) => {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found");
    } 
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationCode}>"Click verify email</a>`
    }; 
    await sendEmail(verifyEmail);
    res.json({
        message: "Verification email sent"
    })

}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password  invalid");
    }
    if (!user.verify) {
        throw HttpError(401, "Email not verified");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);//той що прийшов звіряємо із захешованим в базі
    if (!passwordCompare) {
    throw HttpError(401, "Email or password  invalid");
    }

    const payload={
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
    })
}  

const getCurrent = async (req, res) => {
    const { email} = req.user; // const { email, name } = req.user;
    res.json({
        email,
        //name,
    })
    
}
const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.json({
        message: "Logout succsess"
    })
}

const updateSubscription = async (req, res) => {
    //console.log(req.params);
    const { id } = req.params;
    const result = await User.findByIdAndUpdate(id, req.body, {new: true});
     if (!result) {
       throw HttpError(404, "Not found");
     }
     res.json(result);
 }

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultUpload);

     Jimp.read(resultUpload, (err, image) => {
        if (err) throw err;
         image
             .resize(250, 250)
             .write(resultUpload);
    });
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}


module.exports={
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),

    updateAvatar: ctrlWrapper(updateAvatar),

}