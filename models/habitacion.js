const mongoose = require("mongoose");

const incidenciaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        require: true,
        trim: true,
        minlength: 1,
    },
    fechaInicio: {
        type: Date,
        require: true,
        default: new Date(),
    },
    fechaFin: {
        type: Date,
    },
});

const habitacionSchema = new mongoose.Schema({
    numero : {
        type: Number,
        require: true,
        min: 1,
        max: 100,
    },
    tipo: {
        type: String,
        enum: ["individual", "doble", "familiar", "suite"],
    },
    descripcion: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
    },
    ultimaLimpieza: {
        type: Date,
        require: true,
        default: new Date(),
    },
    precio: {
        type: Number,
        require: true,
        min: 0,
        max: 250,
    },
    incidencias: [incidenciaSchema],
});

const habitacion = mongoose.model("habitaciones", habitacionSchema);
module.exports = habitacion;