const router = require("express").Router();
const AuthController = require= require('../controllers/authController');
const authcontroller = new AuthController();

router.post("/register", authcontroller.register  );
router.post('/login',authcontroller.login  );
router.get('/getUser/:id', authcontroller.getUser);
router.get('/getUsers',authcontroller.getUsers);
router.put('/updateUser/:id', authcontroller.updateUser);
router.delete('/deleteUser/:id', authcontroller.deleteUser);

module.exports = router;
