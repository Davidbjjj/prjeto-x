// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const [senha, setSenha] = useState('');

//   const handleLogin = async () => {
//     try {
//       const response = await fetch('https://projeto-x-cg6v.onrender.com/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, senha }),
//       });

//       if (response.status === 200) {
//         const data = await response.json();
//         console.log('Login realizado com sucesso!', data);

//         // Salvar token no AsyncStorage
//         await AsyncStorage.setItem('authToken', data.token);
        
//         // Salvar role do usuário se existir
//         if (data.userDetails?.role) {
//           await AsyncStorage.setItem('userRole', data.userDetails.role);
//         }

//         // Redireciona para a tela de início usando expo-router
//         router.replace('/login/LoginScreen');
//       } else {
//         const errorText = await response.text();
//         Alert.alert('Erro ao fazer login', errorText);
//       }
//     } catch (error) {
//       console.error('Erro na requisição de login:', error);
//       Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
//     }
//   };

//   const handleForgotPassword = () => {
//     router.push('/codigo-recupera');
//   };

//   const handleCreateAccount = () => {
//     router.push('/select-user');
//   };

//   const handleRegister = () => {
//     router.push('/tipo-co');
//   };

//   const handleSocialLogin = (provider: string) => {
//     Alert.alert('Login Social', `Login com ${provider} seria implementado aqui`);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       <View style={styles.container}>
//         <Image
//           source={require('../assets/LogoNoteasy.png')}
//           style={styles.image}
//           resizeMode="contain"
//         />
//         <View style={styles.loginBox}>
//           <Text style={styles.title}>Login</Text>

//           <Text style={styles.label}>Email</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Digite seu email"
//             placeholderTextColor="#aaa"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />

//           <Text style={styles.label}>Senha</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Digite sua senha"
//             secureTextEntry
//             placeholderTextColor="#aaa"
//             value={senha}
//             onChangeText={setSenha}
//           />

//           <TouchableOpacity onPress={handleForgotPassword}>
//             <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.confirmButton} onPress={handleLogin}>
//             <Text style={styles.confirmText}>Confirmar</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           style={styles.createBtn}
//           onPress={handleCreateAccount}
//         >
//           <Text style={styles.socialText}>Criar Conta</Text>
//         </TouchableOpacity>

//         <Text style={styles.otherLogins}>Outros Logins</Text>

//         <View style={styles.socialButtons}>
//           <TouchableOpacity 
//             style={styles.socialBtn} 
//             onPress={() => handleSocialLogin('Google')}
//           >
//             <Text style={styles.socialText}>Google</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={styles.socialBtn}
//             onPress={() => handleSocialLogin('Microsoft')}
//           >
//             <Text style={styles.socialText}>Microsoft</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.registerContainer}>
//           <Text style={styles.registerText}>
//             Não tem conta?{' '}
//             <Text
//               style={styles.registerLink}
//               onPress={handleRegister}
//             >
//               Cadastre-se
//             </Text>
//           </Text>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0072CE',
//     alignItems: 'center',
//     paddingVertical: 30,
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 30,
//   },
//   image: {
//     width: 200,
//     height: 140,
//     marginBottom: 10,
//   },
//   loginBox: {
//     backgroundColor: '#0066CC',
//     padding: 20,
//     borderRadius: 10,
//     width: '90%',
//     borderColor: '#fff',
//     borderWidth: 1,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 26,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 15,
//   },
//   label: {
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   input: {
//     backgroundColor: '#e1e1e1',
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   forgotPassword: {
//     color: '#fff',
//     fontStyle: 'italic',
//     textAlign: 'right',
//     marginBottom: 10,
//   },
//   confirmButton: {
//     backgroundColor: '#004BFF',
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   confirmText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   createBtn: {
//     backgroundColor: '#0455BF',
//     width: '90%',
//     paddingVertical: 10,
//     borderRadius: 20,
//     marginBottom: 10,
//   },
//   socialText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   otherLogins: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   socialButtons: {
//     width: '90%',
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 20,
//     alignItems: 'center',
//     gap: 8,
//   },
//   socialBtn: {
//     backgroundColor: '#004BFF',
//     width: '90%',
//     paddingVertical: 10,
//     borderRadius: 20,
//   },
//   registerContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   registerText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   registerLink: {
//     color: '#00CC33',
//     fontWeight: 'bold',
//   },
// });