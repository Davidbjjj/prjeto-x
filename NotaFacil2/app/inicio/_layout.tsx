import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function InicioLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="calendario" 
        options={{ 
          title: 'Calendário',
          tabBarIcon: ({ color }) => <Ionicons name="calendar" size={24} color={color} />
        }} 
      />
      <Tabs.Screen 
        name="sobre" 
        options={{ 
          title: 'Sobre',
          tabBarIcon: ({ color }) => <Ionicons name="information-circle" size={24} color={color} />
        }} 
      />
    </Tabs>
  );
}