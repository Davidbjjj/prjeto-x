import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getDisciplinas } from '@/services/disciplinaService';
import { updateProfessor } from '@/services/professorService';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ProfessorEditScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfessorEdit'>;

export default function ProfessorEditScreen({ route, navigation }: ProfessorEditScreenProps) {
  const { professor } = route.params;
  
  const [nome, setNome] = useState(professor.nome);
  const [email, setEmail] = useState(professor.email);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(professor.disciplinas[0] || '');
  const [showDisciplinas, setShowDisciplinas] = useState(false);
  const [todasDisciplinasDisponiveis, setTodasDisciplinasDisponiveis] = useState(['Matemática', 'Português', 'Ciências', 'História', 'Geografia']);
  

 
  useEffect(() => {
    fetchDisciplinas();
  }, []);

   const fetchDisciplinas = async () => {
      try {
        const data = await getDisciplinas(); 
        const disciplinasNames = data.map((disciplina: { nome: string }) => disciplina.nome);
        setTodasDisciplinasDisponiveis(disciplinasNames);
      } catch (err) {
        console.error('Erro ao buscar disciplinas:', err);
        Alert.alert('Erro', 'Não foi possível carregar as disciplinas');
      }
    };  

  const handleSave = async () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    const professorAtualizado = {
      nome: nome.trim(),
      email: email.trim(),
      senha : 'senha123',
      escolaNome: professor.escolaNome || 'Escola Padrão'
    };

    console.log('ID do professor:', professor.id);
    console.log('Dados enviados para atualização:', JSON.stringify(professorAtualizado, null, 2));

    try {
      await updateProfessor(professor.id, professorAtualizado);
      Alert.alert('Sucesso', 'Professor atualizado com sucesso!', [
        { 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);
    } catch (err) {
      console.error('Erro ao atualizar professor:', err);
      Alert.alert('Erro', 'Não foi possível atualizar o professor');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleDisciplinaSelect = (disciplina: string) => {
    setDisciplinaSelecionada(disciplina);
    setShowDisciplinas(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.professorName}>{professor.nome}</Text>
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
                {disciplinaSelecionada || "Selecione uma disciplina"}
              </Text>
              <MaterialIcons 
                name={showDisciplinas ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
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
                      disciplinaSelecionada === disciplina && styles.disciplinaSelected
                    ]}
                    onPress={() => handleDisciplinaSelect(disciplina)}
                  >
                    <Text style={[
                      styles.disciplinaOptionText,
                      disciplinaSelecionada === disciplina && styles.disciplinaSelectedText
                    ]}>
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
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Enviar</Text>
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
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  professorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
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
    paddingHorizontal: 24,
    paddingBottom: 32,
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