const Journal = require("../models/journal");
const User = require("../models/users");
const Forbidden = require("../errors/forbidden");
const NotFoundError = require("../errors/not-found-error");
const ValidationError = require('../errors/not-found-error');


const createJournalItem = (req, res, next) => {
  const { date, description } = req.body;

  User.findById(req.user._id)
    .then((user) => {
      const centerId = user.center;

      Journal.create({
        date,
        responsible: req.user._id,
        description,
        center: centerId,
      })
        .then((journalItem) => {
          res.status(201).send(journalItem);
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

const editJournalItem = (req, res, next) => {
  const { journalItenId } = req.params;
  const { description } = req.body;

  Journal.findById(journalItenId).then((journalItem) => {
    if (journalItem.responsible != req.user._id) {
      return next(
        new Forbidden("Это не твоя запись! не получится ее изменить")
      );
    }
    if (journalItem === null) {
      return next(new NotFoundError("Запись не найдена"));
    }
    Journal.findByIdAndUpdate(
      journalItenId,
      { description },
      { new: true, runValidators: true }
    )
    .populate(["center", "responsible"])
    .then((journalEditedItem)=> {
      res.status(200).send(journalEditedItem)
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

const getCenterJournal = (req, res, next) => {
  User.findById(req.user._id)
  .then((user) => {
    const centerId = user.center;

    Journal.find({center: centerId})
    .populate(["center", "responsible"])
    .then((journal)=> {
      res.status(200).send(journal)
    })
    .catch((err) => next(err))
  })
};

const getAllJournal = (req, res, next) => {
  Journal.find({})
  .populate(["center", "responsible"])
  .then((journal)=> {
    res.status(200).send(journal)
  })
  .catch((err)=> next(err))
}

module.exports = {
  createJournalItem,
  editJournalItem,
  getCenterJournal,
  getAllJournal
};
