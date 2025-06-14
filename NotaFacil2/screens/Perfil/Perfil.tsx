import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { ImageSourcePropType } from "react-native";

interface UserData {
  email: string;
  tipo: string;
  id: string;
  nome: string;
  avatar?: ImageSourcePropType;
  detalhes: {
    notas: any[];
    disciplinas: any[];
  };
}

interface DecodedToken {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export default function Perfil() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token: string) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        email: decoded.sub,
        tipo: decoded.role,
        iat: decoded.iat,
        exp: decoded.exp
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 1. Recuperar o token do AsyncStorage
           let token = await AsyncStorage.getItem('@auth_token') || 
                        await AsyncStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // 2. Decodificar o token JWT
        const tokenData = decodeToken(token);
        
        if (!tokenData) {
          throw new Error('Token inválido');
        }

        // 3. Verificar se o token expirou
        const isExpired = Date.now() >= tokenData.exp * 1000;
        if (isExpired) {
          throw new Error('Token expirado');
        }

        // 4. Fazer requisição para obter dados do usuário
        const response = await fetch(
          `http://localhost:8081/usuarios/email/${encodeURIComponent(tokenData.email)}`, 
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        const userFromApi = await response.json();

        // 5. Formatando os dados para o estado
        setUserData({
          email: tokenData.email,
          tipo: tokenData.tipo,
          id: userFromApi.id,
          nome: userFromApi.nome,
          avatar: userFromApi.avatar 
            ? { uri: userFromApi.avatar } 
            : require('../../assets/pessoa.png'),
          detalhes: userFromApi.detalhes || {
            notas: [],
            disciplinas: []
          }
        });

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert(
          'Erro'
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading || !userData) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#003366" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Image 
          source={userData.avatar} 
          style={styles.avatar} 
        />
        
        <Text style={styles.name}>{userData.nome}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      {/* Informações do usuário */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo:</Text>
          <Text style={styles.infoValue}>{userData.tipo}</Text>
        </View>
      </View>

      {/* Disciplinas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disciplinas</Text>
        {userData.detalhes.disciplinas.length > 0 ? (
          userData.detalhes.disciplinas.map((disciplina, index) => (
            <Text key={index} style={styles.itemText}>
              • {disciplina.nome} - Nota: {disciplina.nota || 'N/A'}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
        )}
      </View>

      {/* Notas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notas</Text>
        {userData.detalhes.notas.length > 0 ? (
          userData.detalhes.notas.map((nota, index) => (
            <Text key={index} style={styles.itemText}>
              • {nota.descricao}: {nota.valor}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma nota encontrada</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#003366",
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  infoContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 80,
  },
  infoValue: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#003366',
  },
  itemText: {
    marginBottom: 5,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
  },
});