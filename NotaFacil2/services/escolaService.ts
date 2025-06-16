import axios from 'axios';

const API_BASE_URL = 'https://projeto-x-cg6v.onrender.com';

export async function addPermittedEmail(escolaNome: string, email: string): Promise<string> {
  try {
    const response = await axios.post(`${API_BASE_URL}/escolas/${escolaNome}/associar-professor/${email}`, { email });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Erro na requisição:', {
        status: error.response?.status,
        data: error.response?.data,
      });

      const errorMessage = error.response?.data?.message || 'Erro ao adicionar email permitido';
      throw new Error(errorMessage);
    }

    if (error instanceof Error) {
      console.error('Erro ao adicionar email permitido:', error.message);
      throw error;
    }

    console.error('Erro desconhecido ao adicionar email permitido');
    throw new Error('Erro desconhecido ao adicionar email permitido');
  }
}
