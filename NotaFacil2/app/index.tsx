import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // Opcional - se tiver autenticação

export default function Index() {
  // Se você tiver verificação de autenticação
  useAuth(); // Remove esta linha se não usar autenticação
  
  // Redireciona diretamente para a tela de login
  return <Redirect href="/login/LoginScreen" />;
  
  // Se estiver usando autenticação, pode fazer assim:
  // return user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />;
}