const express = require("express");
const upload = require("../utils/upload.js");
const fs = require("fs");

const Habitacion = require("../models/habitacion");
const Limpieza = require("../models/limpieza");

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

// GET all rooms
router.get("/", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();
    if (habitaciones.length > 0) {
      res.render("habitaciones_listado", {
        habitaciones: habitaciones,
        uri: "/habitaciones",
      });
    } else {
      throw Error("No hay habitaciones");
    }
  } catch (error) {
    res.render("error", { error: error });
  }
});

// GET the form
router.get("/nueva", autenticacion, (req, res) => {
  const opcionesTipo = Habitacion.schema.path("tipo").enumValues;
  res.render("habitaciones_nueva", {
    opcionesTipo: opcionesTipo,
    uri: "/nueva",
  });
});

// GET a room
router.get("/:id", async (req, res) => {
  try {
    const habUnica = await Habitacion.findById(req.params.id);

    if (habUnica) {
      res.render("habitaciones_ficha", { habitacion: habUnica });
    } else {
      throw Error("No existe el número de habitación");
    }
  } catch (error) {
    res.render("error", { error: error.message });
  }
});

// POST new room
router.post("/nueva", autenticacion, upload.file.single("imagen"), (req, res) => {
  const opcionesTipo = Habitacion.schema.path("tipo").enumValues;

  let nuevaHab = new Habitacion({
    numero: req.body.numero,
    tipo: req.body.tipo,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
  });

  if (req.file) nuevaHab.imagen = req.file.filename;

  nuevaHab
    .save()
    .then((habitacion) => {
      let limpiezaInicial = new Limpieza({
        fechaHora: habitacion.ultimaLimpieza,
        idHabitacion: habitacion._id,
        observaciones: "Limpieza inicial",
      });

      limpiezaInicial.save();

      res.redirect(req.baseUrl);
    })
    .catch((error) => {
      if (req.file) {
        const urlFichero =
          __dirname + "\\..\\public\\uploads\\" + req.file.filename;

        if (fs.existsSync(urlFichero)) fs.unlinkSync(urlFichero);
      }

      let errores = {
        general: "Error insertando la habitacion",
      };
      if (error.errors.numero) {
        errores.numero = error.errors.numero.message;
      }
      if (error.errors.tipo) {
        errores.tipo = error.errors.tipo.message;
      }
      if (error.errors.descripcion) {
        errores.descripcion = error.errors.descripcion.message;
      }
      if (error.errors.precio) {
        errores.precio = error.errors.precio.message;
      }

      res.render("habitaciones_nueva", {
        opcionesTipo: opcionesTipo,
        errores: errores,
        habitacion: req.body,
      });
    });
});

// GET edit form
router.get("/editar/:id", autenticacion, (req, res) => {
  const opcionesTipo = Habitacion.schema.path("tipo").enumValues;
  Habitacion.findById(req.params["id"])
    .then((habitacion) => {
      res.render("habitaciones_nueva", {
        habitacion: habitacion,
        opcionesTipo: opcionesTipo,
        uri: "editar",
      });
    })
    .catch((error) => {
      res.render("error", { error: "Habitacion no encontrada" });
    });
});

// UPDATE a room
router.post("/editar/:id", autenticacion, upload.file.single("imagen"), (req, res) => {
    const opcionesTipo = Habitacion.schema.path("tipo").enumValues;
    Habitacion.findById(req.params.id)
    .then((hab) => {
      if (hab) {
        hab.numero = req.body.numero;
        hab.tipo = req.body.tipo;
        hab.descripcion = req.body.descripcion;
        hab.precio = req.body.precio;
        hab.__v = +1;

        if (req.file) hab.imagen = req.file.filename;

        hab
          .save()
          .then(() => {
            res.redirect(req.baseUrl);
          })
          .catch((error) => {
            if (req.file) {
              const urlFichero =
                __dirname + "\\..\\public\\uploads\\" + req.file.filename;

              if (fs.existsSync(urlFichero)) fs.unlinkSync(urlFichero);
            }

            let errores = {
              general: "Error actualizando la habitacion",
            };
            if (error.errors.numero) {
              errores.numero = error.errors.numero.message;
            }
            if (error.errors.tipo) {
              errores.tipo = error.errors.tipo.message;
            }
            if (error.errors.descripcion) {
              errores.descripcion = error.errors.descripcion.message;
            }
            if (error.errors.precio) {
              errores.precio = error.errors.precio.message;
            }

            res.render("habitaciones_nueva", {
              opcionesTipo: opcionesTipo,
              errores: errores,
              habitacion: {id: req.params.id, ...req.body},
              uri: "editar"
            });
          });
      } else {
        throw Error("Habitacion no encontrada");
      }
    })
    .catch((error) => {
      res.render("error", { error: error.message });
    });
});

// DELETE a room
router.post("/borrar/:id", autenticacion, async (req, res) => {
  try {
    const limpiezas = await Limpieza.find({ idHabitacion: req.params.id });

    if (limpiezas.length > 0) {
      const resultado = await Limpieza.deleteMany({
        idHabitacion: req.params.id,
      });
    }

    await Habitacion.findByIdAndDelete({ _id: req.params.id }).then(() => {
      res.redirect(req.baseUrl);
    });
  } catch (error) {
    res.render("error", { error: error.message });
  }
});

// POST a new incidence
router.post(
  "/:id/incidencias",
  autenticacion,
  upload.file.single("imagen"),
  async (req, res) => {
    try {
      let incidenciaNueva = {
        descripcion: req.body.descripcion,
      };

      if (req.file) incidenciaNueva.imagen = req.file.filename;

      const habSeleccionada = await Habitacion.findById(req.params.id);
      const incidencias = habSeleccionada.incidencias;
      incidencias.push(incidenciaNueva);

      await Habitacion.findByIdAndUpdate(
        req.params.id,
        { $set: { incidencias: incidencias }, $inc: { __v: 1 } },
        { new: true, runValidators: true }
      );

      res.redirect(req.baseUrl + "/" + req.params.id);
    } catch (e) {
      if (req.file) {
        const urlFichero =
          __dirname +
          "\\..\\public\\uploads\\incidencias\\" +
          req.file.filename;

        if (fs.existsSync(urlFichero)) fs.unlinkSync(urlFichero);
      }

      let error = "La descripcion de la incidencia es obligatoria";

      res.render("error", { error: error });
    }
  }
);

// UPDATE incidence
router.post("/:idH/incidencias/:idI", autenticacion, async (req, res) => {
  try {
    const hab = await Habitacion.findById(req.params.idH);

    if (hab.incidencias.length < 1) {
      throw Error;
    }

    let incidenciaExiste = false;
    const incidencias = hab.incidencias.map((incidencia) => {
      if (incidencia._id == req.params.idI) {
        incidencia.fechaFin = new Date();
        incidenciaExiste = true;
      }
      return incidencia;
    });

    if (!incidenciaExiste) {
      throw Error;
    }

    const habActualizada = await Habitacion.findByIdAndUpdate(
      req.params.idH,
      {
        $set: { incidencias: incidencias },
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true }
    );

    if (habActualizada) {
      res.redirect(req.baseUrl + "/" + req.params.idH);
    } else {
      throw Error;
    }
  } catch (e) {
    let error = "Incidencia no encontrada";

    res.render("error", { error: error });
  }
});

module.exports = router;
