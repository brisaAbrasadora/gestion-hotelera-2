const express = require("express");

const Usuario = require("../models/usuario");

const router = express.Router();

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


// Carga de datos
router.get("/carga",  (req, res) => {

        const usuarioAdmin = new Usuario({
            login: "admin",
            password: "adminNode",
            role: "admin",
        });

        usuarioAdmin.save().then((resultado) => {
            console.log("Carga exitosa del usuario administrador a la BBDD:\n",
            resultado);
            res.redirect("/");
        }).catch((error) => {
            res.status(400).send({error: "Error cargando el usuario",
        mensaje: error.message})
        });
});

module.exports = router;