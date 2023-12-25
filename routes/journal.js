const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const {
  createJournalItem,
  editJournalItem,
  getCenterJournal,
  getAllJournal
} = require('../controllers/journal');

router.post(
  '/create',
  celebrate({
    body: Joi.object().keys({
      description: Joi.string().required(),
      date: Joi.string().required(),
    }),
  }),
  createJournalItem
);

router.patch(
  '/edit/:journalItenId',
  celebrate({
    body: Joi.object().keys({
      description: Joi.string().required()
    }),
    params: Joi.object().keys({
      journalItenId: Joi.string().length(24).hex().required(),
    }),
  }),
  editJournalItem
);

router.get('/', getCenterJournal);

router.get('/getall', getAllJournal)


module.exports = router;