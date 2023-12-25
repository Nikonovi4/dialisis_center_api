const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");


const { 
  createPart,
  getCenterParts,
  getAllParts,
  movingPartе,
  installPart,
  getAipParts
} = require('../controllers/part');

router.post('/create', 
celebrate({
  body: Joi.object().keys({
    partName: Joi.string().required(),
    partNumber: Joi.string().required(),
    createDate: Joi.string().required(),
  }),
}),
createPart
);

router.get('/', getCenterParts);

router.get('/getall', getAllParts);

router.patch('/moving/:partNumber', 
celebrate({
  body: Joi.object().keys({
    fromCenterName: Joi.string().required(),
    toCenterName: Joi.string().required()
  }),
  params: Joi.object().keys({
    partNumber: Joi.string().min(4).max(12).required(),
  }),
}),
movingPartе
);

router.patch('/install/:partNumber',
celebrate({
  body: Joi.object().keys({
    serialNumberAip: Joi.string().required(),
    installDate: Joi.string().required()
  }),
  params: Joi.object().keys({
    partNumber: Joi.string().min(4).max(12).required(),
  }),
}), 
installPart
);

router.get('/installed/:serialNumberAip',
celebrate({
  params: Joi.object().keys({
    serialNumberAip: Joi.string().required(),
  }),
}), 
getAipParts
)


module.exports = router;