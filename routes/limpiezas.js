const express = require("express");

const Limpieza = require("../models/limpieza");
const Habitacion = require("../models/habitacion");

const router = express.Router();

// GET form
router.get("/nueva/:id", async (req, res) => {
  try {
    const habitacion = await Habitacion.findById(req.params.id).select(
      "numero"
    );
    const fechaActual = new Date();

    if (!habitacion) {
      throw Error("Esta habitacion no existe.");
    }

    res.render("limpiezas_nueva", { habitacion: habitacion, hoy: fechaActual });
  } catch (error) {
    res.render("error", { error: error.message });
  }
});

// GET all cleanings
router.get("/:id", async (req, res) => {
  try {
    const limpiezas = await Limpieza.find({ idHabitacion: req.params.id }).sort(
      "-fechaHora"
    );
    const habitacion = await Habitacion.findById(req.params.id).select(
      "numero"
    );

    if (!habitacion) {
      throw Error("Esta habitacion no existe.");
    }

    res.render("limpiezas_listado", {
      limpiezas: limpiezas,
      habitacion: habitacion,
    });
  } catch (error) {
    res.render("error", { error: error.message });
  }
});

// POST new cleaning to a room
router.post("/:id", async (req, res) => {
  try {
    const limpiezaNueva = new Limpieza({
      idHabitacion: req.params.id,
      fechaHora: req.body.fecha,
      observaciones: req.body.observaciones,
    });

    limpiezaNueva.save().then(async () => {
      const ultimaLimpieza = await Limpieza.find({
        idHabitacion: req.params.id,
      })
        .sort("-fechaHora")
        .limit(1);

      if (ultimaLimpieza.length === 0) {
        throw Error;
      }

      await Habitacion.findByIdAndUpdate(
        req.params.id,
        {
          $set: { ultimaLimpieza: ultimaLimpieza[0].fechaHora },
          $inc: { __v: 1 },
        },
        { new: true, runValidators: true }
      );
      res.redirect(req.baseUrl + "/" + req.params.id);
    });
  } catch (error) {
    res.render("error", { error: error });
  }
});

module.exports = router;
