const router = require('express').Router();
const newsCtrl = require('./../controllers/newsCtrl');
const { isAuthenticated, authorizeRoles } = require('../middlewares/auth');

// Express servers receive data from the client side through the req object
// in three instances: the req.params, req.query, and req.body objects
// req.params  '/:userid'
// req.query '/search'
// use the req.body object to receive data through POST and PUT requests in the Express server

router
  .route('/')
  .get(newsCtrl.getNews)
  .post(isAuthenticated, authorizeRoles('admin'), newsCtrl.createNews);

router.route('/home').get(newsCtrl.getHomeNews);

module.exports = router;
