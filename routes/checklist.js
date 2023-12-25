const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createChecklist,
  getCenterChecklist,
  getAllChecklists,
  editChecklist,
} = require("../controllers/checklist");

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      leak: Joi.boolean().required(),
      consumption: Joi.number().required(),
      checkClock: Joi.boolean().required(),
      pressureIn: Joi.number().required(),
      pressureM1: Joi.number().required(),
      pressureM2: Joi.number().required(),
      rw: Joi.number().required(),
      permeate: Joi.number().required(),
      temp: Joi.number().required(),
      rj: Joi.number().required(),
      pressureMO2: Joi.number().required(),
      pressureMO3: Joi.number().required(),
      pressureMO4: Joi.number().required(),
      pressureMO5: Joi.number().required(),
      flushingFilter: Joi.boolean().required(),
      dg: Joi.boolean().required(),
      salt: Joi.boolean().required(),
      errOsmos: Joi.boolean().required(),
      errHotDisinfection: Joi.boolean().required(),
      errCSS: Joi.boolean().required(),
      description: Joi.string(),
      date: Joi.string().required(),
    }),
  }),
  createChecklist
);

router.get("/", getCenterChecklist);

router.get("/getall", getAllChecklists);

router.patch(
  "/edit/:checklistId",
  celebrate({
    body: Joi.object().keys({
      leak: Joi.boolean(),
      consumption: Joi.number(),
      checkClock: Joi.boolean(),
      pressureIn: Joi.number(),
      pressureM1: Joi.number(),
      pressureM2: Joi.number(),
      rw: Joi.number(),
      permeate: Joi.number(),
      temp: Joi.number(),
      rj: Joi.number(),
      pressureMO2: Joi.number(),
      pressureMO3: Joi.number(),
      pressureMO4: Joi.number(),
      pressureMO5: Joi.number(),
      flushingFilter: Joi.boolean(),
      dg: Joi.boolean(),
      salt: Joi.boolean(),
      errOsmos: Joi.boolean(),
      errHotDisinfection: Joi.boolean(),
      errCSS: Joi.boolean(),
      description: Joi.string(),
    }),
    params: Joi.object().keys({
      checklistId: Joi.string().length(24).hex().required(),
    })
  }),
  editChecklist
);

module.exports = router;
