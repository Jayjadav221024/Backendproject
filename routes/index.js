const express  = require('express');
const router = express.Router();
const isLoggedin = require('../middleware/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', function(req, res) {
    res.render('index',{loggedin : false});
});

router.get('/shop',isLoggedin,async function(req,res){
      let products = await productModel.find();
    res.render('shop',{ products })
})

router.get('/cart',isLoggedin,async function(req,res){
 let user =    await userModel.findOne({email:req.user.email}).populate('cart');
  res.render('cart',{user});
})

router.get('/addtocart/:productid',isLoggedin,async function(req,res){
let user =  await  userModel.findOne({email:req.user.email})
 user.cart.push(req.params.productid);
 await user.save();
 req.flash('success' , 'added to cart');
 res.redirect('/shop');
})

router.get('/logout',isLoggedin,async function(req,res){
   res.cookie("token", "");
    res.redirect("/login");
})

module.exports = router;