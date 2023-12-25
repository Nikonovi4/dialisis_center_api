const Aip = require("../models/aip");
const User = require("../models/users");
const Repair = require("../models/repair");

const ValidationError = require("../errors/validation-error");
const NotFoundError = require("../errors/not-found-error");
const Forbidden = require("../errors/forbidden");

const createRepair = (req, res, next) => {
  const { aipId } = req.params;
  const { date, title, description, operationTime } = req.body;

  User.findById(req.user._id)
    .then((user) => {
      const centerId = user.center;

      Repair.create({
        date,
        title,
        description,
        operationTime,
        center: centerId,
        responsible: req.user._id,
        aipNumber: aipId,
      })
        .then((repairItem) => {
          res.status(200).send(repairItem);
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
          return next(err);
        });
    })
    .catch((err) => next(err));
};

const getAipRepair = (req, res, next) => {
  const { aipId } = req.params;

  Aip.findById(aipId)
    .then((aip) => {
      if (aip === null) {
        return next(new NotFoundError("Аппарат не найден"));
      }
      Repair.find({ aipNumber: aipId })
        .populate(["center", "responsible", "aipNumber"])
        .then((repairs) => {
          if (repairs.length === 0) {
            return res.status(200).send("Этот аппарат еще не ремонтировался");
          }
          return res.status(200).send(repairs);
        })
        .catch((err) => next(err));
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
      return next(err);
    });
};

const getAllRepair = (req, res, next) => {
  Repair.find({})
    .populate(["center", "responsible", "aipNumber"])
    .then((repairs) => {
      res.status(200).send(repairs);
    })
    .catch((err) => next(err));
};

const editRepair = (req, res, next) => {
  const { repairId } = req.params;
  const { title, description, operationTime } = req.body;
  Repair.findById(repairId).then((repair) => {
    if (repair === null) {
      return next(new NotFoundError("Запись о ремонте не найдена"));
    }
    if (repair.responsible != req.user._id) {
      return next(new Forbidden("Изменять можно только свою запись"));
    }
    Repair.findByIdAndUpdate(
      repairId,
      { title, description, operationTime },
      { new: true, runValidators: true }
    )
    .populate(["center", "responsible", "aipNumber"])
    .then((repair) => res.status(200).send(repair))
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
};

module.exports = {
  createRepair,
  getAipRepair,
  getAllRepair,
  editRepair
};
