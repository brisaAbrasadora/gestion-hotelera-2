const mongoose = require("mongoose");
const express = require("express");
const nunjucks = require("nunjucks");
const dateFilter = require("nunjucks-date-filter");
const session = require("express-session");
const os = require("os");

require("dotenv").config();

// Controllers
const habitaciones = require("./routes/habitaciones");
const limpiezas = require("./routes/limpiezas");
const auth = require("./routes/auth");

// Connection to DB
if (os.homedir().includes("/home/debian/")) {
    mongoose.connect(process.env.URL_BBDD);
} else {
    mongoose.connect(process.env.URL_LOCAL);
}


// Run Express
const app = express();

// Configure Nunjucks engine
const env = nunjucks.configure("views", {
    autoescape: true,
    express: app
});

// Add date filter
env.addFilter("date", dateFilter);

// Set template's engine
app.set("view engine", "njk");

// Middleware and routes load
app.use(session({
    secret: 'dani11node',
    resave: true,
    saveUninitialized: false
}));
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static("./public"));
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use("/habitaciones", habitaciones);
app.use("/limpiezas", limpiezas);
app.use("/auth", auth);
app.get("/", (req, res) => {
    res.redirect("/habitaciones");
})

// Run server
app.listen(process.env.PUERTO_CONEXION);