import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function RecuperacaoSenha() {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleRecuperarSenha = () => {
    if (!codigo) {
      Alert.alert('Atenção', 'Por favor, insira o código de recuperação!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso', 'Código verificado, agora você pode criar uma nova senha!');
      router.push('/NovaSenha/NovaSenha');
    }, 1500);
  };

  const handleReenviarCodigo = () => {
    setResendLoading(true);
    setTimeout(() => {
      setResendLoading(false);
      Alert.alert('Código reenviado!', 'Verifique seu e-mail novamente.');
    }, 1000);
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
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="email" size={48} color="#fff" />
          </View>

          <Text style={styles.title}>Verifique seu e-mail</Text>
          
          <Text style={styles.subtitle}>
            Enviamos um código de recuperação para o seu e-mail cadastrado. 
            Por favor, insira o código abaixo para continuar.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="number-pad"
              placeholder="Digite o código de 6 dígitos"
              placeholderTextColor="#aaa"
              maxLength={6}
              textAlign="center"
            />
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleRecuperarSenha}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Verificar Código</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Não recebeu o código?</Text>
            <TouchableOpacity 
              onPress={handleReenviarCodigo}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.resendLink}>Reenviar código</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0072CE', // Azul completo como fundo
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 25,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 18,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072CE',
    textAlign: 'center',
    letterSpacing: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: '#004BFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  resendLink: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});