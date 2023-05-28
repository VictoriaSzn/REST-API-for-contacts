const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const { HttpError, ctrlWrapper } = require("../helpers");
const { SECRET_KEY } = process.env;
 
const register = async (req, res) => {
    //перед тим як зареєстр перевіримо в базі чи є вже людина з таким мейлом
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //якщо є то викидаємо унікальний меседж
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

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

module.exports={
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
}