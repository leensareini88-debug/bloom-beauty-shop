const express = require('express');
const {
  getAllProducts,
  getProductById,
  getNewProducts,
  getSaleProducts,
  getRecommendedProducts,
  getBundleSuggestions,
} = require('../controllers/productController');

const router = express.Router();

router.get('/new', getNewProducts);
router.get('/sale', getSaleProducts);
router.get('/recommended', getRecommendedProducts);
router.get('/:id/bundle', getBundleSuggestions);
router.get('/:id', getProductById);
router.get('/', getAllProducts);

module.exports = router;
