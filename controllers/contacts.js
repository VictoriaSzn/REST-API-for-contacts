const {Contact} = require("../models/contact");
const { HttpError, ctrlWrapper} = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  //console.log(req.query);
  //const { favorite = true} = req.query;
  const { page = 1, limit = 20, favorite } = req.query;//параметри запросу
  const skip = (page - 1) * limit; 
  const result = await Contact.find({ owner, favorite}, "name phone favorite", { skip, limit }).populate("owner", "name phone"); //Contact.find({}," -favorite -updatedAt");
    res.json(result);
}
  const getById = async (req, res) => {
     const { contactId } = req.params;
    // const result = await Contact.findOne({ _id: contactId });//пошук по всему крім id
    const result = await Contact.findById(contactId);//пошук по id 
     if (!result) {
      throw HttpError(404, "Not found");
     }
    res.json(result);
 }
const add = async (req, res) => {
  //console.log(req.user);
   const { _id: owner } = req.user;
   const result = await Contact.create({ ...req.body, owner });
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
     const {contactId } = req.params;
     const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
     if (!result) {
       throw HttpError(404, "Not found");
     }
     res.json(result);
}
 const updateFavorite = async (req, res) => {
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