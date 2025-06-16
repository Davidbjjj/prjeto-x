// types/userTypes.ts
export type UserRole = 'ESCOLA' | 'PROFESSOR' | 'ALUNO' | 'ADMIN';

interface BaseUserDetails {
  nome: string;
  email: string;
  role: UserRole;
}

export interface EscolaDetails extends BaseUserDetails {
  endereco: string;
  emailsPermitidos: string[];
  professores: string[];
}

export interface ProfessorDetails extends BaseUserDetails {
  escola: string;
  escolaNome?: string;
  disciplinas: string[];
}

export interface AlunoDetails extends BaseUserDetails {
  disciplinas: any;
  notas: Array<{
    disciplina: string;
    valor: number;
  }>;
  turma?: string;
}

export type UserDetails = EscolaDetails | ProfessorDetails | AlunoDetails;

export interface UserResponse {
  email: string;
  tipo: UserRole;
  id: string;
  nome: string;
  detalhes: UserDetails;
}