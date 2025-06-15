import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

interface JwtPayload {
  role?: string;
  email?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const getRoleFromToken = (jwt: string): string | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);
      console.log('=== TOKEN DECODIFICADO ===');
      console.log('Token completo:', JSON.stringify(decoded, null, 2));
      console.log('Role encontrado:', decoded.role);
      return decoded.role || null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      console.log('Token carregado:', storedToken ? 'Existe' : 'Não existe');
      
      if (storedToken) {
        setToken(storedToken);
        const role = getRoleFromToken(storedToken);
        setUserRole(role);
        console.log('Role final:', role);
      }
    };

    loadToken();
  }, []);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem('authToken', newToken);
    setToken(newToken);
    const role = getRoleFromToken(newToken);
    setUserRole(role);
    console.log('Login com role:', role);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setToken(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      isAuthenticated: !!token, 
      userRole, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
