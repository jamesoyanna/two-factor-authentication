const app = require("express").Router();
const bcrypt = require("bycrypt");
const res = require("express/lib/response");
const twofactor = require("node-2fa");
const User = require("../Models/User");

app.get("/", (req, res) =>{
    try {
       res.json({ok: true, msg: " Welcome Server"}) 
    } catch (error) {
        res.status(500).json({ok: false, msg: error.toString() });
    }
});

app.post("/register", async (req, res) => {
    try {
      if (!req.body?.password?.trim() || !req.body?.username?.trim()) {
        return res.status(400).json({ ok: false, msg: "Fill Proper Crendtials" });
      }
      const i = (o, ...s) => s.map((_) => o[_].trim());
  
      // Destructure the Given Data // Trimed
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

