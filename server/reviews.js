const db = require('../../react-ecommerce/db') //this is required
const Review = require('../../react-ecommerce/db/models/review');
const Product = require('../../react-ecommerce/db/models/product');

const router = require('express').Router()

router.get('/', function(req, res, next) {
  res.status(200).send(result);
});

router.get('/:id', function(req, res, next) {
  res.status(200).send({ result: 'result' });
});

module.exports = router;