const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createUser,
  getAllUserInfo,
  deleteUser,
  editUserInfo,
  editMyPassword,
  getMyInfo,
} = require("../controllers/user");

router.post(
  "/create",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(8).max(40),
      login: Joi.string().required().min(5).max(12),
      post: Joi.string().required(),
      centerName: Joi.string().required(),
      password: Joi.string().required().min(5),
    }),
  }),
  createUser
);

router.get("/getallusers", getAllUserInfo);

router.delete(
  "/delete",
  celebrate({
    body: Joi.object().keys({
      userName: Joi.string().required().min(8).max(40),
    }),
  }),
  deleteUser
);

router.patch(
  "/edituser",
  celebrate({
    body: Joi.object().keys({
      userName: Joi.string().min(8).max(40).required(),
      newUserName: Joi.string().min(8).max(40),
      login: Joi.string().min(5).max(12),
      post: Joi.string(),
      center: Joi.string(),
      password: Joi.string().min(5),
    }),
  }),
  editUserInfo
);

router.patch(
  "/",
  celebrate({
    body: Joi.object().keys({ 
      password: Joi.string().min(5).required() 
    }),
  }),
  editMyPassword
);

router.get("/", getMyInfo);

module.exports = router;
