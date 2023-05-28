const express = require('express');
const {schemas} = require("../../models/users");
const { validateBody, authenticate } = require("../../middlewares");

const ctrl = require("../../controllers/auth");

const router = express.Router();

//signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register); 
//signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login); 

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch('/:id/subscription', authenticate, validateBody(schemas.subscriptionSchema),ctrl.updateSubscription);
module.exports = router;