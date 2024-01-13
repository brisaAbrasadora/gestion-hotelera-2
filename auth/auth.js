const jwt = require("jsonwebtoken");

const generarToken = (login) => {
  return jwt.sign({ login: login }, process.env.SECRETO, {
    expiresIn: "2 hours",
  });
};

const validarToken = (token) => {
    try {
        return jwt.verify(token, process.env.SECRETO);
    } catch (error) {
        console.log(error.message);
    };
};

const protegerRuta = (req, res, next) => {
    let token = req.headers["authorization"];
    
    if(token && token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    if(token) {
        const resultado = validarToken(token);
        if(resultado) {
            next();
        } else {
            res.status(403).send({error: "Acceso no autorizado"});
        };
    } else {
        res.status(403).send({error: "Acceso no autorizado"});
    };
};

module.exports = {
    generarToken: generarToken,
    validarToken: validarToken,
    protegerRuta: protegerRuta,
}
