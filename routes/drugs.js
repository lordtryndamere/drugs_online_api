const router = require('express').Router();


const drugsController = require('../controllers/drugsController');
const verifyToken = require('../services/verifyToken');

router.get('/',verifyToken,drugsController.getDrugs);

module.exports  = router;