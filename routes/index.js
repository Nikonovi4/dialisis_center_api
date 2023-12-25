const router = require('express').Router();

const userRouter = require('./user');
const centerRouter= require('./center');
const authRouter = require('./auth');
const auth = require('../middlewares/auth')
const aipRouter =require('./aip')
const journalRouter = require('./journal')
const repairRouter = require('./repair');
const checklistRouter = require('./checklist');
const partRouter = require('./part');



router.use('/', authRouter);
router.use(auth);
router.use('/users', userRouter);
router.use('/center', centerRouter);
router.use('/aip', aipRouter);
router.use('/journal', journalRouter);
router.use('/repair', repairRouter);
router.use('/checklist', checklistRouter);
router.use('/part', partRouter);



module.exports = router;