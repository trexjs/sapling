# Rare Clothing - MERN Ecommerce Website

A modern ecommerce website built with the MERN stack, featuring a clothing brand similar to The House of Rare. This project includes a React frontend with TypeScript, styled-components, and a Node.js/Express backend with MongoDB.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with styled-components
- **Product Catalog**: Browse products by category, gender, and filters
- **Shopping Cart**: Add to cart, update quantities, remove items
- **Search & Filter**: Search products and filter by price, category, gender
- **Product Details**: Detailed product pages with image galleries
- **Category Pages**: Dedicated pages for different clothing categories
- **State Management**: Context API for complex state management
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Mobile-first approach with modern styling

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Styled Components** for CSS-in-JS styling
- **React Router DOM** for navigation
- **Context API** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **Multer** for file uploads (ready for future use)

## 📁 Project Structure

```
rare-clothing-ecommerce/
├── UI/                          # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── context/            # Context API for state management
│   │   ├── services/           # API services
│   │   ├── styles/             # Global styles and styled components
│   │   ├── types/              # TypeScript type definitions
│   │   └── main.tsx            # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Backend Node.js application
│   ├── models/                 # MongoDB models
│   ├── routes/                 # API routes
│   ├── data/                   # Sample data
│   ├── package.json
│   └── index.js               # Server entry point
└── package.json               # Root package.json for scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rare-clothing-ecommerce
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install all dependencies (root, server, and UI)
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/rare-clothing
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the `MONGODB_URI` in the `.env` file.

5. **Seed the database (optional)**
   ```bash
   cd server
   npm run seed
   ```

6. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📱 Features Overview

### Home Page
- Hero section with call-to-action
- Category navigation (Men, Women, Kids)
- Featured products showcase
- New arrivals section
- Sale items section

### Product Pages
- Product listing with filters and search
- Category-specific product pages
- Detailed product view with image gallery
- Size and color selection
- Add to cart functionality

### Shopping Cart
- View cart items
- Update quantities
- Remove items
- Calculate totals with tax
- Proceed to checkout (UI ready)

### Navigation
- Responsive header with search
- Mobile-friendly navigation
- Category-based navigation
- Shopping cart indicator

## 🎨 Styling

The application uses styled-components for a modern, maintainable styling approach:

- **Global Styles**: Consistent typography and base styles
- **Component Styles**: Scoped styling for each component
- **Responsive Design**: Mobile-first approach with breakpoints
- **Theme Colors**: Consistent color palette throughout
- **Modern UI**: Clean, minimalist design inspired by premium fashion brands

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured/list` - Get featured products
- `GET /api/products/new/list` - Get new products
- `GET /api/products/sale/list` - Get products on sale

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get single category

## 🛒 Shopping Cart Features

- **Add to Cart**: Select size, color, and quantity
- **Update Quantities**: Increase/decrease item quantities
- **Remove Items**: Remove items from cart
- **Persistent State**: Cart state managed with Context API
- **Cart Badge**: Header shows cart item count
- **Price Calculation**: Subtotal, tax, and total calculation

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd UI
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service

### Backend (Heroku/Railway)
1. Set environment variables in your hosting service
2. Deploy the `server` folder
3. Update the API base URL in the frontend

### Database
- Use MongoDB Atlas for production
- Update the `MONGODB_URI` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Future Enhancements

- User authentication and accounts
- Order management system
- Payment integration
- Product reviews and ratings
- Wishlist functionality
- Admin dashboard
- Email notifications
- Advanced search with filters
- Product recommendations

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`

2. **Port Already in Use**
   - Change the port in the `.env` file
   - Kill existing processes using the port

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript configuration

4. **API Not Working**
   - Verify backend is running on port 5000
   - Check CORS configuration
   - Ensure MongoDB is connected

## 📞 Support

For support and questions, please open an issue in the repository.

---

Built with ❤️ using the MERN stack
