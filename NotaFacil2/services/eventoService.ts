import axios from 'axios';
import { Evento } from '../types/evento';

const API_BASE_URL = 'https://backnotas.onrender.com';

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