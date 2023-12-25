const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createRepair,
  getAipRepair,
  getAllRepair,
  editRepair
} = require('../controllers/repair');

router.post('/create/:aipId', 
celebrate({
  body: Joi.object().keys({
    date: Joi.string().required(),
    title: Joi.string().required().min(5).max(20), 
    description: Joi.string().required().min(15), 
    operationTime: Joi.number().required()
  }),
  params: Joi.object().keys({
    aipId: Joi.string().length(24).hex().required(),
  }),
}),
createRepair
);

router.get('/get/:aipId',
celebrate({
  params: Joi.object().keys({
    aipId: Joi.string().length(24).hex().required(),
  }),
}),
getAipRepair
)

router.get('/getall', getAllRepair);

router.patch('/:repairId', 
celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(5).max(20), 
    description: Joi.string().min(15), 
    operationTime: Joi.number()
  }),
  params: Joi.object().keys({
    repairId: Joi.string().length(24).hex().required(),
  }),
}),
editRepair
)

module.exports = router;