import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllProfessores, deleteProfessor, Professor } from '@/services/professorService';
import { useFocusEffect } from '@react-navigation/native';

interface ProfessorListScreenProps {
  navigation: any;
  route: any;
}

export default function ProfessorListScreen({ navigation, route }: ProfessorListScreenProps) {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfessores = async () => {
    try {
      setLoading(true);
      const data = await getAllProfessores(); 
      setProfessores(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar professores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfessores();
    
    if (route.params?.professorAtualizado) {
      const professorAtualizado = route.params.professorAtualizado;
      setProfessores(prevProfessores => 
        prevProfessores.map(p => 
          p.id === professorAtualizado.id ? professorAtualizado : p
        )
      );
      navigation.setParams({ professorAtualizado: undefined });
    }
  }, [route.params?.professorAtualizado]);

  useFocusEffect(
    React.useCallback(() => {
      fetchProfessores();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfessores();
  };

  const handleEdit = (professor: Professor) => {
    navigation.navigate('ProfessorEdit', { professor });
  };

  const handleDelete = (professor: Professor) => {
    console.log('=== INÍCIO DO HANDLE DELETE ===');
    console.log('Professor recebido:', professor);
    console.log('ID do professor:', professor.id);
    
    Alert.alert(
      'Excluir Professor',
      `Tem certeza que deseja excluir "${professor.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            console.log('=== USUÁRIO CONFIRMOU DELETE ===');
            try {
              console.log('Tentando deletar professor ID:', professor.id);
              await deleteProfessor(professor.id);
              console.log('Delete realizado com sucesso!');
              
              setProfessores(prevProfessores => {
                const novaLista = prevProfessores.filter(p => p.id !== professor.id);
                console.log('Lista atualizada, professores restantes:', novaLista.length);
                return novaLista;
              });
              
              Alert.alert('Sucesso', 'Professor excluído com sucesso!');
            } catch (err) {
              console.error('Erro completo ao excluir professor:', err);
              Alert.alert('Erro', 'Não foi possível excluir o professor');
            }
          }
        }
      ]
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Carregando professores...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error" size={48} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProfessores}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={professores}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007BFF']}
          />
        }
        ListHeaderComponent={
          <Text style={styles.header}>Professores</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.leftSection}>
              <Text style={styles.professorNome}>{item.nome}</Text>
              
              <Text style={styles.label}>Email</Text>
              <Text style={styles.label}>Disciplinas</Text>
            </View>

            <View style={styles.mainDividerLine} />

            <View style={styles.rightSection}>
              <Text style={styles.sectionTitle}> </Text>
              <Text style={styles.value}>{item.email}</Text>
              
              <Text style={styles.value}>
                {item.disciplinas.length > 0 ? item.disciplinas.join(', ') : 'Nenhuma disciplina'}
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEdit(item)}
              >
                <MaterialIcons name="edit" size={18} color="#007BFF" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => {
                  console.log('Botão delete pressionado!');
                  handleDelete(item);
                }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    paddingTop: 16, 
  },
   header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    color: '#999',
    fontWeight: 'bold',
    marginBottom: 8,
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
  dividerLine: {
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});