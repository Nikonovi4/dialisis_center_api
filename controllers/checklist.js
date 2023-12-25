const Checklist = require("../models/checklist");
const User = require("../models/users");

const ValidationError = require("../errors/validation-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");
const Forbidden = require("../errors/forbidden");

const createChecklist = (req, res, next) => {
  const {
    leak,
    consumption,
    checkClock,
    pressureIn,
    pressureM1,
    pressureM2,
    rw,
    permeate,
    temp,
    rj,
    pressureMO2,
    pressureMO3,
    pressureMO4,
    pressureMO5,
    flushingFilter,
    dg,
    salt,
    errOsmos,
    errHotDisinfection,
    errCSS,
    description,
    date,
  } = req.body;

  User.findById(req.user._id)
    .then((user) => {
      const userId = user._id;
      const centerId = user.center;

      Checklist.create({
        leak,
        consumption,
        checkClock,
        pressureIn,
        pressureM1,
        pressureM2,
        rw,
        permeate,
        temp,
        rj,
        pressureMO2,
        pressureMO3,
        pressureMO4,
        pressureMO5,
        flushingFilter,
        dg,
        salt,
        errOsmos,
        errHotDisinfection,
        errCSS,
        description,
        date,
        center: centerId,
        responsible: userId,
      })
        .then((checklist) => res.status(200).send(checklist))
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
              new ConflictError("За сегонешний день данные уже внесены")
            );
          }
          return next(err);
        });
    })
    .catch((err) => next(err));
};

const getCenterChecklist = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      const centerId = user.center;

      Checklist.find({ center: centerId })
        .populate(["center", "responsible"])
        .then((checklists) => res.status(200).send(checklists))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const getAllChecklists = (req, res, next) => {
  Checklist.find({})
    .populate(["center", "responsible"])
    .then((checklists) => res.status(200).send(checklists))
    .catch((err) => next(err));
};

const editChecklist = (req, res, next) => {
  const { checklistId } = req.params;
  const {
    leak,
    consumption,
    checkClock,
    pressureIn,
    pressureM1,
    pressureM2,
    rw,
    permeate,
    temp,
    rj,
    pressureMO2,
    pressureMO3,
    pressureMO4,
    pressureMO5,
    flushingFilter,
    dg,
    salt,
    errOsmos,
    errHotDisinfection,
    errCSS,
    description
  } = req.body;

  Checklist.findById(checklistId).then((checklist) => {
    if (checklist === null) {
      return next(new NotFoundError("Запись не найдена"));
    }
    if (checklist.responsible != req.user._id) {
      return next(new Forbidden("Можно исправлять только свои запииси"));
    }
    Checklist.findByIdAndUpdate(
      checklist._id,
      {
        leak,
        consumption,
        checkClock,
        pressureIn,
        pressureM1,
        pressureM2,
        rw,
        permeate,
        temp,
        rj,
        pressureMO2,
        pressureMO3,
        pressureMO4,
        pressureMO5,
        flushingFilter,
        dg,
        salt,
        errOsmos,
        errHotDisinfection,
        errCSS,
        description,
      },
      { new: true, runValidators: true }
    )
      .populate(["center", "responsible"])
      .then((editedChecklist) => res.status(200).send(editedChecklist))
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
  createChecklist,
  getCenterChecklist,
  getAllChecklists,
  editChecklist
};
