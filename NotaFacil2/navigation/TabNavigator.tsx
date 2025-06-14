import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import Inicio from '@/screens/Inicio/Inicio';
import HeaderPerfil from '@/components/HeaderPerfil';
import NotificacoesScreen from '@/screens/NotificacoesScreen';
import DashboardScreen from "@/screens/Dashboard/DashboardScreen";

// Telas das tabs
function AtividadesScreen() {
  return (
    <View style={styles.screenContainer}>
      <HeaderPerfil />
      <Text style={styles.screenText}>Tela de Atividades</Text>
    </View>
  );
}

function EquipesScreen() {
  return (
    <View style={styles.screenContainer}>
      <HeaderPerfil />
      <Text style={styles.screenText}>Tela de Equipes</Text>
    </View>
  );
}

function TrabalhoScreen() {
  return (
    <View style={styles.screenContainer}>
      <HeaderPerfil />
      <Text style={styles.screenText}>Tela de Trabalho</Text>
    </View>
  );
}

function CalendarioScreen() {
  return (
    <View style={styles.screenContainer}>
      <HeaderPerfil />
      <Text style={styles.screenText}>Tela de Calendário</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch(route.name) {
            case 'Início':
              iconName = 'home';
              break;
            case 'Atividades':
              iconName = 'assignment';
              break;
            case 'Notificações':
              iconName = focused ? 'notifications-active' : 'notifications';
              break;
            case 'Equipes':
              iconName = 'groups';
              break;
            case 'Trabalho':
              iconName = 'work';
              break;
            case 'Calendário':
              iconName = 'calendar-today';
              break;
          }

          return (
            <MaterialIcons 
            
              size={size} 
              color={color}
              style={focused ? styles.iconFocused : null}
            />
          );
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#003F73',
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 70,
          paddingBottom: 8,
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
      })}
    >
      <Tab.Screen
        name="Início"
        component={Inicio}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="home"
              size={size}
              color={color}
              style={focused ? styles.iconFocused : null}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Atividades"
        component={AtividadesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="assignment"
              size={size}
              color={color}
              style={focused ? styles.iconFocused : null}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notificações"
        component={NotificacoesScreen}
        options={{
          tabBarBadge: 3, // Número de notificações não lidas
          tabBarBadgeStyle: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: 10,
            minWidth: 16,
            height: 16,
          }
        }}
      />
      <Tab.Screen
        name="Equipes"
        component={EquipesScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="groups"
              size={size}
              color={color}
              style={focused ? styles.iconFocused : null}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trabalho"
        component={TrabalhoScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="work"
              size={size}
              color={color}
              style={focused ? styles.iconFocused : null}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendário"
        component={CalendarioScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialIcons
              name="calendar-today"
              size={size}
              color={color}
              style={focused ? styles.iconFocused : null}
            />
          ),
        }}
      />
        <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{
                tabBarIcon: ({ color, size, focused }) => (
                    <MaterialIcons
                        name="dashboard"
                        size={size}
                        color={color}
                        style={focused ? styles.iconFocused : null}
                    />
                ),
            }}
        />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  screenText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  iconFocused: {
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});