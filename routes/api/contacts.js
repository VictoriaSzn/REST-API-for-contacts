const express = require('express');
const ctrl = require("../../controllers/contacts");
const {schemas} = require("../../models/contact");
const {validateBody, isValidId} = require("../../middlewares")

const router = express.Router();

router.get('/', ctrl.getAll);

 router.get('/:contactId', isValidId, ctrl.getById);

 router.post('/', validateBody(schemas.addSchema), ctrl.add);

router.delete('/:contactId', isValidId, ctrl.deleteById);

router.put('/:contactId', isValidId, validateBody(schemas.addSchema), ctrl.updateById);
//редагує поле назву якого ви не знаєте
router.patch('/:contactId/favorite', isValidId, validateBody(schemas.updateFavoriteSchema),ctrl.updateFavorite);
//редагує поле назву якого ви точно знаєте
module.exports = router;
