import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userData: any | null;  // Pode tipar melhor conforme seu user
  login: (token: string, user: any) => Promise<void>;
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
  const [userData, setUserData] = useState<any | null>(null);
  const getRoleFromEmail = (jwt: string): string | null => {
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);
      console.log('=== TOKEN DECODIFICADO ===');
      console.log('Token completo:', JSON.stringify(decoded, null, 2));
      console.log('Role encontrado:', decoded.email);
      return decoded.role || null;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

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
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('userData');

      console.log('Token carregado:', storedToken ? 'Existe' : 'Não existe');
      console.log('UserData carregado:', storedUser ? 'Existe' : 'Não existe');

      if (storedToken) {
        setToken(storedToken);
        const role = getRoleFromToken(storedToken);
        setUserRole(role);
      }

      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    };

    loadAuth();
  }, []);

  const login = async (newToken: string, user: any) => {
    await AsyncStorage.setItem('authToken', newToken);
    await AsyncStorage.setItem('userData', JSON.stringify(user));

    setToken(newToken);
    setUserData(user);

    const role = getRoleFromToken(newToken);
    setUserRole(role);

    console.log('Login com role:', role);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');

    setToken(null);
    setUserRole(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        userRole,
        userData,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (storedToken: string) => useContext(AuthContext);
