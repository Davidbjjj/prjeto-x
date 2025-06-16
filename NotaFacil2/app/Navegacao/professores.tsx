import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { addPermittedEmail } from '../../services/escolaService';
import { deleteProfessor, getAllProfessores, Professor } from '../../services/professorService';

interface DecodedToken {
  sub: string;  // email do usuário
  role?: string;
}

export default function ProfessorListScreen() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nomeEscola, setNomeEscola] = useState('');

  const router = useRouter();

  // Busca dados do usuário para obter o nome da escola (data.nome)
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No token found');

      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded || !decoded.sub) throw new Error('Invalid token');

      const response = await fetch(`https://projeto-x-cg6v.onrender.com/usuarios/email/${decoded.sub}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      // Ajuste aqui: pegar o nome da escola do campo 'nome'
      setNomeEscola(data.email || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Busca todos os professores
  const fetchProfessores = async () => {
    try {
      setLoading(true);
      const data = await getAllProfessores();
      setProfessores(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar professores');
      console.error('Erro ao buscar professores:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchProfessores();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchProfessores();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfessores();
  };

  const handleEdit = (professor: Professor) => {
    router.push(`/EditarProfessor/editarProfessor?id=${professor.id}`);
  };

  const handleDelete = async (professor: Professor) => {
    Alert.alert(
      'Excluir Professor',
      `Tem certeza que deseja excluir "${professor.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfessor(professor.id);
              setProfessores((prev) => prev.filter((p) => p.id !== professor.id));
              Alert.alert('Sucesso', 'Professor excluído com sucesso!');
            } catch (err) {
              console.error('Erro ao excluir professor:', err);
              Alert.alert('Erro', 'Não foi possível excluir o professor');
            }
          },
        },
      ]
    );
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    if (!nomeEscola) {
      Alert.alert('Erro', 'Não foi possível identificar a escola');
      return;
    }

    setIsSubmitting(true);
    try {
      await addPermittedEmail(nomeEscola, email);
      Alert.alert('Sucesso', 'Email adicionado com sucesso!');
      setModalVisible(false);
      setEmail('');
    } catch (err) {
      console.error('Erro ao adicionar email:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o email');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando professores...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={professores}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007BFF']} />
        }
        ListHeaderComponent={<Text style={styles.header}>Professores</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <Text style={styles.professorNome}>{item.nome}</Text>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.label}>Disciplinas</Text>
            </View>

            <View style={styles.mainDividerLine} />

            <View style={styles.rightSection}>
              <Text style={styles.value}>{item.email}</Text>
              <Text style={styles.value}>
                {item.disciplinas?.length > 0 ? item.disciplinas.join(', ') : 'Nenhuma disciplina'}
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
                <MaterialIcons name="edit" size={18} color="#007BFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDelete(item)}
              >
                <MaterialIcons name="delete" size={18} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="group" size={64} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum professor cadastrado</Text>
            <Text style={styles.emptySubtext}>Os professores aparecerão aqui</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão flutuante para adicionar email */}
      <TouchableOpacity style={styles.addEmailButton} onPress={() => setModalVisible(true)}>
        <MaterialIcons name="email" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal para adicionar email */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEmail('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Email Permitido</Text>
            <Text style={styles.modalSubtitle}>Escola: {nomeEscola || 'Carregando...'}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Digite o email do professor"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEmail('');
                }}
                disabled={isSubmitting}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleAddEmail}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Adicionar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  addEmailButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007BFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007BFF',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 100,
  },
  leftSection: {
    flex: 1,
    paddingRight: 8,
  },
  rightSection: {
    flex: 1,
    paddingLeft: 8,
  },
  professorNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  value: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  mainDividerLine: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
    alignSelf: 'stretch',
  },
  actionsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
});
