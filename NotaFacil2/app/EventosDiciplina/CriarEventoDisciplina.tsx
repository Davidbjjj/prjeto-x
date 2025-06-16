// screens/eventos/novo.tsx
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { criarEventoNaDisciplina } from '../../services/eventoService';

export default function NovoEventoScreen() {
  const { disciplinaId, disciplinaNome } = useLocalSearchParams<{ disciplinaId: string; disciplinaNome: string }>();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [notaMaxima, setNotaMaxima] = useState('');
  const [data, setData] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    return now;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [arquivos, setArquivos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tipoEvento, setTipoEvento] = useState<'prova' | 'trabalho' | 'seminario' | 'reposicao' | 'outro'>('prova');

  const selecionarArquivo = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });

      if (resultado.assets && resultado.assets.length > 0) {
        setArquivos((prev) => [...prev, resultado.assets[0].name]);
      }
    } catch (err) {
      console.log('Erro ao selecionar arquivo:', err);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
    }
  };

  const onChangeDateTime = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      const now = new Date();
      if (selectedDate < now) {
        Alert.alert('Data inválida', 'Não é possível criar eventos no passado');
        return;
      }
      
      setData(selectedDate);
      
      if (Platform.OS === 'ios' && pickerMode === 'date') {
        setPickerMode('time');
      } else {
        setShowDatePicker(false);
      }
    }
  };

  const showDatepicker = () => {
    setPickerMode('date');
    setShowDatePicker(true);
  };

  const showTimepicker = () => {
    setPickerMode('time');
    setShowDatePicker(true);
  };

  const formatarDataExibicao = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarDataEnvio = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  };

  const criarEvento = async () => {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'O título do evento é obrigatório!');
      return;
    }

    if (!descricao.trim()) {
      Alert.alert('Erro', 'A descrição do evento é obrigatória!');
      return;
    }

    const nota = parseFloat(notaMaxima);
    if (isNaN(nota) || nota <= 0) {
      Alert.alert('Erro', 'A nota máxima deve ser um número positivo');
      return;
    }

    setIsLoading(true);
    try {
      await criarEventoNaDisciplina(disciplinaId!, {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        notaMaxima: nota,
        data: formatarDataEnvio(data),
        arquivos,
        disciplinaId: ''
      });
      
      Alert.alert('Sucesso', 'Evento criado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      Alert.alert('Erro', 'Falha ao criar evento');
    } finally {
      setIsLoading(false);
    }
  };

  const getTipoEventoColor = (tipo: string) => {
    return tipo === tipoEvento ? '#6366f1' : '#e5e7eb';
  };

  const getTipoEventoTextColor = (tipo: string) => {
    return tipo === tipoEvento ? '#fff' : '#4b5563';
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Novo Evento</Text>
          <Text style={styles.subtitle}>{disciplinaNome}</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Tipo de Evento */}
          <Text style={styles.label}>Tipo de Evento</Text>
          <View style={styles.tipoEventoContainer}>
            <TouchableOpacity 
              style={[styles.tipoEventoButton, { backgroundColor: getTipoEventoColor('prova') }]}
              onPress={() => setTipoEvento('prova')}
            >
              <MaterialIcons name="assignment" size={18} color={getTipoEventoTextColor('prova')} />
              <Text style={[styles.tipoEventoText, { color: getTipoEventoTextColor('prova') }]}>Prova</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tipoEventoButton, { backgroundColor: getTipoEventoColor('trabalho') }]}
              onPress={() => setTipoEvento('trabalho')}
            >
              <MaterialIcons name="assignment-turned-in" size={18} color={getTipoEventoTextColor('trabalho')} />
              <Text style={[styles.tipoEventoText, { color: getTipoEventoTextColor('trabalho') }]}>Trabalho</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tipoEventoButton, { backgroundColor: getTipoEventoColor('seminario') }]}
              onPress={() => setTipoEvento('seminario')}
            >
              <MaterialIcons name="record-voice-over" size={18} color={getTipoEventoTextColor('seminario')} />
              <Text style={[styles.tipoEventoText, { color: getTipoEventoTextColor('seminario') }]}>Seminário</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tipoEventoButton, { backgroundColor: getTipoEventoColor('reposicao') }]}
              onPress={() => setTipoEvento('reposicao')}
            >
              <MaterialIcons name="update" size={18} color={getTipoEventoTextColor('reposicao')} />
              <Text style={[styles.tipoEventoText, { color: getTipoEventoTextColor('reposicao') }]}>Reposição</Text>
            </TouchableOpacity>
          </View>

          {/* Título */}
          <Text style={styles.label}>Título *</Text>
          <TextInput 
            style={styles.input} 
            value={titulo} 
            onChangeText={setTitulo}
            placeholder="Ex: Apresentação Final"
            placeholderTextColor="#9ca3af"
            maxLength={100}
          />

          {/* Descrição */}
          <Text style={styles.label}>Descrição *</Text>
          <TextInput 
            style={[styles.input, styles.multilineInput]} 
            value={descricao} 
            onChangeText={setDescricao}
            multiline
            placeholder="Descreva o evento..."
            placeholderTextColor="#9ca3af"
            textAlignVertical="top"
          />

          {/* Nota Máxima */}
          <Text style={styles.label}>Nota Máxima *</Text>
          <TextInput
            style={styles.input}
            value={notaMaxima}
            onChangeText={setNotaMaxima}
            keyboardType="numeric"
            placeholder="Ex: 10.0"
            placeholderTextColor="#9ca3af"
          />

          {/* Data e Hora */}
          <Text style={styles.label}>Data e Hora *</Text>
          
          <View style={styles.datetimeContainer}>
            <TouchableOpacity 
              onPress={showDatepicker} 
              style={styles.datetimeButton}
            >
              <MaterialIcons name="calendar-today" size={20} color="#6366f1" />
              <Text style={styles.datetimeButtonText}>
                {data.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={showTimepicker} 
              style={styles.datetimeButton}
            >
              <MaterialIcons name="access-time" size={20} color="#6366f1" />
              <Text style={styles.datetimeButtonText}>
                {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.datetimeHelpText}>
            {formatarDataExibicao(data)}
          </Text>

          {showDatePicker && (
            <DateTimePicker
              value={data}
              mode={pickerMode}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeDateTime}
              minimumDate={new Date()}
              minuteInterval={15}
              locale="pt-BR"
              themeVariant="light"
            />
          )}

          {/* Anexos */}
          <Text style={styles.label}>Anexos</Text>
          <TouchableOpacity 
            onPress={selecionarArquivo} 
            style={styles.anexoButton}
            activeOpacity={0.8}
          >
            <MaterialIcons name="attach-file" size={20} color="#6366f1" />
            <Text style={styles.anexoButtonText}>Adicionar Arquivo</Text>
          </TouchableOpacity>

          {arquivos.length > 0 && (
            <View style={styles.listaArquivos}>
              {arquivos.map((arquivo, index) => (
                <View key={index} style={styles.arquivoItem}>
                  <MaterialIcons name="insert-drive-file" size={18} color="#6b7280" />
                  <Text style={styles.arquivoNome} numberOfLines={1} ellipsizeMode="middle">
                    {arquivo}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => {
                      const novosArquivos = [...arquivos];
                      novosArquivos.splice(index, 1);
                      setArquivos(novosArquivos);
                    }}
                    style={styles.removerBotao}
                  >
                    <MaterialIcons name="close" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Botão de Criação */}
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={criarEvento}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialIcons name="event" size={20} color="#fff" />
                <Text style={styles.buttonText}>Criar Evento</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#6366f1',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#6366f1',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 24,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    textAlign: 'center',
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  label: {
    color: '#374151',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  tipoEventoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tipoEventoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tipoEventoText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  datetimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  datetimeButtonText: {
    color: '#111827',
    fontWeight: '500',
  },
  datetimeHelpText: {
    color: '#6b7280',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  anexoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  anexoButtonText: {
    color: '#6366f1',
    fontWeight: '500',
  },
  listaArquivos: {
    marginBottom: 16,
  },
  arquivoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  arquivoNome: {
    flex: 1,
    color: '#4b5563',
    marginLeft: 8,
    marginRight: 8,
  },
  removerBotao: {
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});