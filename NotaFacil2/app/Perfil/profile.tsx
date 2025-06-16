import { AlunoDetails, EscolaDetails, ProfessorDetails, UserResponse, UserRole } from '@/types/userTypes';
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DecodedToken {
  sub: string;
  role: UserRole;
}

export default function PerfilScreen() {
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const decoded = decodeToken(token);
        if (!decoded) throw new Error('Invalid token');

        const response = await fetch(`https://projeto-x-cg6v.onrender.com/usuarios/email/${decoded.sub}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to load profile data');
        router.replace('/login/LoginScreen');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const renderEscolaDetails = (details: EscolaDetails) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="school" size={24} color="#4E6CFF" />
        <Text style={styles.cardTitle}>Informações da Escola</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Feather name="map-pin" size={18} color="#888" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Endereço</Text>
          <Text style={styles.infoValue}>{details.endereco}</Text>
        </View>
      </View>
      
      <View style={styles.infoItem}>
        <MaterialIcons name="email" size={18} color="#888" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Emails Permitidos</Text>
          {details.emailsPermitidos.map((email, index) => (
            <Text key={index} style={[styles.infoValue, {marginBottom: 4}]}>• {email}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  const renderProfessorDetails = (details: ProfessorDetails) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <FontAwesome name="user-md" size={24} color="#4E6CFF" />
        <Text style={styles.cardTitle}>Informações do Professor</Text>
      </View>
      
      <View style={styles.infoItem}>
        <Ionicons name="school" size={18} color="#888" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Escola</Text>
          <Text style={styles.infoValue}>{details.escola || 'Não informada'}</Text>
        </View>
      </View>
      
      <View style={styles.infoItem}>
        <MaterialIcons name="menu-book" size={18} color="#888" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Disciplinas</Text>
          {details.disciplinas.map((disciplina, index) => (
            <Text key={index} style={[styles.infoValue, {marginBottom: 4}]}>• {disciplina}</Text>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAlunoDetails = (details: AlunoDetails) => (
    <View style={styles.card}>
     <View style={styles.cardHeader}>
        <FontAwesome name="user" size={24} color="#4E6CFF" />
        <Text style={styles.cardTitle}>Informações do Aluno</Text>
      </View>
      
      <View style={styles.infoItem}>
        <MaterialIcons name="menu-book" size={18} color="#888" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Disciplinas</Text>
          {details.disciplinas.map((disciplina: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: React.Key | null | undefined) => (
            <Text key={index} style={[styles.infoValue, {marginBottom: 4}]}>• {disciplina}</Text>
          ))}
        </View>
      </View>
      
      <View style={styles.infoItem}>
        <MaterialIcons name="grade" size={18} color="#888" />
        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Notas</Text>
          {details.notas && details.notas.length > 0 ? (
            details.notas.map((nota, index) => (
              <View key={index} style={{marginBottom: 4}}>
                <Text style={[styles.infoValue, {fontWeight: '500'}]}>{nota.disciplina}: 
                  <Text style={{color: '#4E6CFF'}}> {nota.valor}</Text>
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhuma nota disponível</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderUserDetails = () => {
    if (!userData?.detalhes) return null;

    switch (userData.tipo) {
      case 'ESCOLA':
        return renderEscolaDetails(userData.detalhes as EscolaDetails);
      case 'PROFESSOR':
        return renderProfessorDetails(userData.detalhes as ProfessorDetails);
      case 'ALUNO':
        return renderAlunoDetails(userData.detalhes as AlunoDetails);
      default:
        return (
          <View style={styles.card}>
            <Text>Informações do usuário não disponíveis</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E6CFF" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ marginBottom: 20, fontSize: 16, color: '#555' }}>Falha ao carregar dados do usuário</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.replace('/login/LoginScreen')}
        >
          <Text style={styles.loginButtonText}>Fazer Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.replace('/Navegacao/disciplinas')} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/pessoa.png')} 
              style={styles.avatar} 
              defaultSource={require('@/assets/pessoa.png')}
            />
          </View>
          
          <Text style={styles.name}>{userData.nome}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userData.tipo}</Text>
          </View>
        </View>

        {renderUserDetails()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#4E6CFF',
    padding: 25,
    alignItems: 'center',
    paddingTop: 60,
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 10,
  },
  avatarContainer: {
    backgroundColor: 'white',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginBottom: 15,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#4E6CFF',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 10,
    shadowColor: '#4E6CFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});