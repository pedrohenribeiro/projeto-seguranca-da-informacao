import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import RoutesApp from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const location = useLocation();

  const isPublicPage = ['/login', '/register'].includes(location.pathname);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      {!isPublicPage && isAuthenticated && (
        <Sidebar
          isHovered={isSidebarHovered}
          setIsHovered={setIsSidebarHovered}
        />
      )}
      <div
        className={`w-full min-h-screen bg-gray-100 transition-all duration-300 ease-in-out ${
          !isPublicPage && isAuthenticated ? (isSidebarHovered ? 'ml-64' : 'ml-12') : ''
        }`}
      >
        <RoutesApp />
      </div>
    </div>
  );
}

export default App;
