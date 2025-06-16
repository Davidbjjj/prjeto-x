import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { getEventoPorId } from '../../services/eventoService';
import { Evento } from '../../types/evento';

export default function DetalhesAlunoScreen() {
  const { eventoId } = useLocalSearchParams<{ eventoId: string }>();

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comentario, setComentario] = useState('');
  const [arquivos, setArquivos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [alunoId, setAlunoId] = useState<string | null>(null);

  interface DecodedToken {
    sub: string;
  }

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('authToken');
        if (!storedToken) throw new Error('Token não encontrado');

        const decoded = decodeToken(storedToken);
        if (!decoded) throw new Error('Token inválido');

        const response = await axios.get(
          `https://projeto-x-cg6v.onrender.com/usuarios/email/${decoded.sub}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );

        setAlunoId(response.data.id);
        setToken(storedToken);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        Alert.alert('Erro', 'Erro ao carregar dados do usuário');
        router.replace('/login/LoginScreen');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (eventoId) {
      fetchEvento();
    }
  }, [eventoId]);

  const fetchEvento = async () => {
    try {
      setLoading(true);
      const data = await getEventoPorId(eventoId);
      setEvento(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const fileName = file.name || file.uri.split('/').pop() || 'arquivo';
        setArquivos((prev) => [...prev, fileName]);
      }
    } catch (err) {
      console.error('Erro ao selecionar arquivo:', err);
      Alert.alert('Erro', 'Erro ao selecionar arquivo');
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...arquivos];
    updatedFiles.splice(index, 1);
    setArquivos(updatedFiles);
  };

  const handleSubmit = async () => {
    if (!alunoId || arquivos.length === 0) {
      return Alert.alert('Erro', 'É necessário anexar pelo menos um arquivo.');
    }

    try {
      setUploading(true);

      const payload = {
        statusEntrega: 'ENTREGUE',
        comentarioEntrega: comentario,
        arquivosEntrega: arquivos,
      };

      await axios.post(
        `https://projeto-x-cg6v.onrender.com/eventos/${eventoId}/alunos/${alunoId}/entregar`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Sucesso', 'Entrega enviada com sucesso!');
      setComentario('');
      setArquivos([]);
      router.back();
    } catch (error) {
      console.error('Erro ao enviar entrega:', error);
      const msg =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'Erro ao enviar entrega. Tente novamente.';
      Alert.alert('Erro', msg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchEvento}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="event-busy" size={48} color="#d1d5db" />
        <Text style={styles.emptyText}>Evento não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header do evento */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
        </TouchableOpacity>
        <Text style={styles.header}>{evento.titulo}</Text>
      </View>

      {/* Detalhes do evento */}
      <View style={styles.card}>
        <View style={styles.detailItem}>
          <MaterialIcons name="calendar-today" size={20} color="#6b7280" />
          <Text style={styles.detailText}>
            {new Date(evento.data).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialIcons name="access-time" size={20} color="#6b7280" />
          <Text style={styles.detailText}>
            {new Date(evento.data).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        {evento.notaMaxima > 0 && (
          <View style={styles.detailItem}>
            <MaterialIcons name="grade" size={20} color="#6b7280" />
            <Text style={styles.detailText}>Nota máxima: {evento.notaMaxima}</Text>
          </View>
        )}
      </View>

      {/* Descrição */}
      {evento.descricao && (
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Descrição do Evento</Text>
          <Text style={styles.descriptionText}>{evento.descricao}</Text>
        </View>
      )}

      {/* Arquivos do professor */}
      {evento.arquivos && evento.arquivos.length > 0 && (
        <View style={styles.filesCard}>
          <Text style={styles.sectionTitle}>Arquivos do Professor</Text>
          {evento.arquivos.map((arq, i) => (
            <View key={i} style={styles.fileItem}>
              <MaterialIcons name="attach-file" size={20} color="#6366f1" />
              <Text style={styles.fileName}>{arq.split('/').pop()}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Formulário de entrega */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Sua Entrega</Text>

        <TextInput
          style={styles.input}
          placeholder="Escreva um comentário (opcional)"
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={4}
          value={comentario}
          onChangeText={setComentario}
        />

        <Text style={styles.filesTitle}>Arquivos Anexados ({arquivos.length})</Text>

        {arquivos.map((nome, i) => (
          <View key={i} style={styles.fileItem}>
            <MaterialIcons name="insert-drive-file" size={20} color="#6366f1" />
            <Text style={styles.fileName}>{nome}</Text>
            <TouchableOpacity onPress={() => removeFile(i)}>
              <MaterialIcons name="close" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}

        {arquivos.length === 0 && <Text style={styles.noFilesText}>Nenhum arquivo anexado</Text>}

        <TouchableOpacity style={styles.addFileButton} onPress={pickDocument}>
          <Feather name="paperclip" size={20} color="#6366f1" />
          <Text style={styles.addFileButtonText}>Anexar Arquivo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, uploading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Enviar Entrega</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
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
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
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
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#6b7280',
    marginLeft: 8,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
  },
  filesCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
    marginRight: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 100,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  filesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  filesList: {
    marginBottom: 16,
  },
  noFilesText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    textAlign: 'center',
  },
  addFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 24,
  },
  addFileButtonText: {
    fontSize: 15,
    color: '#6366f1',
    marginLeft: 8,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
