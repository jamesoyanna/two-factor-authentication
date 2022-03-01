const app = require("express").Router();
const bcrypt = require("bcrypt");
const twofactor = require("node-2fa");
const User = require("../Models/User");


app.get("/", async (req, res) => {
  try {
    res.json({ ok: true, msg: "Hello to server" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.toString() });
  }
});

app.post("/register", async (req, res) => {
  try {
    if (!req.body?.password?.trim() || !req.body?.username?.trim()) {
      return res.status(400).json({ ok: false, msg: "Fill Proper Crendtials" });
    }
    const i = (o, ...s) => s.map((_) => o[_].trim());

    // Will Destructure the Given Data // Trimed
    const [username, password] = i(req.body, "username", "password");

    if (await User.findOne({ username })) {
      return res.status(400).json({ ok: false, msg: "User Already Exists" });
    }
    if (password < 5) {
      return res.status(400).json({ ok: false, msg: "Password must me more than 5 in length" });
    }

    const newSecret = twofactor.generateSecret({
      name: "TwoFactorAuthenticator", // The Application Name
      account: username, // Unique Identifier for User mostly used as email or username
    });
    console.log(await bcrypt.hash(password, 10));

    res.json({
      ok: true,
      status: 101, // Custom Status for Inbuild Use Says That 2fa Authentication is required
      msg: "Authentication Required",
      twofactor: newSecret, // 2fa details containing the qr code and secret
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.toString() });
  }
});

app.post("/register/finish", async (req, res) => {
  try {
    if (!req.body?.password?.trim() || !req.body?.username?.trim() || !req.body?.name?.trim() || !req.body?.twofactor_token || !req.body?.twofactor_code) {
      return res.status(400).json({ ok: false, msg: "Fill Proper Crendtials" });
    }
    const i = (o, ...s) => s.map((_) => o[_].trim());

    // Will Destructure the Given Data // Trimed
    const [username, password, name, twofactor_token, twofactor_code] = i(req.body, "username", "password", "name", "twofactor_token", "twofactor_code");

    // Check if 2fa Code is valid or not
    const matched = twofactor.verifyToken(twofactor_token, twofactor_code);

    if (await User.findOne({ username })) {
      return res.status(400).json({ ok: false, msg: "User Already Exists" });
    }
    if (password < 5) {
      return res.status(400).json({ ok: false, msg: "Password must me more than 5 in length" });
    }

    if (!matched) {
      return res.status(400).json({ ok: false, msg: "Invalid Two Factor Code" });
    }

    // Now less hash the password and register user
    const hashed_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashed_password,
      name,
      twofactor: twofactor_token,
    });

    await newUser.save();

    res.json({
      ok: true,
      msg: "Succesfully Registered",
    });
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.toString() });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username: username = null, password: password = null, twofactor_code: twofacode = null, twofatoken: token = null } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, msg: "Invalid Login" });
    }

    const verify = await User.findOne({ username });

    if (!verify) {
      return res.status(400).json({ ok: false, msg: "Invalid Login" });
    }

    const check = bcrypt.compare(password, verify.password);

    if (!check) {
      return res.status(400).json({ ok: false, msg: "Invalid Login" });
    }

    if (token) {
      const matched = twofactor.verifyToken(token, twofacode);

      if (!matched) {
        return res.status(400).json({ ok: false, msg: "Invalid Login" });
      }

      let backup = { ...verify._doc };

      delete backup.password;
      delete backup.__v;
      delete backup._id;

      return res.status(200).json({
        ok: true,
        msg: "Succesfully logged in",
        user: backup, // Temporary Purpose just to check if it logged in properly
      });
    } else {
      res.status(200).json({ ok: true, status: 101, msg: "need 2fa verification", "2fa_token": verify.twofactor });
    }
  } catch (error) {
    res.status(500).json({ ok: false, msg: error.toString() });
  }
});

module.exports = app;