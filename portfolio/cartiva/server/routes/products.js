const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products - Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      gender,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search,
      isFeatured,
      isOnSale
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (isFeatured) filter.isFeatured = isFeatured === 'true';
    if (isOnSale) filter.isOnSale = isOnSale === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// GET /api/products/featured - Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
});

// GET /api/products/new/list - Get new products
router.get('/new/list', async (req, res) => {
  try {
    const products = await Product.find({ isNew: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching new products', error: error.message });
  }
});

// GET /api/products/sale/list - Get products on sale
router.get('/sale/list', async (req, res) => {
  try {
    const products = await Product.find({ isOnSale: true, isActive: true })
      .populate('category', 'name slug')
      .sort({ discountPercentage: -1 })
      .limit(8);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sale products', error: error.message });
  }
});

module.exports = router;