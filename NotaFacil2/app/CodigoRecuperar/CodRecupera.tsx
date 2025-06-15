import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RecuperacaoSenha() {
  const [codigo, setCodigo] = useState('');

  const handleRecuperarSenha = () => {
    if (!codigo) {
      Alert.alert('Por favor, insira o código de recuperação!');
      return;
    }

    Alert.alert('Código verificado, agora você pode criar uma nova senha!');
    // Redireciona para a tela de nova senha
    router.push('/Nova Senha/NovaSenha');
  };

  const handleReenviarCodigo = () => {
    Alert.alert('Código reenviado!');
    // Lógica para reenviar o código
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Código de recuperação</Text>
          <Text style={styles.subtitle}>
            Esqueceu sua senha? Não se preocupe, enviamos um código de recuperação para seu email. Digite-o e crie uma nova senha.
          </Text>

          <TextInput
            style={styles.input}
            value={codigo}
            onChangeText={setCodigo}
            keyboardType="numeric"
            placeholder="Digite o código"
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity onPress={handleRecuperarSenha}>
            <LinearGradient
              colors={['#001684', '#006EFF']}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReenviarCodigo}>
            <Text style={styles.reenviar}>Reenviar código</Text>
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
    backgroundColor: '#03629C',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reenviar: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});