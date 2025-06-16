// services/disciplinaService.ts
import axios from 'axios';
import { Disciplina } from '../types/disciplina';

const API_BASE_URL = 'https://projeto-x-cg6v.onrender.com';

export async function getDisciplinas(): Promise<Disciplina[]> {
  try {
    const response = await axios.get<Disciplina[]>(`${API_BASE_URL}/disciplinas`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição:', {
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Erro ao carregar disciplinas');
    }
    if (error instanceof Error) {
      console.error('Erro ao buscar disciplinas:', error.message);
      throw error;
    }
    console.error('Erro desconhecido ao buscar disciplinas');
    throw new Error('Erro desconhecido ao carregar disciplinas');
  }
}