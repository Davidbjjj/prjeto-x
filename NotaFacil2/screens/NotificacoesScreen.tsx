import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NotificacoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificações</Text>
      {/* Adicione o conteúdo da tela aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});