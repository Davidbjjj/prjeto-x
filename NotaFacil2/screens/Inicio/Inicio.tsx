import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/LogoNoteasy.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.cardsContainer}>
          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card}>
              <Ionicons name="clipboard" size={30} color="#fff" />
              <Text style={styles.cardText}>Provas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Ionicons name="calendar" size={30} color="#fff" />
              <Text style={styles.cardText}>Calendário</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.card}>
              <Ionicons name="person" size={30} color="#fff" />
              <Text style={styles.cardText}>Professor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.card}>
              <Ionicons name="book" size={30} color="#fff" />
              <Text style={styles.cardText}>Matéria</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007bdb',
  },
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#003366',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  cardText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  menuIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
