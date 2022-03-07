const {model, Schema} = require("mongoose");
const mySchema = new Schema({
    name: {
        type: "string",
        required: true,
    },
    username: {
        type: "string",
        unique: true,
        required: true,
    },
    password: {
        type: "string",
        required: true,
    },
    twofactor: {
        type: "string",
        required: true,
    },
})
module.exports = model("Users", mySchema);