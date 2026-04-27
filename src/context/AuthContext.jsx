import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(authService.getToken());
  const [erro,    setErro]    = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, senha) => {
    setLoading(true);
    setErro(null);
    try {
      const novoToken = await authService.login(email, senha);
      setToken(novoToken);
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, erro, login, logout, logado: Boolean(token) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
