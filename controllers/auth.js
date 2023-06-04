const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../models/users");
const { HttpError, ctrlWrapper } = require("../helpers");
//const { patch } = require("../app");
const { SECRET_KEY } = process.env;

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

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password  invalid");
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
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}