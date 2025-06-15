import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';


export default function HeaderPerfil() {


  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        {/* Botão de Sobre (lado esquerdo) */}
        <TouchableOpacity 
          onPress={() => router.replace('/Sobre/sobreScreen')} 
          style={styles.aboutButton}
        >
          <MaterialIcons name="info" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Botão de Perfil (lado direito) */}
        <TouchableOpacity 
          onPress={() => router.replace('/Perfil/profile')}
          style={styles.profileButton}
        >
          <Image
            source={require('../../assets/pessoa.png')}
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
