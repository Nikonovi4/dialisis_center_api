const Center = require("../models/center");
const ValidationError = require("../errors/validation-error");
const ConflictError = require("../errors/conflict-error");

const createCenter = (req, res, next) => {
  const { name } = req.body;

  Center.create({ name })
    .then((center) => {
      res.status(201).send(center);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new ValidationError(
            `Возникли ошибки валидации: ${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`
          )
        );
      }
      if (err.code === 11000) {
        return next(new ConflictError("Этот центр уже зарегестрирована"));
      }
      return next(err);
    });
};

const getAllCenters = (req, res, next) => {
  Center.find({})
    .then((centers) => {
      res.status(200).send(centers);
    })
    .catch((err) => next(err));
};

module.exports = {
  createCenter,
  getAllCenters,
};
