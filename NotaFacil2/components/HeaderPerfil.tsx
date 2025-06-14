import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

export default function HeaderPerfil() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Botão de Sobre (lado esquerdo) */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Sobre')} 
          style={styles.aboutButton}
        >
          <MaterialIcons name="info" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Botão de Perfil (lado direito) */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Perfil')}
          style={styles.profileButton}
        >
          <Image
            source={require('../assets/pessoa.png')}
            style={styles.profileImage}
          />
          <MaterialIcons 
            name="arrow-forward-ios" 
            size={16} 
            color="#ccc" 
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#003F73',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between', // ícone à esquerda e avatar à direita
    alignItems: 'center',
  },
  aboutButton: {
    padding: 8,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
