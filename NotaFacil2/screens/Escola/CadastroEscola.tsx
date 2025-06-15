import CustomButton from '@/components/CustomButton';
import type { RootStackParamList } from '@/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomInput from '../../components/CustomInput';

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CadastroEscola'>;

export default function FormEscola() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [senha, setSenha] = useState('');
 
 const navigation = useNavigation<CadastroScreenNavigationProp>(); 
 

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

  const handleCadastroEscola = async () => {
    if (!nome || !email || !endereco || !senha ) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

   

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Formato de e-mail inválido!');
      return;
    }

    

    const escola = {
      nome,
      email,
      senha,
      endereco
    };

    try {
      await axios.post('https://backnotas.onrender.com/escolas', escola);

      const loginResponse = await axios.post('https://backnotas.onrender.com/escolas', {
        email,
        senha,
      });

      const token = loginResponse.data.token || loginResponse.data.accessToken;
      await AsyncStorage.setItem('token', token);

      Alert.alert('Cadastro e login realizados com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setEndereco('');
      
      navigation.navigate('LoginScreen');

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
          <Text style={styles.title}>Cadastro de Escola</Text>

          <CustomInput placeholder="Nome" value={nome} onChangeText={setNome} />

          <CustomInput placeholder="Email" value={email} onChangeText={setEmail} />

          

          <CustomInput placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />

          <CustomInput placeholder="Endereco" value={endereco} onChangeText={setEndereco} />

          

          
          <CustomButton title="Confirmar" onPress={handleCadastroEscola} />
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
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: '#fff',
  },
});
