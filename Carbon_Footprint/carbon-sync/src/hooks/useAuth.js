import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const requireAuth = () => {
    if (!loading && !user) {
      navigate('/login');
    }
  };

  return { user, loading, requireAuth };
}; 