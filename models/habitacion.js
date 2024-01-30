const mongoose = require("mongoose");

const incidenciaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        required: [true, "La descripcion es obligatoria."],
        trim: true,
    },
    fechaInicio: {
        type: Date,
        required: [true, "La fecha de inicio de la incidencia es obligatoria"],
        default: new Date(),
    },
    fechaFin: {
        type: Date,
    },
    imagen: {
        type: String,
    }
});

const habitacionSchema = new mongoose.Schema({
    numero : {
        type: Number,
        required: true,
        min: [1, "El numero de habitacion no puede ser igual o inferior a 1."],
        max: [100, "El numero de habitacion no puede ser igual o superior a 100."],
    },
    tipo: {
        type: String,
        enum: {
            values: ["individual", "doble", "familiar", "suite"],
            message: "El tipo debe ser individual, doble, familiar o suite.",
        },        
    },
    descripcion: {
        type: String,
        required: [true, "La descripion de la habitacion es obligatoria."],
        trim: true,
    },
    ultimaLimpieza: {
        type: Date,
        required: [true, "La fecha de la ultima limpieza es obligatoria."],
        default: new Date(),
    },
    precio: {
        type: Number,
        required: [true, "El precio de la habitacion es obligatorio."],
        min: [0, "El precio no puede ser igual o inferior a 0."],
        max: [250, "El precio no puede ser igual o superior a 250."],
    },
    incidencias: [incidenciaSchema],
    imagen: {
        type: String,
    }
});

const habitacion = mongoose.model("habitaciones", habitacionSchema);
module.exports = habitacion;