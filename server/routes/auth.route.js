const router = require('express').Router();
const authCtrl = require('./../controllers/authCtrl');
const { isAuthenticated } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router.route('/register').post(authCtrl.register);
router.route('/login').post(authCtrl.login);
router.route('/logout').get(authCtrl.logout);
router.route('/refresh_token').get(authCtrl.refreshToken);
router.route('/profile').patch(isAuthenticated, authCtrl.editProfile);

module.exports = router;
