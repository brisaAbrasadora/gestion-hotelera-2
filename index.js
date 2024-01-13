const mongoose = require("mongoose");
const express = require("express");
const nunjucks = require("nunjucks");
require("dotenv").config();

// Controllers
const habitaciones = require("./routes/habitaciones");
const limpiezas = require("./routes/limpiezas");

// Connection to DB
mongoose.connect(process.env.URL_BBDD);

// Run Express
const app = express();

// Configure Nunjucks engine
nunjucks.configure("views", {
    autoescape: true,
    express: app
});

// Set template's engine
app.set("view engine", "njk");

// Middleware and routes load
app.use(express.json());
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/habitaciones", habitaciones);
app.use("/limpiezas", limpiezas);
app.get("/", (req, res) => {
    res.redirect("/habitaciones");
})

// Run server
app.listen(process.env.PUERTO_CONEXION);