import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Index from '../pages/Index';
import Configuracoes from '../pages/Configuracoes';
import EditarPefil from '../pages/EditarPerfil';
import RegisterReceita from '../pages/RegisterReceita';
import OAuthClientRegister from '../pages/OAuthClientRegister';
import MinhasIntegracoes from '../pages/MinhasIntegracoes';
import PrivateRoute from '../context/PrivateRoute';
import { TermosServico } from '../pages/TermosServico'; 
import PainelTermos from '../pages/PainelTermos'; 
import DeleteAccount from '../pages/DeleteAccount';
import EditarReceita from '../pages/EditarReceita';

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/config" element={<Configuracoes />} />
      <Route path="/index" element={<Index />} />
      <Route path="/perfil/editar" element={<EditarPefil />} />
      <Route path="/perfil/integracoes" element={<MinhasIntegracoes />} />
      <Route path="/registerReceita" element={<RegisterReceita />} />
      <Route
        path="/oauth/clientRegister"
        element={
          <PrivateRoute requiredRole="empresa">
            <OAuthClientRegister />
          </PrivateRoute>
        }
      />
      <Route path="/perfil/excluir" element={<DeleteAccount />} />
      <Route path="/registerReceita" element={<RegisterReceita />} />
      <Route path="/painel-termos" element={<PainelTermos />} />
      <Route path="/perfil/termos-servico" element={<TermosServico />} />
      <Route path="/editarReceita" element={<EditarReceita />} />
    </Routes>
  );
};

export default RoutesApp;
