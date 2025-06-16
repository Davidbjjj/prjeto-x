import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CriarEvento() {
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

  const DISCIPLINA_ID = '4bacb74e-98a1-41ec-a62b-a9d614e51926';

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
      day: '2-digit',
      month: '2-digit',
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
    if (!titulo || !descricao || !notaMaxima) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const nota = parseFloat(notaMaxima);
    if (isNaN(nota) || nota <= 0) {
      Alert.alert('Erro', 'A nota máxima deve ser um número positivo');
      return;
    }

    const evento = {
      titulo,
      descricao,
      notaMaxima: nota,
      data: formatarDataEnvio(data),
      arquivos,
      disciplinaId: DISCIPLINA_ID
    };

    setIsLoading(true);
    try {
      const response = await axios.post('https://projeto-x-cg6v.onrender.com/eventos', evento);
      console.log('Evento criado:', response.data);
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      
      // Resetar formulário
      setTitulo('');
      setDescricao('');
      setNotaMaxima('');
      setArquivos([]);
      const now = new Date();
      now.setHours(now.getHours() + 1);
      setData(now);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      Alert.alert('Erro', 'Falha ao criar evento');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Criar Novo Evento</Text>

        <Text style={styles.label}>Título *</Text>
        <TextInput 
          style={styles.input} 
          value={titulo} 
          onChangeText={setTitulo}
          placeholder="Ex: Apresentação Final"
          maxLength={100}
        />

        <Text style={styles.label}>Descrição *</Text>
        <TextInput 
          style={[styles.input, { height: 100 }]} 
          value={descricao} 
          onChangeText={setDescricao}
          multiline
          placeholder="Descreva o evento..."
          textAlignVertical="top"
        />

        <Text style={styles.label}>Nota Máxima *</Text>
        <TextInput
          style={styles.input}
          value={notaMaxima}
          onChangeText={setNotaMaxima}
          keyboardType="numeric"
          placeholder="Ex: 10.0"
        />

        <Text style={styles.label}>Data e Hora *</Text>
        
        <View style={styles.datetimeContainer}>
          <TouchableOpacity 
            onPress={showDatepicker} 
            style={[styles.datetimeButton, { flex: 2 }]}
          >
            <Text style={styles.datetimeButtonText}>
              {data.toLocaleDateString('pt-BR')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={showTimepicker} 
            style={[styles.datetimeButton, { flex: 1, marginLeft: 10 }]}
          >
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
          />
        )}

        <Text style={styles.label}>Anexos</Text>
        <TouchableOpacity onPress={selecionarArquivo} style={styles.anexoButton}>
          <Text style={styles.anexoButtonText}>Adicionar Arquivo</Text>
        </TouchableOpacity>

        {arquivos.length > 0 && (
          <View style={styles.listaArquivos}>
            {arquivos.map((arquivo, index) => (
              <View key={index} style={styles.arquivoItem}>
                <Text style={styles.arquivoNome} numberOfLines={1} ellipsizeMode="middle">
                  • {arquivo}
                </Text>
                <TouchableOpacity onPress={() => {
                  const novosArquivos = [...arquivos];
                  novosArquivos.splice(index, 1);
                  setArquivos(novosArquivos);
                }}>
                  <Text style={styles.removerBotao}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={criarEvento}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Criando...' : 'Criar Evento'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    backgroundColor: '#003D80',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  datetimeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  datetimeButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datetimeButtonText: {
    color: '#003D80',
    fontWeight: 'bold',
  },
  datetimeHelpText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  anexoButton: {
    width: '100%',
    padding: 14,
    backgroundColor: '#004a99',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  anexoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listaArquivos: {
    marginBottom: 20,
  },
  arquivoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#004a99',
    padding: 12,
    borderRadius: 6,
  },
  arquivoNome: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  removerBotao: {
    color: '#ff5c5c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00a651',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});