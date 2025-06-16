import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function BackButton() {
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <MaterialIcons name="arrow-back" size={24} color="#007bff" />
    </TouchableOpacity>
  );
}