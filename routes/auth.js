const express = require("express");
const auth = require("../auth/auth");

const Usuario = require("../models/usuario");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const login = req.body.login;
    const password = req.body.password;

    const usuario = await Usuario.findOne({ login: login, password: password });
    if (usuario) {
      res.status(200).send({ resultado: auth.generarToken(usuario.login)});
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(401).send({ error: "Login incorrecto", testing: error.message});
  }
});

module.exports = router;
