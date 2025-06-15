// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import React from 'react';

// import DashboardScreen from "@/screens/Dashboard/DashboardScreen";
// import CadastroEscola from '@/screens/Escola/CadastroEscola';
// import EventosAluno from '@/screens/EventosAluno';
// import HomeScreen from '@/screens/HomeScreen';
// import ProfessorEditScreen from '@/screens/ProfessorEditScreen';
// import ProfessorListScreen from '@/screens/ProfessorListScreen';
// import Sobre from '@/screens/Sobre/sobreScreen';
// import TipoCadastro from '@/screens/TipoCadastro/TipoCadastro';
// import { Professor } from '@/services/professorService';
// import CadastroScreen from '../screens/Cadastro';
// import Calendario from '../screens/Calendario/Calendario';
// import CodigoRecupera from '../screens/CodigoRecupera/CodRecupera';
// import EventoProfessor from '../screens/EventoProfessor/EventoProfessorScreen';
// import EventoProva from '../screens/EventoProva/EventoProva';
// // import LoginScreen from '../screens/LoginScreen';
// import NovaSenha from '../screens/NovaSenha/NovaSenha';
// import SelectUserScreen from '../screens/SelectUserScreen';
// import CadastroAluno from '../screens/aluno/CadastroAluno';
// import CadastroProfessor from '../screens/professor/CadastroProfessor';
// import InicioStack from './InicioStack';

// export type RootStackParamList = {
//   SelectUser: undefined;
//   Cadastro: { tipo: string };
//   CadastroProfessor: undefined;
//   LoginScreen: undefined;
//   CadastroAluno: undefined;
//   Home: undefined;
//   CodigoRecupera: undefined;
//   NovaSenha: undefined;
//   EventoProva: undefined;
//   Calendario: undefined;
//   Inicio: undefined;
//   EventoProfessor: undefined;
//   EventosAluno: undefined;
//   Disciplinas: undefined;
//   Dashboard: undefined;
//   ProfessorListScreen: undefined;
//   Sobre: undefined;
//   TipoCadastro: undefined;
//   CadastroEscola:undefined;
//   ProfessorEdit: { professor: Professor };
// };

// const Stack = createNativeStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <Stack.Navigator initialRouteName="LoginScreen">
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="SelectUser" component={SelectUserScreen} />
//       <Stack.Screen name="Cadastro" component={CadastroScreen} />
//       <Stack.Screen name="CadastroProfessor" component={CadastroProfessor} />
//       {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
//       <Stack.Screen name="ProfessorListScreen" component={ProfessorListScreen} />
//       <Stack.Screen name="CadastroProfessor" component={CadastroProfessor} />
//       <Stack.Screen name="CadastroAluno" component={CadastroAluno} />
//       <Stack.Screen name="TipoCadastro" component={TipoCadastro} />
//        <Stack.Screen 
//         name="ProfessorEdit" 
//         component={ProfessorEditScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen name= "CadastroEscola" component={CadastroEscola} />
//       <Stack.Screen name="Sobre" component={Sobre}/>
//       <Stack.Screen name="CodigoRecupera" component={CodigoRecupera} />
//       <Stack.Screen name="NovaSenha" component={NovaSenha} />
//         <Stack.Screen name="Dashboard" component={DashboardScreen} />
//         <Stack.Screen 
//         name="Inicio" 
//         component={InicioStack} 
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen name="EventoProva" component={EventoProva} />
//       <Stack.Screen name="Calendario" component={Calendario} />
//       <Stack.Screen name="EventoProfessor" component={EventoProfessor} />
//       <Stack.Screen 
//       name="EventosAluno" 
//       component={EventosAluno} 
//       options={{ title: 'Meus Eventos' }}
//     />
//     </Stack.Navigator>
//   );
// }
