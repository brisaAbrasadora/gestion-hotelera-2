const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        require: true,
        trim: true,
        minlength: 4,
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 7,
    },
});

const Usuario = mongoose.model("usuarios", usuarioSchema);
module.exports = Usuario;