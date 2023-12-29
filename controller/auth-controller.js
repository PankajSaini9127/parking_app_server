const db = require("../connection/conn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const MailGen = require("mailgen");

require("dotenv").config();

let jwt_key = process.env.SECURE_KEY;



async function register(req, res) {
  try {

    
    req.body.email = req.body.email.toLowerCase().trim();
    const doseEmail = await db("users")
      .select("email")
      .where({ email: req.body.email });

    if (doseEmail.length > 0) {
      return res
        .status(203)
        .send({ status: 203, message: "Email Already Resgister!" });
    }

    //hash password
    let password = req.body.password;

    let salt = await bcrypt.genSalt(10);

    const securePassword = await bcrypt.hash(password, salt);

    req.body.password = securePassword;

    
    delete req.body.cPassword;

    const response = await db("users").insert(req.body);

    if (response) {
      return res
        .status(200)
        .send({ status: 200, message: "User Register Successfully." });
    }
  } catch (error) {
    console.log("error while calling Register API", error);
    return res
      .status(500)
      .send({ success: false, message: `Internal Server Error`, data: error });
  }
}

async function login(req, res) {
  try {
    req.body.email = req.body.email.toLowerCase().trim();

    const doseEmail = await db("users")
      .select("email")
      .where({ email: req.body.email });
    if (doseEmail.length === 0) {
      return res.status(203).send({ status: 203, message: "Invalid creds." });
    }

    const response = await db
      .from("users")
      .select("*")
      .where({ email: req.body.email });

    if (response) {
      const match = await bcrypt.compare(
        req.body.password,
        response[0].password
      );

      if (match) {
        delete response[0].password;
        let jwtPayload = response[0];

        await jwt.sign({ jwtPayload }, jwt_key, (err, token) => {
          if (!err) {
            return res.send({
              status: 200,
              message: "Login Successful.",
              data: { ...response[0] },
              authToken: token,
            });
          }
        });
      } else {
        return res.status(203).send({
          status: 203,
          message: "Invalid Creds.",
        });
      }
    }
  } catch (error) {
    console.log("error while calling Login API", error);
    return res
      .status(500)
      .send({ success: false, message: `Internal Server Error`, data: error });
  }
}

async function forgotPassword(req, res) {
  try {
    req.query.email = req.query.email.toLowerCase().trim();
    const doseEmail = await db("users")
      .select("email", "name")
      .where({ email: req.query.email });

    if (doseEmail.length === 0) {
      return res.status(203).send({ status: 203, message: "Invalid Email." });
    }

    const sentMail = await sendMail(doseEmail);

    if(sendMail){
      return res.send({status:200,message:"Password Reset Mail Sent On Register Email!"})
    }
  } catch (error) {
    console.log("error while calling Login API", error);
    return res
      .status(500)
      .send({ success: false, message: `Internal Server Error`, data: error });
  }
}

async function resetPassword(req, res) {
  try {
    req.body.email = req.body.email.toLowerCase().trim();
    const doseEmail = await db("users")
      .select("email", "name")
      .where({ email: req.body.email });

    if (doseEmail.length === 0) {
      return res.status(203).send({ status: 203, message: "Invalid Email." });
    }

    //hash password
    let password = req.body.password;

    let salt = await bcrypt.genSalt(10);

    const securePassword = await bcrypt.hash(password, salt);

    req.body.password = securePassword;

    const response = await db("users").update({password:req.body.password}).where('email','=',req.body.email);
    console.log(response)
    if (response) {
      return res
        .status(200)
        .send({ status: 200, message: "Password Reset Successfully" });
    }

  } catch (error) {
    console.log("error while calling Login API", error);
    return res
      .status(500)
      .send({ success: false, message: `Internal Server Error`, data: error });
  }
}

const sendMail = async (user) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const mailGenerator = new MailGen({
    product: {
      name: "Parking Booking App",
      dec: "India's Largest Load Distributer",
      link: process.env.FRONTEND_URL,
      copyright: "Copyright © 2023 Parking Booking App. All rights reserved.",
    },
  });
  const response = {
    body: {
      name: user[0].name,
      intro:
        "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC4D2F",
          text: "Reset your password",
          link: `${process.env.FRONTEND_URL}/reset-password/email=${user[0].email}`,
        },
      },
      outro:
        "If you did not request a password reset, no further action is required on your part.",
    },
  };

  const mail = await mailGenerator.generate(response);

  const message = {
    from: process.env.USER_EMAIL, // sender address
    to: user[0].email, // list of receivers
    subject: "Reset Password", // Subject line
    html: mail,
  };

  const info = await transporter.sendMail(message);

  console.log(info);
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
