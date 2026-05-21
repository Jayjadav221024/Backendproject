const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { genrateToken } = require("../utils/genrateToken");

module.exports.registeruser = async function (req, res) {
  try {
    let { email, password, fullname } = req.body;

    let user = await userModel.findOne({ email: email });
    if (user) return res.status(401).send("user alredy exsist");

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            email,
            fullname,
            password: hash,
          });
          let token = genrateToken(user);
          res.cookie("token",token);
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
 if (!user) {
   req.flash("error", "Email or Password incorrect");
   return res.redirect("/");
}
  

  bcrypt.compare(password,user.password,function(err,result){
    if(result){
    let token =   genrateToken(user);
    res.cookie('token',token);
    return res.redirect('/shop')
    }
    else{
      req.flash("error", "Password wrong");
      return res.redirect("/");
    }
  });

};

module.exports.logoutuser = async function(req,res) {
   res.cookie('token',"");
   res.redirect('/');
};