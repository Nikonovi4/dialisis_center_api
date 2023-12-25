const User = require("../models/users");
const Center = require("../models/center");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const ValidationError = require("../errors/validation-error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError =require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { name, login, post, centerName, password } = req.body;

  Center.findOne({ name: centerName })
    .then((center) => {
      const centerId = center._id;
      bcrypt
        .hash(password, 10)
        .then((hash) =>
          User.create({ name, login, post, center: centerId, password: hash })
        )
        .then((user) => res.status(201).send(user))
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
      return next(err);
    });
};

const login = (req, res, next) => {
  const { login, password } = req.body;

  return User.findOne({ login })
    .select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Пользователь не найден'));
      }
      return bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          return next(new UnauthorizedError('Неправильные логин или пароль'));
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: '7d',
        });
        res.cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        });
        return res.status(200).send(token);
      });
    })
    .catch((err) => next(err));
};

const logout = (req, res, next) => {
  res.clearCookie('jwt').status(202).send('user is logout')
    .catch((err) => next(err));
};

const getAllUserInfo = (req, res, next) => {
  User.find({})
    .populate("center")
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      return next(err);
    });
};

const deleteUser = (req, res, next) => {
  const { userName } = req.body;
  User.findOne({ name: userName })
    .then((user) => {
      if (user === null) {
        return next(new NotFoundError("Такой пользователь не найден"));
      }
      User.deleteOne(user)
        .then(() => res.status(200).send("Пользователь удален"))
        .catch((err) => {
          return next(err);
        });
    })
    .catch((err) => {
      return next(err);
    });
};

const editUserInfo = (req, res, next) => {
  const { userName, center, newUserName, login, post } = req.body;

  if (center != null) {
    Center.findOne({ name: center }).then((center) => {
      const centerId = center._id;

      User.findOneAndUpdate(
        { name: userName },
        { name: newUserName, login, post, center: centerId },
        { new: true, runValidators: true }
      )
        .then((user) => {
          if (user === null) {
            return next(
              new NotFoundError("Пользователь с таким именем не найден")
            );
          }
          res.status(201).send(user);
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
  } else {
    User.findOneAndUpdate(
      { name: userName },
      { name: newUserName, login, post },
      { new: true, runValidators: true }
    )
      .then((user) => {
        if (user === null) {
          return next(
            new NotFoundError("Пользователь с таким именем не найден")
          );
        }
        res.status(201).send(user);
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
  }
};

const editMyPassword = (req, res, next) => {
  const userId = req.user._id;
  const { password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.findByIdAndUpdate(
       userId,
      { password: hash },
      { new: true, runValidators: true }
    )
    .then((user) => 
    res.status(200).send(`Пароль у ${user.name} был изменен`))
    .catch((err) => {return next(err)})
  });
};

const getMyInfo = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
  .populate('center')
  .then((user) => res.status(200).send(user))
  .catch((err)=> next(err))
};

module.exports = {
  createUser,
  getAllUserInfo,
  deleteUser,
  editUserInfo,
  editMyPassword,
  login,
  logout,
  getMyInfo
};
