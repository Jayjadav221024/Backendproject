const express = require("express");
const app = express();
const usermodel = require("./models/user");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const postmodel = require("./models/post");
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
// const multerconfig  = require('./config/multerconfig');
const upload = require("./config/multerconfig");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/images/uploads')
//   },
//   filename: function (req, file, cb) {
//     crypto.randomBytes(12,function(err,bytes){
//       const fn = bytes.toString('hex') + path.extname(file.originalname);
//       cb(null,fn)
//     })
//   }
// })

// const upload = multer({ storage: storage })

app.get("/", function (req, res) {
  res.render("index");
});


app.get("/profile/upload", function (req, res) {
  res.render("test");
});

app.post("/upload", isLoggedin,upload.single('image'),async function (req, res) {
  let user = await  usermodel.findOne({email:req.user.email});
  user.profilepic = req.file.filename;
 await user.save();
 res.redirect('profile')
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/profile", isLoggedin, async function (req, res) {
  let user = await usermodel
    .findOne({ email: req.user.email })
    .populate("posts");
  console.log();
  res.render("profile", { user });
});

app.get("/like/:id", isLoggedin, async function (req, res) {
  let post = await postmodel.findOne({ _id: req.params.id }).populate("user");
  if (post.likes.indexOf(req.user.userid) === -1) {
    post.likes.push(req.user.userid);
  } else {
    post.likes.splice(post.likes.indexOf(req.user.userid), 1);
  }
  await post.save();
  res.redirect("/profile");
});

app.get("/edit/:id", isLoggedin, async function (req, res) {
  let post = await postmodel.findOne({ _id: req.params.id }).populate("user");
  res.render('edit',{post})
});

// app.get("/test", function (req, res) {
//   res.render("test");
// });

// app.post("/upload",upload.single('image'), function (req, res) {
//   console.log(req.file);
// });


app.post("/update/:id", isLoggedin, async function (req, res) {
  let post = await postmodel.findOneAndUpdate({_id: req.params.id },{content:req.body.content});
  res.redirect('/profile')
});

app.post("/post", isLoggedin, async function (req, res) {
  let user = await usermodel.findOne({ email: req.user.email });
  let { content } = req.body;
  let post = await postmodel.create({
    user: user._id,
    content,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("profile");
});

app.post("/register", async function (req, res) {
  let { email, password, name, username, age } = req.body;
  let user = await usermodel.findOne({ email });
  if (user) return res.status(300).send("user already register");
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      let user = await usermodel.create({
        username,
        email,
        age,
        name,
        password: hash,
      });
      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);
      res.send("register");
    });
  });
});

app.post("/login", async function (req, res) {
  let { email, password } = req.body;
  let user = await usermodel.findOne({ email });
  if (!user) return res.status(500).send("something went wrong");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
      res.cookie("token", token);
      res.status(200).redirect("profile");
    } else res.redirect("/login");
  });
});

app.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.render("login");
});

function isLoggedin(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  }
}

app.listen(3000);
