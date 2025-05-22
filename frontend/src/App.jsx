import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import RoutesApp from './routes/AppRoutes';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex">
      {isAuthenticated && <Sidebar />}
      <div className={isAuthenticated ? 'ml-64 w-full p-6 min-h-screen bg-gray-100' : 'w-full p-6 min-h-screen bg-gray-100'}>
        <RoutesApp />
      </div>
    </div>
  );
}

export default App;
