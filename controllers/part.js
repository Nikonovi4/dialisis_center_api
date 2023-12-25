const Aip = require("../models/aip");
const User = require("../models/users");
const Repair = require("../models/repair");
const Part = require("../models/part");
const Center = require("../models/center");

const ValidationError = require("../errors/validation-error");
const NotFoundError = require("../errors/not-found-error");
const Forbidden = require("../errors/forbidden");

const createPart = (req, res, next) => {
  const { partName, partNumber, createDate } = req.body;

  User.findById(req.user._id)
    .then((user) => {
      const userId = user._id;
      const centerId = user.center;

      Part.create({
        partName,
        partNumber,
        createDate,
        center: centerId,
        creator: userId,
      })
        .then((part) => res.status(201).send(part))
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

const getCenterParts = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    const centerId = user.center;

    Part.find({ center: centerId, installOn: { $exists: false } })
      .populate("center")
      .then((parts) => {
        if (parts.length === 0) {
          return next(new NotFoundError("На центре нет деталей"));
        }
        return res.status(200).send(parts);
      })
      .catch((err) => next(err));
  });
};

const getAllParts = (req, res, next) => {
  Part.find({ installOn: { $exists: false } })
    .populate("center")
    .then((parts) => {
      if (parts.length === 0) {
        return next(new NotFoundError("Деталей не найдено"));
      }
      return res.status(200).send(parts);
    })
    .catch((err) => next(err));
};

const movingPartе = (req, res, next) => {
  const { partNumber } = req.params;
  const { fromCenterName, toCenterName } = req.body;

  Center.findOne({ name: fromCenterName }).then((center) => {
    const fromCenterId = center._id;

    Part.findOne({
      partNumber: partNumber,
      installOn: { $exists: false },
      center: fromCenterId,
    })
      .then((part) => {
        if (part === null) {
          return next(new NotFoundError("Деталь, на этом центре, не найдена"));
        }
        const partId = part._id;

        Center.findOne({ name: toCenterName })
          .then((center) => {
            const toCenterId = center._id;

            Part.findByIdAndUpdate(
              partId,
              { center: toCenterId },
              { new: true, runValidators: true }
            )
              .populate("center")
              .then((part) => res.status(200).send(part));
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

const installPart = (req, res, next) => {
  const { partNumber } = req.params;
  const { serialNumberAip, installDate } = req.body;

  User.findById(req.user._id)
  .then((user) => {
    const centerId = user.center;
    const userId = user._id;

    Part.findOne({
      partNumber: partNumber, 
      installOn: { $exists: false },
      center: centerId
    })
    .then((part) => {
      if (part === null) {
        return next(new NotFoundError("Деталь, на этом центре, не найдена"));
      }
      const partId = part._id;

      Aip.findOne({ serialNumber: serialNumberAip})
      .then((aip)=> {
        if (aip === null){
          return next ( new NotFoundError('Аппарат не найден'))
        }
        if ( aip.center.toString() !== centerId.toString()){
          return next(new Forbidden('Устанавливать детали можно только на аппараты находящиеся на твоем центре'))
        }
        const aipId = aip._id;
        const aipInNumber = aip.internalNumber;

        Part.findByIdAndUpdate(
          partId,
          {installOn: aipId,
            installer: userId,
            installDate: installDate
           },
           { new: true, runValidators: true }
        )
        .then((part) => {
          res.status(200).send(`Вы установили деталь ${part.partName} на АИП ${aipInNumber}`)
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
  .catch((err) => next(err))
}

const getAipParts = (req, res, next) => {
  const {serialNumberAip} = req.params;

  Aip.findOne({serialNumber: serialNumberAip})
  .then((aip) => {
    const aipId = aip._id;

    Part.find({installOn: aipId})
    .populate('installer')
    .then((parts)=> {
      if(parts.length === 0){
        return res.status(200).send('На аппарат не устаналивали запчасти');
      }
      return res.status(200).send(parts);
    })
    .catch((err) => next(err))
  })
}

module.exports = {
  createPart,
  getCenterParts,
  getAllParts,
  movingPartе,
  installPart,
  getAipParts
};
