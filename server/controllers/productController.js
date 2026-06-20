const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter);

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getNewProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(6);

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ price: 1 }).limit(6);

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([{ $sample: { size: 6 } }]);

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getBundleSuggestions = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);

    if (!currentProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const name = currentProduct.name.toLowerCase();
    let regex1 = null;
    let regex2 = null;

    if (name.includes('serum')) {
      regex1 = /moisturizer/i;
      regex2 = /sunscreen|spf/i;
    } else if (name.includes('shampoo')) {
      regex1 = /hair mask/i;
      regex2 = /hair oil|argan/i;
    } else if (name.includes('cleanser')) {
      regex1 = /moisturizer/i;
      regex2 = /serum/i;
    } else if (name.includes('body scrub')) {
      regex1 = /body butter|body oil/i;
      regex2 = /body mist|lotion/i;
    } else if (name.includes('lipstick')) {
      regex1 = /foundation/i;
      regex2 = /bronzer|blush/i;
    } else if (name.includes('foundation')) {
      regex1 = /bronzer|blush/i;
      regex2 = /brush/i;
    }

    if (!regex1 || !regex2) {
      return res.status(200).json({ products: [] });
    }

    const [product1, product2] = await Promise.all([
      Product.findOne({ name: regex1, _id: { $ne: currentProduct._id } }),
      Product.findOne({ name: regex2, _id: { $ne: currentProduct._id } }),
    ]);

    const individualTotal = currentProduct.price + (product1?.price || 0) + (product2?.price || 0);
    const bundleDiscount = 0.15;
    const bundlePrice = (individualTotal * (1 - bundleDiscount)).toFixed(2);

    return res.status(200).json({
      products: [currentProduct, product1, product2].filter(Boolean),
      individualTotal: individualTotal.toFixed(2),
      bundlePrice,
      savings: (individualTotal - bundlePrice).toFixed(2),
      discount: '15%',
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getNewProducts,
  getSaleProducts,
  getRecommendedProducts,
  getBundleSuggestions,
};
