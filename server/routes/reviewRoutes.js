const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');

router.post('/:productId', protect, createReview);
router.get('/:productId', getProductReviews);
router.delete('/:reviewId', protect, deleteReview);

module.exports = router;
