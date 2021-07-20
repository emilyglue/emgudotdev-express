var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'oh hey there' });
});

/* GET home page. */
router.get('/play', function(req, res, next) {
  res.render('arcade', { title: 'the game stop' });
});


module.exports = router;
