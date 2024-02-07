const express = require("express");
const mongoose = require("mongoose");

const Usuario = require("../models/usuario");
const database = mongoose.connection;

const router = express.Router();

const autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    } else 
        res.render("login", {
            uri: "/login",
            error: "Necesitas estar logueado para entrar ahi."
        });
}


// GET login form
router.get("/login", (req, res) => {
    res.render("login", {
        uri: "/login",
    });
});

// POST login a user
router.post("/login", async (req, res) => {
    const visitante = new Usuario({
        login: req.body.username,
        password: req.body.password,
    });

    const usuario = await Usuario.find({login: visitante.login, password: visitante.password});

    if (usuario.length > 0) {
        req.session.usuario = usuario;
        res.redirect("/");
    } else {
        res.render("login", {error: "Usuario o contraseña incorrectos"});
    };
})

// GET a logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;