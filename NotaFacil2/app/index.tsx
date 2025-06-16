// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext'; // Se estiver usando autenticação

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Se o usuário estiver autenticado, vai para a home (exemplo: /(tabs)/home)
  // Senão, vai para o login
  if (isAuthenticated) {
    return <Redirect href="/Navegacao/disciplinas" />;
  } else {
    return <Redirect href="/Home/Home" />;
  }
}
