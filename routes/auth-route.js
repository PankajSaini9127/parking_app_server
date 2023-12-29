const express = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controller/auth-controller");

const router = express.Router();


//register route
router.route("/register").post(register);

//login route
router.route('/login').post(login);

//forgot password
router.route('/forgot-password').post(forgotPassword)

//reset password
router.route('/reset-password').post(resetPassword)


module.exports = router;