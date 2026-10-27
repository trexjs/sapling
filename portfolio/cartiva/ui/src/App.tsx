import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Cart from './pages/Cart';
// Static pages
import About from './pages/static/About';
import Contact from './pages/static/Contact';
import Shipping from './pages/static/Shipping';
import Returns from './pages/static/Returns';
import SizeGuide from './pages/static/SizeGuide';
import Careers from './pages/static/Careers';
import Press from './pages/static/Press';
import Sustainability from './pages/static/Sustainability';
import { Container } from './styles/App.styles';

function App() {
  return (
    <AppProvider>
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/cart" element={<Cart />} />
          {/* Static pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/sustainability" element={<Sustainability />} />
        </Routes>
        <Footer />
      </Container>
    </AppProvider>
  );
}

export default App;