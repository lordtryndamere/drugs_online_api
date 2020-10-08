const router = require("express").Router();
const isLoggedIn = require('../middlewares/isLogged');
const authperole = require('../middlewares/authValidationPerRole');
const AuthController = require= require('../controllers/authController');
const authcontroller = new AuthController();



router.post("/register", authcontroller.register  );
router.post('/login',authcontroller.login  );
router.get('/getUser/:id',isLoggedIn,authperole.grantAccess('readAny', 'user'),isLoggedIn, authcontroller.getUser);
router.get('/getProfile',isLoggedIn,authperole.grantAccess('readOwn', 'profile'), authcontroller.getProfile);
router.get('/getUsers',isLoggedIn,authperole.grantAccess('readAny', 'user'),authcontroller.getUsers);
router.put('/updateUser/:id',isLoggedIn,authperole.grantAccess('updateAny', 'user'), authcontroller.updateUser);
router.put('/updateProfile',isLoggedIn,authperole.grantAccess('updateOwn', 'profile'), authcontroller.updateProfile);
router.delete('/deleteUser/:id',isLoggedIn,authperole.grantAccess('deleteAny', 'user'), authcontroller.deleteUser);

module.exports = router;
