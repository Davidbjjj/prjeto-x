import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Sobre() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Sobre</Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.text}>
          Este aplicativo foi desenvolvido por Erick Abraão, Luís Henrique, Gabriel Miradanda, David Pontes e David Henrique.
        </Text>
        <Text style={styles.text}>
          O objetivo é auxiliar professores, escolas e alunos a terem uma melhor interação e controle das suas notas e atividades.
        </Text>
        <Text style={styles.text}>
          Obrigado por visitar!
        </Text>
        <Text style={styles.text}>
          Todos os direitos reservados
        </Text>
        <Text style={styles.text}>
          @NoteEasy
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#003366",
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 20,
    padding: 5,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    marginTop: 100,
    paddingHorizontal: 20,
    
    alignItems: "center", // Centraliza os elementos na horizontal
    gap: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    textAlign: "center", // Centraliza o texto dentro do Text
  },
});
