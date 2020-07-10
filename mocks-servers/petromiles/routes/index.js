var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/stop', function(req, res, next) {
  process.exit(0);
});

module.exports = router;
