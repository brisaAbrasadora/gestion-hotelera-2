const Mongoose = require("mongoose");

const limpiezaSchema = new Mongoose.Schema({
    idHabitacion : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "habitaciones",
    },
    fechaHora : {
        type: Date,
        require: [true, "La fecha de la limpieza es obligatoria"],
        default: new Date(),
    },
    observaciones : {
        type: String,
        trim: true,
    },
});

const Limpieza = Mongoose.model("limpiezas", limpiezaSchema);
module.exports = Limpieza;