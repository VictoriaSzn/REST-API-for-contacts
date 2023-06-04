const express = require('express');
const ctrl = require("../../controllers/contacts");
const {schemas} = require("../../models/contact");
const {validateBody, isValidId, authenticate} = require("../../middlewares")

const router = express.Router();

router.get('/', authenticate, ctrl.getAll);

 router.get('/:contactId', authenticate, isValidId, ctrl.getById);

 router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete('/:contactId', authenticate, isValidId, ctrl.deleteById);

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateById);
//редагує поле назву якого ви не знаєте

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema),ctrl.updateFavorite);
//редагує поле назву якого ви точно знаєте

module.exports = router;
