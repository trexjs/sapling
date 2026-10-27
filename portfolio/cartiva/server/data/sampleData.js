const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const sampleCategories = [
  {
    name: 'Men\'s Collection',
    slug: 'men',
    description: 'Stylish and comfortable clothing for men',
    gender: 'men',
    sortOrder: 1
  },
  {
    name: 'Women\'s Collection',
    slug: 'women',
    description: 'Elegant and fashionable clothing for women',
    gender: 'women',
    sortOrder: 2
  },
  {
    name: 'Kids\' Collection',
    slug: 'kids',
    description: 'Fun and comfortable clothing for children',
    gender: 'kids',
    sortOrder: 3
  },
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Comfortable and stylish t-shirts for everyday wear',
    gender: 'men',
    sortOrder: 4
  },
  {
    name: 'Dresses',
    slug: 'dresses',
    description: 'Elegant and fashionable dresses for every occasion',
    gender: 'women',
    sortOrder: 5
  },
  {
    name: 'Jeans',
    slug: 'jeans',
    description: 'Classic and modern jeans for all ages',
    gender: 'unisex',
    sortOrder: 6
  },
  {
    name: 'Hoodies',
    slug: 'hoodies',
    description: 'Cozy and trendy hoodies for comfort',
    gender: 'unisex',
    sortOrder: 7
  }
];

const sampleProducts = [
  {
    name: 'Premium Cotton T-Shirt',
    description: 'Soft, breathable cotton t-shirt with a modern fit. Perfect for everyday wear.',
    price: 29.99,
    originalPrice: 39.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', alt: 'Premium Cotton T-Shirt' }
    ],
    gender: 'men',
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 }
    ],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Navy', hex: '#1B2951' }
    ],
    tags: ['cotton', 'casual', 'basic'],
    isNew: true,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 23
  },
  {
    name: 'Elegant Summer Dress',
    description: 'Lightweight and flowy summer dress perfect for warm weather occasions.',
    price: 79.99,
    originalPrice: 99.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500', alt: 'Elegant Summer Dress' }
    ],
    gender: 'women',
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 8 },
      { size: 'M', stock: 12 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 6 }
    ],
    colors: [
      { name: 'Floral', hex: '#FFB6C1' },
      { name: 'Blue', hex: '#87CEEB' },
      { name: 'White', hex: '#FFFFFF' }
    ],
    tags: ['summer', 'dress', 'elegant'],
    isOnSale: true,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 45
  },
  {
    name: 'Classic Denim Jeans',
    description: 'Timeless denim jeans with a perfect fit and premium quality.',
    price: 89.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', alt: 'Classic Denim Jeans' }
    ],
    gender: 'unisex',
    sizes: [
      { size: '28', stock: 8 },
      { size: '30', stock: 12 },
      { size: '32', stock: 15 },
      { size: '34', stock: 10 },
      { size: '36', stock: 6 }
    ],
    colors: [
      { name: 'Dark Blue', hex: '#191970' },
      { name: 'Light Blue', hex: '#87CEEB' },
      { name: 'Black', hex: '#000000' }
    ],
    tags: ['denim', 'jeans', 'classic'],
    isFeatured: true,
    rating: 4.3,
    reviewCount: 67
  },
  {
    name: 'Cozy Fleece Hoodie',
    description: 'Ultra-soft fleece hoodie for maximum comfort and warmth.',
    price: 59.99,
    originalPrice: 79.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', alt: 'Cozy Fleece Hoodie' }
    ],
    gender: 'unisex',
    sizes: [
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 12 },
      { size: 'XL', stock: 8 },
      { size: 'XXL', stock: 5 }
    ],
    colors: [
      { name: 'Gray', hex: '#808080' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#1B2951' }
    ],
    tags: ['hoodie', 'fleece', 'cozy'],
    isOnSale: true,
    discountPercentage: 25,
    rating: 4.6,
    reviewCount: 34
  },
  {
    name: 'Kids Fun T-Shirt',
    description: 'Colorful and comfortable t-shirt designed specifically for kids.',
    price: 19.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', alt: 'Kids Fun T-Shirt' }
    ],
    gender: 'kids',
    sizes: [
      { size: '4', stock: 8 },
      { size: '6', stock: 10 },
      { size: '8', stock: 12 },
      { size: '10', stock: 8 },
      { size: '12', stock: 6 }
    ],
    colors: [
      { name: 'Red', hex: '#FF0000' },
      { name: 'Blue', hex: '#0000FF' },
      { name: 'Green', hex: '#00FF00' },
      { name: 'Yellow', hex: '#FFFF00' }
    ],
    tags: ['kids', 'colorful', 'fun'],
    isNew: true,
    rating: 4.7,
    reviewCount: 28
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create categories
    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('Categories created:', createdCategories.length);

    // Create products with category references
    const productsWithCategories = sampleProducts.map((product, index) => {
      // Assign products to appropriate categories based on gender
      let categoryIndex;
      if (product.gender === 'men') {
        categoryIndex = 0; // Men's Collection
      } else if (product.gender === 'women') {
        categoryIndex = 1; // Women's Collection
      } else if (product.gender === 'kids') {
        categoryIndex = 2; // Kids' Collection
      } else {
        categoryIndex = 3; // T-Shirts (unisex)
      }
      
      return {
        ...product,
        category: createdCategories[categoryIndex]._id
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    console.log('Products created:', createdProducts.length);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
