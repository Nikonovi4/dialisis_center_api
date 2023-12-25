const Aip = require("../models/aip");
const Center = require("../models/center");
const User = require("../models/users");

const ValidationError = require("../errors/validation-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");

const createAip = (req, res, next) => {
  const {
    internalNumber,
    serialNumber,
    inventoryNumber,
    software,
    REF,
    startUsing,
  } = req.body;

  const condition = "Исправный";

  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        return next(
          new NotFoundError("Такой пользователь не найден. Кто ты, воин?")
        );
      }

      const centerId = user.center;

      Aip.create({
        internalNumber,
        serialNumber,
        inventoryNumber,
        software,
        REF,
        startUsing,
        condition: condition,
        responsible: req.user._id,
        center: centerId,
      })
        .then((aip) => res.status(200).send(aip))
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
            return next(
              new ConflictError("Данный аппарат уже зарегестрирован")
            );
          }
          return next(err);
        });
    })
    .catch((err) => next(err));
};

const getCenterAip = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      const centerId = user.center;

      Aip.find({ center: centerId })
        .populate(["center", "responsible"])
        .then((aips) => res.status(200).send(aips))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const getAllAip = (req, res, next) => {
  Aip.find({})
    .populate(["center", "responsible"])
    .then((aips) => res.status(200).send(aips))
    .catch((err) => next(err));
};

const editAip = (req, res, next) => {
  const { serialNumber } = req.params;
  const {
    internalNumber,
    inventoryNumber,
    software,
    responsible,
    center,
    place,
    condition,
  } = req.body;
  if (center != null && responsible != null) {
    Center.findOne({ name: center })
      .then((center) => {
        const centerId = center._id;

        User.findOne({ name: responsible }).then((user) => {
          const userId = user._id;

          Aip.findOneAndUpdate(
            { serialNumber: serialNumber },
            {
              internalNumber,
              inventoryNumber,
              software,
              responsible: userId,
              center: centerId,
              place,
              condition,
            },
            { new: true, runValidators: true }
          )
            .populate(["center", "responsible"])
            .then((aip) => res.status(200).send(aip))
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
              return next(err);
            });
        });
      })
      .catch((err) => next(err));
  }
  if (center != null) {
    Center.findOne({ name: center })
      .then((center) => {
        const centerId = center._id;

        Aip.findOneAndUpdate(
          { serialNumber: serialNumber },
          {
            internalNumber,
            inventoryNumber,
            software,
            center: centerId,
            place,
            condition,
          },
          { new: true, runValidators: true }
        )
          .populate(["center", "responsible"])
          .then((aip) => res.status(200).send(aip))
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
            return next(err);
          });
      })
      .catch((err) => next(err));
  }
  if (responsible != null) {
    User.findOne({ name: responsible })
      .then((user) => {
        const userId = user._id;

        Aip.findOneAndUpdate(
          { serialNumber: serialNumber },
          {
            internalNumber,
            inventoryNumber,
            software,
            responsible: userId,
            place,
            condition,
          },
          { new: true, runValidators: true }
        )
          .populate(["center", "responsible"])
          .then((aip) => res.status(200).send(aip))
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
            return next(err);
          });
      })
      .catch((err) => next(err));
  }
  Aip.findOneAndUpdate(
    { serialNumber: serialNumber },
    {
      internalNumber,
      inventoryNumber,
      software,
      place,
      condition,
    },
    { new: true, runValidators: true }
  )
    .populate(["center", "responsible"])
    .then((aip) => res.status(200).send(aip))
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
      return next(err);
    });
};

module.exports = {
  createAip,
  getCenterAip,
  getAllAip,
  editAip,
};
