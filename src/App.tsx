import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Tutorial from './components/Tutorial';
import PostingService from './components/PostingService';
import SearchService from './components/SearchService';
import Market from './components/Market';
import AdminValidation from './components/AdminValidation';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <Signup onNavigate={setCurrentPage} />;
      case 'tutorial':
        return <Tutorial />;
      case 'posting':
        return <PostingService />;
      case 'search':
        return <SearchService />;
      case 'market':
        return <Market />;
      case 'admin':
        return <AdminValidation />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-gray-900">
          {currentPage !== 'login' && currentPage !== 'signup' && (
            <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
          )}
          {renderPage()}
        </div>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
