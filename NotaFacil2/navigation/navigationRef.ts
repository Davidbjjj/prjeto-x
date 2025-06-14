import { createNavigationContainerRef, StackActions } from '@react-navigation/native';
import type { RootStackParamList } from './AppNavigator'; // ajuste o caminho se necessário

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
