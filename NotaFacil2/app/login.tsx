import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { router } from 'expo-router';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Login.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.loginBox}>
        <Text style={styles.title}>Login</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Digite seu email" placeholderTextColor="#aaa" />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          secureTextEntry
          placeholderTextColor="#aaa"
        />

        <Text style={styles.forgotPassword}>Esqueceu a senha ?</Text>

        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/SelectUserScreen')}>
  <Text style={styles.socialText}>Criar Conta</Text>
</TouchableOpacity>



      <Text style={styles.otherLogins}>Outros Logins</Text>

      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialBtn}><Text style={styles.socialText}>Google</Text></TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}><Text style={styles.socialText}>Microsoft</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0072CE',
    alignItems: 'center',
    paddingVertical: 30,
  },
  image: {
    width: 200,
    height: 140,
    marginBottom: 10,
  },
  loginBox: {
    backgroundColor: '#0066CC',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    borderColor: '#fff',
    borderWidth: 1,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#e1e1e1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  forgotPassword: {
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'right',
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#00CC33',
    paddingVertical: 12,
    borderRadius: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  createAccount: {
    backgroundColor: '#003C99',
    padding: 12,
    borderRadius: 10,
    width: '90%',
    marginBottom: 10,
  },
  createText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  otherLogins: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  socialButtons: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  socialBtn: {
    backgroundColor: '#004BFF',
    width: '90%',
    paddingVertical: 10,
    borderRadius: 20,
  },
  socialText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  createBtn: {
    backgroundColor: '#0455BF',
    width: '90%',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },

});
