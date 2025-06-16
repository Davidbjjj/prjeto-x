import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ColorValue, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelectUserScreen() {
  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>CRIAR CONTA COMO:</Text>
        
        <View style={styles.cardContainer}>
          <LinearCard
            image={require('../assets/Aluno.png')}
            label="ALUNO"
            onPress={() => router.push({ pathname: '/cadastro/Cadastroaluno'})}
            colors={['#4A90E2', '#1877F2']}
          />
          
          <LinearCard
            image={require('../assets/Professor.png')}
            label="PROFESSOR"
            onPress={() => router.push('/cadastro/CadastroProfessor')}
            colors={['#6E48AA', '#9D50BB']}
          />
          
          <LinearCard
            image={require('../assets/Pais.png')}
            label="PAIS/RESPONSÁVEL"
            onPress={() => router.push({ pathname: '/cadastro/CadastroPais', params: { tipo: 'Pais' } })}
            colors={['#FF7B25', '#FF5F05']}
          />
        </View>
      </View>
    </ScrollView>
  );
}

type CardProps = {
  image: any;
  label: string;
  onPress: () => void;
    colors: [ColorValue, ColorValue, ...ColorValue[]];
};

function LinearCard({ image, label, onPress, colors }: CardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image source={image} style={styles.img} />
        <View style={styles.button}>
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#1677FF',
    alignItems: 'center',
    paddingTop: isSmallDevice ? 40 : 60,
    paddingBottom: 40,
    minHeight: height,
  },
  title: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: 'bold',
   color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 25,
    paddingHorizontal: 20,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallDevice ? 25 : 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  img: {
    width: isSmallDevice ? 70 : 90,
    height: isSmallDevice ? 70 : 90,
    marginBottom: 15,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});