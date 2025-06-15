import { getDisciplinas } from '@/services/disciplinaService';
import type { Professor } from '@/services/professorService';
import { getAllProfessores, updateProfessor } from '@/services/professorService';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfessorEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
  const [showDisciplinas, setShowDisciplinas] = useState(false);
  const [todasDisciplinasDisponiveis, setTodasDisciplinasDisponiveis] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          await carregarProfessor(id as string);
        }
        await fetchDisciplinas();
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do professor');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const carregarProfessor = async (professorId: string) => {
    try {
      const professores = await getAllProfessores();
      const encontrado = professores.find((p) => p.id === professorId);
      
      if (!encontrado) {
        throw new Error('Professor não encontrado');
      }
      
      setProfessor(encontrado);
      setNome(encontrado.nome);
      setEmail(encontrado.email);
      setDisciplinaSelecionada(encontrado.disciplinas?.[0] || '');
    } catch (err) {
      console.error('Erro ao carregar professor:', err);
      throw err;
    }
  };

  const fetchDisciplinas = async () => {
    try {
      const data = await getDisciplinas();
      const nomes = data.map((disciplina: { nome: string }) => disciplina.nome);
      setTodasDisciplinasDisponiveis(nomes);
    } catch (err) {
      console.error('Erro ao buscar disciplinas:', err);
      throw err;
    }
  };

  const handleDisciplinaSelect = (disciplina: string) => {
    setDisciplinaSelecionada(disciplina);
    Keyboard.dismiss();
    setShowDisciplinas(false);
  };

  const handleSave = async () => {
    if (!nome.trim() || !email.trim() || !professor) {
      Alert.alert('Erro', 'Nome, email e disciplina são obrigatórios');
      return;
    }

    const professorAtualizado = {
      nome: nome.trim(),
      email: email.trim(),
      senha: professor.senha || 'senha123', // Mantém a senha existente
      escolaNome: professor.escolaNome || 'Escola Padrão',
      disciplinas: disciplinaSelecionada ? [disciplinaSelecionada] : [],
    };

    try {
      await updateProfessor(professor.id, professorAtualizado);
      Alert.alert('Sucesso', 'Professor atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error('Erro ao atualizar professor:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o professor');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando professor...</Text>
      </View>
    );
  }

  if (!professor) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Professor não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.professorName}>Editar Professor</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome:</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome do professor"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Disciplina</Text>
            <TouchableOpacity
              style={styles.selectContainer}
              onPress={() => setShowDisciplinas(!showDisciplinas)}
            >
              <Text style={styles.selectInput}>
                {disciplinaSelecionada || 'Selecione uma disciplina'}
              </Text>
              <MaterialIcons
                name={showDisciplinas ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            {showDisciplinas && (
              <View style={styles.disciplinasList}>
                {todasDisciplinasDisponiveis.map((disciplina, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.disciplinaOption,
                      disciplinaSelecionada === disciplina && styles.disciplinaSelected,
                    ]}
                    onPress={() => handleDisciplinaSelect(disciplina)}
                  >
                    <Text
                      style={[
                        styles.disciplinaOptionText,
                        disciplinaSelecionada === disciplina && styles.disciplinaSelectedText,
                      ]}
                    >
                      {disciplina}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Digite o email do professor"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
            />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1976D2',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1976D2',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 24,
  },
  professorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  form: {
    paddingBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 4,
  },
  selectInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  disciplinasList: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 200,
  },
  disciplinaOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  disciplinaSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  disciplinaOptionText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  disciplinaSelectedText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingBottom: 24,
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#0D47A1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});