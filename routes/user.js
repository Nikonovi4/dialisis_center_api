const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createUser,
  getAllUserInfo,
  deleteUser,
  editUserInfo,
} = require("../controllers/user");

router.post(
  "/create",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(8).max(40),
      login: Joi.string().required().min(5).max(12),
      post: Joi.string().required(),
      center: Joi.string(),
      password: Joi.string().required().min(5),
    }),
  }),
  createUser
);

router.get("/getallusers", getAllUserInfo);

router.delete(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteUser
);

router.patch(
  "/edituser",
  celebrate({
    body: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
      name: Joi.string().required().min(8).max(40),
      login: Joi.string().required().min(5).max(12),
      post: Joi.string().required(),
      center: Joi.string(),
      password: Joi.string().required().min(5),
    }),
  }),
  editUserInfo
);



module.exports = router;
