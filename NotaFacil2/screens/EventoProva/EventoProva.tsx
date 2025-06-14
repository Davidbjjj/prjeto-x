import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CriarProva() {
  const [materia, setMateria] = useState('');
  const [dataProva, setDataProva] = useState('');
  const [horario, setHorario] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSalvarProva = () => {
    if (!materia || !dataProva || !horario || !descricao) {
      Alert.alert('Por favor, preencha todos os campos!');
      return;
    }

    Alert.alert('Prova salva com sucesso!');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Criar Prova</Text>

          <Text style={styles.label}>Matéria</Text>
          <TextInput
            style={styles.input}
            value={materia}
            onChangeText={setMateria}
          />

          <Text style={styles.label}>Data da Prova</Text>
          <TextInput
            style={styles.input}
            value={dataProva}
            onChangeText={setDataProva}
            keyboardType="default"
          />

          <Text style={styles.label}>Horário</Text>
          <TextInput
            style={styles.input}
            value={horario}
            onChangeText={setHorario}
            keyboardType="default"
          />

          <Text style={styles.label}>Descrição da Prova</Text>
          <TextInput
            style={styles.input}
            value={descricao}
            onChangeText={setDescricao}
          />

          <TouchableOpacity onPress={handleSalvarProva} style={styles.button}>
            <LinearGradient
              colors={['#001684', '#006EFF']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Salvar Prova</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0477BF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: '#003D80',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  buttonGradient: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
