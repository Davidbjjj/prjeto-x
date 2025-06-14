import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SelectUser'>;

export default function SelectUserScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRIAR COMO:</Text>
      <View style={styles.cardContainer}>
        <LinearCard
          image={require('../assets/Aluno.png')}
          label="Aluno"
          onPress={() => navigation.navigate('Cadastro', { tipo: 'Aluno' })}
        />
        <LinearCard
          image={require('../assets/Professor.png')}
          label="Professor"
          onPress={() => navigation.navigate('CadastroProfessor')}
        />
        <LinearCard
          image={require('../assets/Pais.png')}
          label="Pais"
          onPress={() => navigation.navigate('Cadastro', { tipo: 'Pais' })}
        />
      </View>
    </View>
  );
}

type CardProps = {
  image: any;
  label: string;
  onPress: () => void;
};

function LinearCard({ image, label, onPress }: CardProps) {
  return (
    <LinearGradient
      colors={['#5AA6FF', '#1677FF']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <Image source={image} style={styles.img} />
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1677FF',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  card: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    width: '80%',
    elevation: 5,
  },
  img: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1677FF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
