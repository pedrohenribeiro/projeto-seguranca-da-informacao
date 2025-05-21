import Sidebar from './components/Sidebar';
import RoutesApp from './routes/AppRoutes';

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full min-h-screen bg-gray-100">
        <RoutesApp />
      </div>
    </div>
  );
}

export default App;
