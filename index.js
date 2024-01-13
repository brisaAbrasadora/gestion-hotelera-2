const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

// Controllers
const habitaciones = require("./routes/habitaciones");
const limpiezas = require("./routes/limpiezas");

// Connection to DB
mongoose.connect(process.env.URL_BBDD);

const app = express();

// Middleware and routes load
app.use(express.json());
app.use("/habitaciones", habitaciones);
app.use("/limpiezas", limpiezas);

// Run server
app.listen(process.env.PUERTO_CONEXION);