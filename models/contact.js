const { Schema, model } = require("mongoose");
const { handleMongooseError } = require("../helpers");
const Joi = require("joi");
//joi перевіряє тіло запиту а монгуз те що зберігаємо у базі
const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        //match: /^\d{3}-\d{3}-\d{2}-\d{2}$/,//000-000-00-00
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
}, { versionKey: false, timestamps: true });//об'єкт налаштування
//щоб замість _v(версія) писало дату створення і дату оновлення

const Contact = model("contact", contactSchema);

//методи монгузу викидають помилку без статусу і обробник помилок дає їй статус 500 а це помилка 400 тому додаємо миддлвару
contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

module.exports = {
    Contact,
    schemas,
}