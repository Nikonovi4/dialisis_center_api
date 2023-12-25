const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {login, logout} = require('../controllers/user')

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      login: Joi.string().required().min(5).max(12),
      password: Joi.string().required().min(5),
    }),
  }),
  login,
);

router.delete('/signout', logout);

module.exports = router;