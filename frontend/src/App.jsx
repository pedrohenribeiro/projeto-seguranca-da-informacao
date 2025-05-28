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
    <>
      {!isPublicPage && isAuthenticated && (
        <Sidebar/>
      )}
      <div
        className={`min-h-screen bg-gray-100  ${
          !isPublicPage && isAuthenticated ? isSidebarHovered : ''
        }`}
      >
        <RoutesApp />
      </div>
    </>
  );
}

export default App;
