const Joi = require("joi");
//const contacts = require("../models/contacts");//json
const Contact = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
})
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

 const getAll = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
}
  const getById = async (req, res) => {
     const { contactId } = req.params;
    // const result = await Contact.findOne({ _id: contactId });//пошук по всему крім id
    const result = await Contact.findById(contactId);//пошук по id 
     if (!result) {
      throw HttpError(404, "Not found");
     }
     res.json(result)
 }
 const add = async (req, res) => {
     const { error } = addSchema.validate(req.body);
     if (error) {
       throw HttpError(400, error.message);
     }
     const result = await Contact.create(req.body);
     res.status(201).json(result);//join  перевіряє тіло запиту, mohgoose перевіряє те що ми зберігаємо в базі
 }
 const deleteById = async (req, res) => {
     const { contactId } = req.params;
     const result = await Contact.findByIdAndRemove(contactId);
     if (!result) {
       throw HttpError(404, "Not found");
     }
     res.json({
       message:"contact deleted"
     })
 }
 const updateById = async (req, res) => {
     const { error } = addSchema.validate(req.body);
     if (error) {
       throw HttpError(400, error.message);
     }
     const {contactId } = req.params;
     const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
     if (!result) {
       throw HttpError(404, "Not found");
     }
     res.json(result);
}
 const updateFavorite = async (req, res) => {
     const { error } = updateFavoriteSchema.validate(req.body);
     if (error) {
       throw HttpError(400, error.message);
     }
     const {contactId } = req.params;
     const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
     if (!result) {
       throw HttpError(404, "Not found");
     }
     res.json(result);
 }
module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById), 
    add: ctrlWrapper(add),
    deleteById: ctrlWrapper(deleteById),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
 }