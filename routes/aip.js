const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createAip,
  getCenterAip,
  getAllAip,
  editAip
} = require('../controllers/aip');

router.post(
  '/create',
  celebrate({
    body: Joi.object().keys({
      internalNumber: Joi.number().required(),
      serialNumber: Joi.number().required(),
      inventoryNumber: Joi.string(),
      software: Joi.string().required(),
      REF: Joi.number().required(),
      startUsing: Joi.number().required(),
    }),
  }),
  createAip
);

router.get('/', getCenterAip);

router.get('/getall', getAllAip);

router.patch('/edit/:serialNumber', 
celebrate({
  body: Joi.object().keys({
    internalNumber: Joi.number(),
    inventoryNumber: Joi.string(),
    software: Joi.string(),
    responsible: Joi.string(),
    center: Joi.string(),
    place: Joi.string(),
    condition: Joi.string(),
  }),
}),
editAip
)


module.exports = router;
