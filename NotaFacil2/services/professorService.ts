import axios from 'axios';

const API_BASE_URL = 'https://projeto-x-cg6v.onrender.com';

export interface Professor {
  senha: string;
  id: string;
  nome: string;
  email: string;
  role: string;
  escolaNome: string;
  disciplinas: string[];
}

export interface ProfessorRequest {
  nome: string;
  email: string;
  senha: string;
  escolaNome: string;
}

export async function getAllProfessores(): Promise<Professor[]> {
  try {
    const response = await axios.get<Professor[]>(`${API_BASE_URL}/professores`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Erro na requisição');
    }
    if (error instanceof Error) {
      console.error('Erro ao buscar professores:', error.message);
      throw error;
    }
    console.error('Erro desconhecido ao buscar professores');
    throw new Error('Erro desconhecido ao carregar professores');
  }
}

export async function deleteProfessor(id: string): Promise<void> {
  try {
    console.log('Tentando deletar professor com ID:', id);
    console.log('URL da requisição:', `${API_BASE_URL}/professores/${id}`);
    
    const response = await axios.delete(`${API_BASE_URL}/professores/${id}`);
    
    console.log('Professor deletado com sucesso:', {
      status: response.status,
      statusText: response.statusText
    });
    
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição de delete:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      throw new Error(error.response?.data?.message || 'Erro ao deletar professor');
    }
    if (error instanceof Error) {
      console.error('Erro ao excluir professor:', error.message);
      throw error;
    }
    console.error('Erro desconhecido ao excluir professor');
    throw new Error('Erro desconhecido ao excluir professor');
  }
}

export async function updateProfessor(id: string, professorData: ProfessorRequest): Promise<Professor> {
  try {
    console.log('Enviando PUT para:', `${API_BASE_URL}/professores/${id}`);
    console.log('Dados do professor:', JSON.stringify(professorData, null, 2));
    
    const response = await axios.put<Professor>(`${API_BASE_URL}/professores/${id}`, professorData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method
      });
      throw new Error(error.response?.data?.message || 'Erro na requisição');
    }
    if (error instanceof Error) {
      console.error('Erro ao atualizar professor:', error.message);
      throw error;
    }
    console.error('Erro desconhecido ao atualizar professor');
    throw new Error('Erro desconhecido ao atualizar professor');
  }
}


