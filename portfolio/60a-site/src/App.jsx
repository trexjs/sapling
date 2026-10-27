import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Careers from './pages/Careers';
import JobDetail from './pages/JobDetail';
import About from './pages/About';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import Partners from './pages/Partners';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PasswordSetup from './pages/PasswordSetup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HelpCenterHome from './modules/help-center/HelpCenterHome';
import ArticleDetail from './modules/help-center/ArticleDetail';
import TicketDashboard from './modules/help-center/TicketDashboard';
import SupportLogin from './modules/help-center/SupportLogin';
import CreateTicket from './modules/help-center/CreateTicket';
import TicketDetail from './modules/help-center/TicketDetail';
import FormBuilder from './modules/formbuilder/FormBuilder';
import TemplatesMarketplace from './modules/formbuilder/TemplatesMarketplace';
import './App.css';

function AppContent() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const location = useLocation();
  
  // Check if current route is an auth page or help center page
  const authRoutes = ['/login', '/signup', '/password-setup', '/forgot-password', '/reset-password'];
  const helpCenterRoutes = ['/help-center', '/tickets', '/support/login'];
  const isAuthPage = authRoutes.includes(location.pathname);
  const isHelpCenterPage = helpCenterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAuthPage && !isHelpCenterPage && <AnnouncementBar />}
      {!isAuthPage && !isHelpCenterPage && <Header onDemoClick={() => setIsDemoModalOpen(true)} />}
      <main className={isAuthPage || isHelpCenterPage ? '' : 'flex-grow'}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero onDemoClick={() => setIsDemoModalOpen(true)} />
                  <Features />
                </>
              }
            />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/products/formbuilder" element={<FormBuilder />} />
            <Route path="/products/formbuilder/templates" element={<TemplatesMarketplace />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/:id" element={<JobDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/password-setup" element={<PasswordSetup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/help-center" element={<HelpCenterHome />} />
            <Route path="/help-center/article/:id" element={<ArticleDetail />} />
            <Route path="/tickets" element={<TicketDashboard />} />
            <Route path="/tickets/create" element={<CreateTicket />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/support/login" element={<SupportLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAuthPage && !isHelpCenterPage && <Footer />}
        {!isAuthPage && !isHelpCenterPage && (
          <>
            <DemoModal
              isOpen={isDemoModalOpen}
              onClose={() => setIsDemoModalOpen(false)}
            />
            <ScrollToTopButton />
          </>
        )}
      </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
