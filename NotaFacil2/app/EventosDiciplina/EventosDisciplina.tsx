// screens/EventosDisciplinaScreen.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEventosPorDisciplina } from '../../services/eventoService';
import { Evento } from '../../types/evento';

export default function EventosDisciplinaScreen() {
  const { id, nome } = useLocalSearchParams<{ id: string; nome: string }>();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventos = async () => {
    try {
      const data = await getEventosPorDisciplina(id as string);
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

  const handleAddEvento = () => {
    router.push({
      pathname: '/EventosDiciplina/CriarEventoDisciplina',
      params: { disciplinaId: id, disciplinaNome: nome }
    });
  };

  useEffect(() => {
    if (id) {
      fetchEventos();
    }
  }, [id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEventos();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEventos}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        <View>
          <Text style={styles.header}>{nome || 'Disciplina'}</Text>
          <Text style={styles.subHeader}>Eventos da Disciplina</Text>
        </View>
      </View>
      
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6366f1']}
            tintColor="#6366f1"
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push({
              pathname: '/DetalhesAluno/Detalhes',
              params: { eventoId: item.id }
            })}
          >
            <View style={styles.cardHeader}>
             
              <Text style={styles.eventoNome}>{item.titulo}</Text>
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <MaterialIcons name="calendar-today" size={18} color="#6b7280" />
                <Text style={styles.detailText}>
                  {new Date(item.data).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <MaterialIcons name="access-time" size={18} color="#6b7280" />
                <Text style={styles.detailText}>
                  {new Date(item.data).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
              
              {item.descricao && (
                <View style={styles.detailItem}>
                  <MaterialIcons name="description" size={18} color="#6b7280" />
                  <Text 
                    style={styles.detailText} 
                    numberOfLines={2} 
                    ellipsizeMode="tail"
                  >
                    {item.descricao}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="event-busy" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>Nenhum evento encontrado</Text>
            <Text style={styles.emptySubText}>Toque no botão + para adicionar um novo evento</Text>
          </View>
        }
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={handleAddEvento}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

// Funções auxiliares para ícones e cores baseadas no tipo de evento
const getEventIcon = (tipo: string) => {
  switch(tipo) {
    case 'prova': return 'assignment';
    case 'trabalho': return 'assignment-turned-in';
    case 'seminario': return 'record-voice-over';
    case 'reposicao': return 'update';
    default: return 'event';
  }
};

const getEventColor = (tipo: string) => {
  switch(tipo) {
    case 'prova': return '#ef4444';
    case 'trabalho': return '#3b82f6';
    case 'seminario': return '#10b981';
    case 'reposicao': return '#f59e0b';
    default: return '#6366f1';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 1,
  },
  detailsContainer: {
    marginLeft: 44,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flexShrink: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#9ca3af',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6366f1',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
});