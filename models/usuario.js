const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        require: [true, "El usuario es obligatorio"],
        trim: true,
        minlength: [4, "El usuario debe tener al menos 4 caracteres."],
    },
    password: {
        type: String,
        require: [true, "La contraseña es obligatoria"],
        trim: true,
        minlength: [7, "La contraseña debe tener al menos 7 caracteres."],
    },
});

const Usuario = mongoose.model("usuarios", usuarioSchema);
module.exports = Usuario;