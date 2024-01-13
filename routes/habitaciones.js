const express = require("express");

const Habitacion = require("../models/habitacion");
const Limpieza = require("../models/limpieza");
const auth = require("../auth/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();

    if (habitaciones.length > 0) {
      res.status(200).send({ resultado: habitaciones });
    } else {
      throw Error;
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: "No hay habitaciones registradas en la aplicación." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const habUnica = await Habitacion.findById(req.params.id);

    if (habUnica) {
      res.status(200).send({ resultado: habUnica });
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(400).send({ error: "No existe el número de habitación" });
  }
});

router.post("/", auth.protegerRuta, (req, res) => {
  const habNueva = new Habitacion({
    numero: req.body.numero,
    tipo: req.body.tipo,
    descripcion: req.body.descripcion,
    ultimaLimpieza: req.body.ultimaLimpieza,
    precio: req.body.precio,
  });

  habNueva
    .save()
    .then((habNueva) => {
      res.status(200).send({
        resultado: habNueva,
      });
    })
    .catch((error) => {
      res.status(400).send({
        error: "Error insertando la habitacion"
      });
    });
});

router.put("/ultimaLimpieza", async (req, res) => {
  try {
    const habitaciones = await Habitacion.find();

    if (habitaciones && habitaciones.length > 0) {
      for (const hab of habitaciones) {
        const ultimaLimpieza = await Limpieza.find({ idHabitacion: hab._id })
          .sort("-fechaHora")
          .limit(1);

        if (ultimaLimpieza && ultimaLimpieza.length > 0) {
          await Habitacion.findByIdAndUpdate(
            hab.id,
            {
              $set: { ultimaLimpieza: ultimaLimpieza[0].fechaHora },
              $inc: { __v: 1 },
            },
            { runValidators: true }
          );
        }
      }
      const habitacionesActualizadas = await Habitacion.find();
      res.status(200).send({ resultado: habitacionesActualizadas });
    } else {
      throw error;
    }
  } catch (error) {
    res.status(400).send({ error: "Error actualizando limpieza" });
  }
});

router.put("/:id", auth.protegerRuta, async (req, res) => {
  try {
    const habActualizada = await Habitacion.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          numero: req.body.numero,
          tipo: req.body.tipo,
          descripcion: req.body.descripcion,
          ultimaLimpieza: req.body.ultimaLimpieza,
          precio: req.body.precio,
        },
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true }
    );

    if (habActualizada) {
      res.status(200).send({ resultado: habActualizada });
    } else {
      throw Error;
    }
  } catch (error) {
    res
      .status(400)
      .send({ error: "Error actualizando los datos de la habitación" });
  }
});

router.delete("/:id", auth.protegerRuta, async (req, res) => {
  try {
    const habBorrada = await Habitacion.findByIdAndDelete(req.params.id);

    if (habBorrada) {
      res.status(200).send({ resultado: habBorrada });
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(400).send({ error: "Error eliminando la habitación." });
  }
});

router.post("/:id/incidencias", auth.protegerRuta, async (req, res) => {
  try {
    const incidenciaNueva = {
      descripcion: req.body.descripcion,
    };

    const habSeleccionada = await Habitacion.findById(req.params.id);
    const incidencias = habSeleccionada.incidencias;
    incidencias.push(incidenciaNueva);

    const incidenciaActualizada = await Habitacion.findByIdAndUpdate(
      req.params.id,
      { $set: { incidencias: incidencias }, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );

    res.status(200).send({ resultado: incidenciaActualizada });
  } catch (error) {
    res.status(400).send({ error: "Error añadiendo la incidencia." });
  }
});

router.put("/:idH/incidencias/:idI", auth.protegerRuta, async (req, res) => {
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
      res.status(200).send({ resultado: habActualizada });
    } else {
      throw Error;
    }
  } catch (error) {
    res.status(400).send({ error: "Incidencia no encontrada." });
  }
});

router.put("/:id/ultimalimpieza", auth.protegerRuta, async (req, res) => {
  try {
    const ultimaLimpieza = await Limpieza.find({ idHabitacion: req.params.id })
      .sort("-fechaHora")
      .limit(1);

    if (ultimaLimpieza.length === 0) {
      throw Error;
    }

    const habActualizada = await Habitacion.findByIdAndUpdate(
      req.params.id,
      {
        $set: { ultimaLimpieza: ultimaLimpieza[0].fechaHora },
        $inc: { __v: 1 },
      },
      { new: true, runValidators: true }
    );

    res.status(200).send({ resultado: habActualizada });
  } catch (error) {
    res.status(400).send({ error: "Error actualizando limpieza." });
  }
});

module.exports = router;
