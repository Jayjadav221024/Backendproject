const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { genrateToken } = require("../utils/genrateToken");
const {registeruser,loginUser,logoutuser} = require('../controllers/authcontroller')

router.get("/", function (req, res) {
  res.send("hey its wroking");
});

//For Register User Router
router.post("/register",registeruser);


//For Login User Router
router.post("/login",loginUser);

//for logout user router
router.get('/logout',logoutuser);

module.exports = router;
