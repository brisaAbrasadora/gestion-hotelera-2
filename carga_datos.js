const mongoose = require("mongoose");
const Habitacion = require("./models/habitacion");
const Limpieza = require("./models/limpieza");
const Usuario = require("./models/usuario");
const os = require("os");


require("dotenv").config();

// Connection to DB
if (os.homedir().includes("/home/debian/")) {
  mongoose.connect(process.env.URL_BBDD);
} else {
  mongoose.connect(process.env.URL_LOCAL);
}

try {
  let habitaciones = [
    new Habitacion({
      numero: 1,
      tipo: "doble",
      descripcion: "Habitación doble, cama XL, terraza con vistas al mar",
      precio: 59.9,
      incidencias: [
        { descripcion: "No funciona el aire acondicionado" },
        { descripcion: "No funciona el interruptor del aseo" },
      ],
    }),
    new Habitacion({
      numero: 2,
      tipo: "familiar",
      descripcion: "Habitación familiar, cama XL y literas, aseo con bañera",
      precio: 65.45,
    }),
    new Habitacion({
      numero: 3,
      tipo: "familiar",
      descripcion:
        "Habitación familiar, cama XL y sofá cama, cocina con nevera",
      precio: 69.15,
    }),
    new Habitacion({
      numero: 4,
      tipo: "suite",
      descripcion: "Habitación con dos camas XL, terraza y vistas al mar",
      precio: 110.2,
      incidencias: [{ descripcion: "No funciona el jacuzzi" }],
    }),
    new Habitacion({
      numero: 5,
      tipo: "individual",
      descripcion: "Habitación simple, cama 150",
      precio: 34.65,
    }),
  ];
  habitaciones.forEach((habitacion) => {
    habitacion.save().then((hab) => {
      let limpiezaInicial = new Limpieza({
        fechaHora: hab.ultimaLimpieza,
        idHabitacion: hab._id,
        observaciones: "Limpieza inicial",
      });

      limpiezaInicial.save();
    });
  });
  const usuarioAdmin = new Usuario({
    login: "admin",
    password: "adminNode",
    role: "admin",
  });

  usuarioAdmin.save();
} catch (error) {
  console.log(error.message);
}
