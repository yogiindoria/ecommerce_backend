require('dotenv').config();
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require('cookie-parser')
const productRouters = require("./routes/Products");
const brandsRouters = require("./routes/Brands");
const categoriesRouters = require("./routes/Categories");
const usersRouters = require("./routes/User");
const authRouters = require("./routes/Auth"); 
const cartRouters = require("./routes/Cart");
const ordersRouter = require("./routes/Order");

const bodyParser = require("body-parser");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());


server.use(express.static('build'))
server.use(cookieParser());
server.use(
  session({
    secret: "keyboard cat",
    resave: false, // don't save session if unmodified 
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.authenticate("session"));

// middlewares

server.use(cors({ exposedHeaders: ["X-Total-Count"] }));

server.use("/products", isAuth(), productRouters.router);
server.use("/brands", isAuth(), brandsRouters.router);
server.use("/categories", isAuth(), categoriesRouters.router);
server.use("/users", isAuth(), usersRouters.router);
server.use("/auth", authRouters.router);
server.use("/cart", isAuth(), cartRouters.router);
server.use("/orders", isAuth(), ordersRouter.router);
 
// Passport Strategies
passport.use(
  "local",
  new LocalStrategy(
    {usernameField:'email'},
    async function (email, password, done) {
    try {
      const user = await User.findOne({ email: email });
      console.log(email, user, password);
      if (!user) {
        done(null, false, { message: "invalid credentials" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
          done(null, {id:user.id, role:user.role, token});
        }
      );
    } catch (err) {
      done(err);
    } 
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({jwt_payload});
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      }else {
        return done(null, false);
      }
    } catch (err) { 
      return done(err, false)
    }  
  })
);

// This Create Session Variable req.user on being called
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const password = encodeURIComponent(process.env.PASSWORD);
main().catch((err) => console.log(err));

async function main() {  
  await mongoose.connect(
    `mongodb+srv://yogiindoria0002:${password}@cluster0.acv1zsf.mongodb.net/`
  ); 
  console.log("Database Connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});

server.listen(process.env.PORT, () => {
  console.log("Server Started");
});
    