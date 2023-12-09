const User = require("../models/users");
const bcrypt = require("bcryptjs");

const createUser = (req, res, next) => {
  const { name, login, post, center, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, login, post, center, password: hash }))
    .then((user) => res.status(201).send( user ))
    .catch((err) => next(err));
};

const getAllUserInfo = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => console.log(err));
};

const deleteUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById({ _id: userId })
    .then((user) => {
      User.deleteOne(user).then(() =>
        res.status(200).send("Пользователь удален")
      );
    })
    .catch((err) => console.log(err));
};

const editUserInfo = (req, res, next) => {
  
  const { userId, name, login, post, center, password } = req.body;

  User.findByIdAndUpdate({_id: userId}, 
          {
          name,
          login,
          post,
          center,
          password,
        },
        {
          new: true,
          runValidators: true,
          upsert: false,
        })
        .then((user) => {
          if (user === null) {
            res.status(404).send('user non found')
          } else {
            res.status(200).send({user})
          }
        })
};



module.exports = {
  createUser,
  getAllUserInfo,
  deleteUser,
  editUserInfo,
};
