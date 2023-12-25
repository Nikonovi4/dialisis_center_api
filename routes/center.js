const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { createCenter, getAllCenters } = require("../controllers/center");

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(8).max(17),
    }),
  }),
  createCenter
);

router.get("/", getAllCenters);

module.exports = router;
