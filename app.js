
const express = require("express");
require('dotenv').config();

const app = express();
const usermodel = require("./models/user-model");
const ownerModel = require('./models/owner-model');
const bcrypt = require("bcrypt");
const db = require('./config/mongoose-connection')
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
// const multerconfig  = require('./config/multerconfig');
const upload = require("./config/multerconfig");
const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const userRouter = require('./routes/userRouter')
const expresssesion = require('express-session');
const flash = require('connect-flash');
const indexRouter = require('./routes/index');

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















// app.get("/test", function (req, res) {
//   res.render("test");
// });
app.use(
    expresssesion({
        resave:false,
        saveUninitialized:false,
        secret:process.env.EXPRESS_SESSION_SECRET,
    })
)

app.use(express.static("public"));
app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash("success");
    next();
});
app.use('/', indexRouter);
app.use('/owners',ownersRouter);
app.use('/products',productsRouter);
app.use('/users',userRouter);




// app.post("/upload",upload.single('image'), function (req, res) {
//   console.log(req.file);
// });






function isLoggedin(req, res, next) {
  if (req.cookies.token === "") res.redirect("/login");
  else {
    let data = jwt.verify(req.cookies.token, "shhhh");
    req.user = data;
    next();
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
