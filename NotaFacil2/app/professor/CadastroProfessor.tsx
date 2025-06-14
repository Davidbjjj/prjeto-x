// app/cadastro/professor.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

export default function CadastroProfessor() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [disciplinas, setDisciplinas] = useState('');

  const handleCadastro = async () => {
    try {
      await axios.post('http://localhost:8080/professores', {
        nome,
        email,
        senha,
        disciplinas: disciplinas.split(',').map(d => d.trim()),
      });
      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setDisciplinas('');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao cadastrar professor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Professor</Text>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
      <TextInput placeholder="Disciplinas (separadas por vírgula)" style={styles.input} value={disciplinas} onChangeText={setDisciplinas} />
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});
