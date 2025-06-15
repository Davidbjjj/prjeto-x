import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEventosPorAluno } from '../../services/eventoService';
import { Evento } from '../../types/evento';

const EMAIL_ALUNO = 'mar55a@exemlo.com';

export default function EventosAluno() {
  const navigation = useNavigation();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventos = async () => {
    try {
      const data = await getEventosPorAluno(EMAIL_ALUNO);
      setEventos(data);
      setError('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventos();
  };

  const handleAddEvento = () => {
    router.replace('/EventoProfessor/EventoProfessor');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventoCard}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons 
                  name="event" 
                  size={24} 
                  color="#007BFF" 
                />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.titulo}>{item.titulo}</Text>
                <Text style={styles.disciplina}>{item.disciplinaNome}</Text>
                
                <View style={styles.detalhes}>
                  <Text style={styles.data}>
                    {new Date(item.data).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  <Text style={styles.nota}>Nota Máx: {item.notaMaxima}</Text>
                </View>

                {item.arquivos?.length > 0 && (
                  <View style={styles.arquivosContainer}>
                    <Text style={styles.arquivosTitulo}>Anexos:</Text>
                    {item.arquivos.map((arquivo, index) => (
                      <Text key={index} style={styles.arquivo}>• {arquivo}</Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007BFF']}
          />
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Botão flutuante para adicionar evento */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddEvento}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  eventoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 4,
  },
  disciplina: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  detalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  data: {
    fontSize: 14,
    color: '#666',
  },
  nota: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  arquivosContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  arquivosTitulo: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 14,
  },
  arquivo: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});