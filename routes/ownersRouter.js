const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner-model");

if (process.env.NODE_ENV === "development") {
  router.post("/create", async function (req, res) {
    let owner = await ownerModel.find();
    if (owner.length > 0) {
      return res.status(503).send("you dont have permisson");
    }
    let {fullname,email,password}=req.body;


  let createdowner =  await ownerModel.create({
      fullname,
      email,
      password,
    })
    res.status(201).send(createdowner);
  });
}

router.get("/admin", function (req, res) {
  // req.flash('success');
  res.render("createproducts");
});

module.exports = router;
