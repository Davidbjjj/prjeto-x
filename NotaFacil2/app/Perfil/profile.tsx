import { AlunoDetails, EscolaDetails, ProfessorDetails, UserResponse, UserRole } from '@/types/userTypes';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

        const response = await fetch(`https://backnotas.onrender.com/usuarios/email/${decoded.sub}`, {
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
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informações da Escola</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Endereço:</Text>
        <Text style={styles.infoValue}>{details.endereco}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Emails Permitidos:</Text>
        <Text style={styles.infoValue}>{details.emailsPermitidos.join(', ') || 'Nenhum'}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Professores:</Text>
        <Text style={styles.infoValue}>{details.professores.length}</Text>
      </View>
    </View>
  );

  const renderProfessorDetails = (details: ProfessorDetails) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informações do Professor</Text>
      {details.escolaNome && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Escola:</Text>
          <Text style={styles.infoValue}>{details.escolaNome}</Text>
        </View>
      )}
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Disciplinas:</Text>
        <Text style={styles.infoValue}>{details.disciplinas.join(', ') || 'Nenhuma'}</Text>
      </View>
    </View>
  );

  const renderAlunoDetails = (details: AlunoDetails) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informações do Aluno</Text>
      {details.turma && (
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Turma:</Text>
          <Text style={styles.infoValue}>{details.turma}</Text>
        </View>
      )}
      <Text style={styles.sectionSubtitle}>Notas</Text>
      {details.notas.length > 0 ? (
        details.notas.map((nota, index) => (
          <View key={index} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{nota.disciplina}:</Text>
            <Text style={styles.infoValue}>{nota.valor}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Nenhuma nota disponível</Text>
      )}
    </View>
  );

  const renderUserDetails = () => {
    if (!userData?.detalhes) return null;

    switch (userData.detalhes.role) {
      case 'ESCOLA':
        return renderEscolaDetails(userData.detalhes as EscolaDetails);
      case 'PROFESSOR':
        return renderProfessorDetails(userData.detalhes as ProfessorDetails);
      case 'ALUNO':
        return renderAlunoDetails(userData.detalhes as AlunoDetails);
      default:
        return (
          <View style={styles.section}>
            <Text>Informações do usuário não disponíveis</Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ marginBottom: 20 }}>Falha ao carregar dados do usuário</Text>
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
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() =>  router.replace('/Navegacao/disciplinas')} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Image 
          source={require('@/assets/pessoa.png')} 
          style={styles.avatar} 
          defaultSource={require('@/assets/pessoa.png')}
        />
        
        <Text style={styles.name}>{userData.nome}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <Text style={styles.role}>{userData.tipo}</Text>
      </View>

      {renderUserDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#003366',
    padding: 20,
    alignItems: 'center',
    paddingTop: 50,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 5,
  },
  role: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 120,
    color: '#333',
  },
  infoValue: {
    flex: 1,
    color: '#555',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
  loginButton: {
    backgroundColor: '#003366',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});