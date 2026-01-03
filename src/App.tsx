import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PopupProvider } from './contexts/PopupContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Tutorial from './components/Tutorial';
import PostingService from './components/PostingService';
import SearchService from './components/SearchService';
import Market from './components/Market';
import AdminValidation from './components/AdminValidation';
import Footer from './components/Footer';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  // Hide Navbar on login and signup pages
  const showNavbar = !['/login', '/signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/posting-service" element={<PostingService />} />
        <Route path="/search-service" element={<SearchService />} />
        <Route path="/market" element={<Market />} />
        <Route path="/admin" element={<AdminValidation />} />
        {/* Fallback to Home for unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  // We need to wrap the content in styling/context, but useLocation must be inside Router.
  // App is wrapped by BrowserRouter in main.tsx, so we can use useLocation here?
  // Yes, main.tsx has BrowserRouter wrapping App.

  return (
    <AuthProvider>
      <LanguageProvider>
        <PopupProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </PopupProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
