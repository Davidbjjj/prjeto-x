import { setEvento } from '@/types/setEvento';
import axios from 'axios';
import { Evento } from '../types/evento';


const API_BASE_URL = 'http://localhost:8080';

export async function getEventosPorAluno(email: string): Promise<Evento[]> {
  try {
    const response = await axios.get<Evento[]>(`${API_BASE_URL}/eventos/aluno/${email}`);
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
      console.error('Erro ao buscar eventos:', error.message);
      throw error;
    }
    console.error('Erro desconhecido ao buscar eventos');
    throw new Error('Erro desconhecido ao carregar eventos');
  }
}

export async function criarEventoNaDisciplina(
  disciplinaId: string,
  eventoData: Omit<setEvento, 'id'> & { disciplinaId: string }
): Promise<setEvento> {
  try {
    // Monta o payload exatamente como o backend espera
    const payload = {
      titulo: eventoData.titulo,
      descricao: eventoData.descricao || '', // Garante string vazia se não houver descrição
      notaMaxima: eventoData.notaMaxima,
      data: eventoData.data,
      arquivos: eventoData.arquivos || [], // Garante array vazio se não houver arquivos
      disciplinaId: disciplinaId
    };

    const response = await axios.post<setEvento>(
      `${API_BASE_URL}/eventos/disciplina/${disciplinaId}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          // Adicione outros headers necessários como Authorization
        }
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      console.error('Erro na requisição:', {
        status: error.response?.status,
        data: errorData,
      });

      const errorMessage = errorData?.message || 
                         errorData?.error || 
                         'Erro ao criar evento na disciplina';
      throw new Error(errorMessage);
    }
    
    if (error instanceof Error) {
      console.error('Erro ao criar evento:', error.message);
      throw error;
    }
    
    console.error('Erro desconhecido ao criar evento:', error);
    throw new Error('Erro desconhecido ao criar evento');
  }
}

export async function getEventosPorDisciplina(disciplinaId: string): Promise<Evento[]> {
  try {
    const response = await axios.get<Evento[]>(`${API_BASE_URL}/eventos/disciplina/${disciplinaId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Erro ao carregar eventos');
    }
    if (error instanceof Error) {
      console.error('Erro ao buscar eventos:', error.message);
      throw error;
    }
    console.error('Erro desconhecido ao buscar eventos');
    throw new Error('Erro desconhecido ao carregar eventos');
  }
}