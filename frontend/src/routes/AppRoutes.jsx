import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Index from '../pages/Index';
import Configuracoes from '../pages/Configuracoes';
import EditarPefil from '../pages/EditarPerfil';
import RegisterReceita from '../pages/RegisterReceita';
import OAuthConsent from '../pages/oAuth/OAuthConsent';
import OAuthClientRegister from '../pages/OAuthClientRegister';
import PrivateRoute from '../context/PrivateRouteEmpresa';

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/config" element={<Configuracoes />} />
      <Route path="/index" element={<Index />} />
      <Route path="/perfil/editar" element={<EditarPefil />} />
      <Route path="/registerReceita" element={<RegisterReceita />} />
      <Route path="/oauth/authorize" element={<OAuthConsent />} />
      <Route
        path="/oauth/clientRegister"
        element={
          <PrivateRoute requiredRole="empresa">
            <OAuthClientRegister />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default RoutesApp;