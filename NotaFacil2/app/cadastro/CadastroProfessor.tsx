import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Escola {
  id: string;
  nome: string;
}

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

      router.replace('/login/LoginScreen');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível cadastrar o professor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#6E48AA', '#9D50BB']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.title}>Cadastro de Professor</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha segura"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />

          <Text style={styles.label}>Escola</Text>
          <View style={styles.dropdownContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.dropdownInput}
                placeholder="Selecione ou digite o nome da escola"
                value={escolaSelecionada}
                onChangeText={filtrarEscolas}
                onFocus={() => setMostrarDropdown(true)}
              />
              <TouchableOpacity 
                onPress={toggleDropdown} 
                style={styles.dropdownButton}
              >
                <MaterialIcons
                  name={mostrarDropdown ? 'arrow-drop-up' : 'arrow-drop-down'}
                  size={24}
                  color="#555"
                />
              </TouchableOpacity>
            </View>

            {carregandoEscolas && (
              <ActivityIndicator size="small" color="#6E48AA" style={styles.loadingIndicator} />
            )}

            {mostrarDropdown && (
              <View style={styles.dropdownList}>
                <FlatList
                  data={escolasFiltradas}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => selecionarEscola(item)}
                    >
                      <Text style={styles.dropdownItemText}>{item.nome}</Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="always"
                />
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleCadastro}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
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
    backgroundColor: '#F5F7FB',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  dropdownInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  dropdownButton: {
    padding: 15,
    backgroundColor: '#F5F7FB',
  },
  dropdownList: {
    maxHeight: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#2D3748',
  },
  loadingIndicator: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#6E48AA',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#6E48AA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});