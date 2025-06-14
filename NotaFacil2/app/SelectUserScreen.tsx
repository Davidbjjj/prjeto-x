import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { navigationRef } from '../navigation/navigationRef';
import { router } from 'expo-router';

export default function SelectUserScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha seu tipo de usuário</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/aluno/CadastroAluno')}
        >
          <Image source={require('../assets/Aluno.png')} style={styles.img} />
          <Text style={styles.cardText}>Aluno</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/professor/CadastroProfessor')}
        >
          <Image source={require('../assets/Professor.png')} style={styles.img} />
          <Text style={styles.cardText}>Professor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigationRef.navigate('Cadastro', { tipo: 'Pais' })}
        >
          <Image source={require('../assets/Pais.png')} style={styles.img} />
          <Text style={styles.cardText}>Pais</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1677FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 20,
  },
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    width: 100,
  },
  img: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
