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
    role: {
        type: String,
        required: [true, "El rol no puede estar vacio"],
        enum: {
            values: ["admin", "miembro"],
            message: "El rol puede ser administrador o miembro.",
        },        
    },
});

const Usuario = mongoose.model("usuarios", usuarioSchema);
module.exports = Usuario;