import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function FormAluno() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitoPoliticas, setAceitoPoliticas] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          console.log('Usuário já está logado');
        }
      } catch (err) {
        console.error('Erro ao verificar token:', err);
      }
    };

    verificarToken();
  }, []);

  const handleCadastroAluno = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('As senhas não coincidem!');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Formato de e-mail inválido!');
      return;
    }

    if (!aceitoPoliticas) {
      Alert.alert('Você precisa aceitar as políticas de privacidade.');
      return;
    }

    const aluno = {
      nome,
      email,
      senha,
      notas: [],
      professorId: null,
    };

    try {
      await axios.post('https://projeto-x-cg6v.onrender.com/alunos', aluno);

      const loginResponse = await axios.post('https://projeto-x-cg6v.onrender.com/auth/login', {
        email,
        senha,
      });

      const token = loginResponse.data.token || loginResponse.data.accessToken;
      await AsyncStorage.setItem('token', token);

      Alert.alert('Cadastro e login realizados com sucesso!');

      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setAceitoPoliticas(false);

      router.replace('/login/LoginScreen');
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err.response?.data || err.message || err);
      if (err.response) {
        Alert.alert('Erro ao cadastrar', err.response.data.message || 'Tente novamente.');
      } else {
        Alert.alert('Erro de conexão com o servidor.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#4A90E2', '#1877F2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>Cadastro de Aluno</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Crie uma senha segura"
              secureTextEntry={!mostrarSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity 
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={mostrarSenha ? 'visibility-off' : 'visibility'}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirme sua senha"
              secureTextEntry={!mostrarConfirmarSenha}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />
            <TouchableOpacity 
              onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={mostrarConfirmarSenha ? 'visibility-off' : 'visibility'}
                size={24}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.checkboxContainer}
            onPress={() => setAceitoPoliticas(!aceitoPoliticas)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, aceitoPoliticas && styles.checked]}>
              {aceitoPoliticas && (
                <MaterialIcons name="check" size={16} color="#FFF" />
              )}
            </View>
            <Text style={styles.checkboxText}>Aceito as políticas de privacidade</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCadastroAluno}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#4A90E2',
  },
  checkboxText: {
    fontSize: 14,
    color: '#2D3748',
    flex: 1,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});