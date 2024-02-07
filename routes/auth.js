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


// Carga de datos
router.get("/admin",  (req, res) => {

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
            res.render("error", {error: error.message});
        });
});

router.get("/cargaInicial", async (req, res) => {
    try {
        let totalDocumentos = 0;
        const colecciones = await database.db.listCollections().toArray();
        for (const { name } of colecciones) {
            const modelo = mongoose.model(name);
            const ocurrencias = await modelo.countDocuments();
            totalDocumentos += ocurrencias;
        }
        
        if (totalDocumentos === 0) {
            
        } else {
            throw Error("Borra todos los datos yendo a auth/delete para insertar otra carga inicial.")
        }
    } catch (error) {
        res.render("error", {error: error.message});
    };
})

router.get("/delete", autenticacion, async (req, res) => {
    try {
        const colecciones = await database.db.listCollections().toArray();
        for (const { name } of colecciones) {
            const modelo = mongoose.model(name);
            await modelo.deleteMany();
        }
        console.log("Todos los documentos han sido eliminados.")
        res.redirect("/");
    } catch (error) {
        res.render("error", {error: error.message});
    }
})

module.exports = router;