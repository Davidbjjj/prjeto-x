import CustomButton from '@/components/CustomButton';
import CustomInput from '@/components/CustomInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FormAluno() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitoPoliticas, setAceitoPoliticas] = useState(false);  

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          console.log('Usuário já está logado');
          router.replace('/login/LoginScreen');
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
      await AsyncStorage.setItem('authToken', token);

      // Salvar role do usuário se existir
      if (loginResponse.data.userDetails?.role) {
        await AsyncStorage.setItem('userRole', loginResponse.data.userDetails.role);
      }

      Alert.alert('Cadastro e login realizados com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setConfirmarSenha('');
      setAceitoPoliticas(false);  

      // Redirecionar para a tela inicial usando expo-router
      router.replace('/login/LoginScreen');

    } catch (err: any) {
      console.error('Erro:', err);

      if (err.response) {
        Alert.alert('Erro ao cadastrar', err.response.data.message || 'Tente novamente.');
      } else {
        Alert.alert('Erro de conexão com o servidor.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.title}>Cadastro de Aluno</Text>

          <CustomInput 
            placeholder="Nome" 
            value={nome} 
            onChangeText={setNome} 
          />

          <CustomInput 
            placeholder="Email" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput 
            placeholder="Senha" 
            secureTextEntry 
            value={senha} 
            onChangeText={setSenha} 
          />

          <CustomInput 
            placeholder="Confirmar Senha" 
            secureTextEntry 
            value={confirmarSenha} 
            onChangeText={setConfirmarSenha} 
          />

          <View style={styles.checkboxContainer}>
            <Text style={styles.checkboxLabel}>Aceito as políticas de privacidade</Text>
          </View>

          <CustomButton 
            title="Confirmar" 
            onPress={handleCadastroAluno} 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bdb',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  form: {
    backgroundColor: '#0455BF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#fff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxLabel: {
    color: '#fff',
  },
});