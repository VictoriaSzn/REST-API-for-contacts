const express = require('express');
const {schemas} = require("../../models/users");

const { validateBody, authenticate, upload } = require("../../middlewares");


const ctrl = require("../../controllers/auth");

const router = express.Router();

//signup
router.post("/register", validateBody(schemas.registerSchema), ctrl.register); 

router.get("/verify/:verificationCode", ctrl.verifyEmail);

router.post("/verify", validateBody(schemas.emailSchema), ctrl.resendVerifyEmail);
//signin
router.post("/login", validateBody(schemas.loginSchema), ctrl.login); 

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch('/:id/subscription', authenticate, validateBody(schemas.subscriptionSchema),ctrl.updateSubscription);


router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.updateAvatar);


module.exports = router;