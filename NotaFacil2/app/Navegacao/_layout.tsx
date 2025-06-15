import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import HeaderPerfil from '../Perfil/perfil';

export default function TabLayout() {
  const { userRole } = useAuth(); // Certifique-se que esse valor está vindo corretamente

  return (
    <>
      <HeaderPerfil />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: '#ccc',
          tabBarStyle: {
            backgroundColor: '#003F73',
            height: 70,
            paddingBottom: 8,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 6,
            fontWeight: '500',
          },
          tabBarItemStyle: {
            paddingVertical: 6,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="disciplinas"
          options={{
            title: 'Disciplinas',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="library-books" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendário',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="calendar-today" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dasboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        {userRole === 'ESCOLA' && (
            <Tabs.Screen
                name="professores"
                options={{
                title: 'Professores',
                tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="school" size={size} color={color} />
                ),
                }}
            />
            )}
        <Tabs.Screen
          name="notificacoes"
          options={{
            title: 'Notificações',
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons
                name={focused ? 'notifications-active' : 'notifications'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
