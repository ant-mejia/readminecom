const db = require('../../react-ecommerce/db') //this is required
const Product = require('../../react-ecommerce/db/models/product');
const Review = require('../../react-ecommerce/db/models/review');

const router = require('express').Router()

router.get('/', function(req, res, next) {
  res.status(200).send('result');
});

router.get('/:id', function(req, res, next) {
  Product.findOne({
      where: { id: req.params.id },
      include: [Review]
    })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(next);
});

module.exports = router