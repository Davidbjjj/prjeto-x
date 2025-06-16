import type { RootStackParamList } from '@/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Escola {
  id: string;
  nome: string;
}

type CadastroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CadastroProfessor'>;
export default function CadastroProfessor() {
    const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [escolaSelecionada, setEscolaSelecionada] = useState('');
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [escolasFiltradas, setEscolasFiltradas] = useState<Escola[]>([]);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carregandoEscolas, setCarregandoEscolas] = useState(false);

  const navigation = useNavigation<CadastroScreenNavigationProp>();

  useEffect(() => {
    carregarEscolas();
  }, []);

  const carregarEscolas = async () => {
    try {
      setCarregandoEscolas(true);
      const response = await axios.get('https://projeto-x-cg6v.onrender.com/escolas');
      setEscolas(response.data);
      setEscolasFiltradas(response.data);
    } catch (error) {
      console.error('Erro ao carregar escolas:', error);
      Alert.alert('Erro', 'Não foi possível carregar a lista de escolas');
    } finally {
      setCarregandoEscolas(false);
    }
  };

  const filtrarEscolas = (texto: string) => {
    setEscolaSelecionada(texto);
    if (texto.length > 0) {
      const filtradas = escolas.filter(escola =>
        escola.nome.toLowerCase().includes(texto.toLowerCase())
      );
      setEscolasFiltradas(filtradas);
    } else {
      setEscolasFiltradas(escolas);
    }
  };

 const selecionarEscola = (escola: Escola) => {
    setEscolaSelecionada(escola.nome);
    setMostrarDropdown(false);
  };

  const toggleDropdown = () => {
    setMostrarDropdown(!mostrarDropdown);
    if (!mostrarDropdown) {
      setEscolasFiltradas(escolas);
    }
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !escolaSelecionada) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('https://projeto-x-cg6v.onrender.com/professores', {
        nome,
        email,
        senha,
        escolaNome: escolaSelecionada,
      });

      Alert.alert('Sucesso', 'Professor cadastrado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setEscolaSelecionada('');

      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o professor.');
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.title}>Cadastro de Professor</Text>

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Escola</Text>
          <View style={styles.escolaContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Digite o nome da escola ou selecione"
                style={styles.inputCombinado}
                value={escolaSelecionada}
                onChangeText={filtrarEscolas}
                onFocus={() => setMostrarDropdown(true)}
              />
              <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownButton}>
                <MaterialIcons
                  name={mostrarDropdown ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            {carregandoEscolas && (
              <ActivityIndicator size="small" style={styles.carregando} />
            )}

            {mostrarDropdown && (
              <View style={styles.dropdown}>
                <FlatList
                  data={escolasFiltradas}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.itemDropdown}
                      onPress={() => selecionarEscola(item)}
                    >
                      <Text>{item.nome}</Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="always"
                  style={styles.listaDropdown}
                />
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleCadastro}
            style={[styles.button, loading && styles.buttonLoading]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007bdb',
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  form: {
    backgroundColor: '#0455BF',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#fff',
  },
  label: {
    color: '#fff',
    marginBottom: 4,
    marginTop: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  escolaContainer: {
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputCombinado: {
    flex: 1,
    padding: 10,
  },
  dropdownButton: {
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#ccc',
  },
  dropdown: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginTop: 5,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  listaDropdown: {
    paddingHorizontal: 10,
  },
  itemDropdown: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  carregando: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#00b0ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonLoading: {
    backgroundColor: '#0077cc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
