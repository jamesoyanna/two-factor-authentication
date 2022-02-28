const express = require("express");
//const ConnectDB = require("./Utility/ConnectDB");
const app = express();
const PORT = 5000 || process.env.PORT;
require("dotenv").config();
// To use JSON With Express we will use middleware
app.use(express.json());
//ConnectDB();

//app.use("/api", require("./routes/api"));

// now lets connect our database

app.get("/", (req, res) => {
  // res.send("Hello World")
  res.json({ msg: "Server is running.." });
});

app.listen(PORT, () => {
  console.log(`[SERVER] Started on http://localhost:${PORT}`);
});