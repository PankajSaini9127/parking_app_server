const JWT = require("jsonwebtoken");

require("dotenv").config();

// middleware For Authentication

const Auth = (req, res, next)=> {
  try {
  
    if (req.headers.authorization === undefined) {return res.sendStatus(401);}
  
    let token = req.headers.authorization.split("Bearer ")[1];
  
    JWT.verify(token, process.env.SECURE_KEY, (err, user) => {
      if (err) return res.status(203).send({message:"Access Denied! Please Login.",status:203});
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({status:500,message:"Something Went Wrong !"});
  }

  };

  module.exports = Auth;