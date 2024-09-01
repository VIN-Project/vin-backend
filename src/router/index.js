const express = require("express");
const { signup, login, socialLogin } = require("../controller/user.controller");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/social-login", socialLogin); 

module.exports = router;
