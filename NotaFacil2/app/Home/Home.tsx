import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Easing,
    Image,
    StyleSheet
} from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(1)); // Valor inicial de opacidade

  useEffect(() => {
    // Animação de fade-out após 2.5 segundos
    const fadeOutTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Meio segundo de animação
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }, 2500);

    // Redirecionamento após 3 segundos (total)
    const redirectTimer = setTimeout(() => {
      router.replace('/login/LoginScreen');
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Image
        source={require('../../assets/LogoNoteasy.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#0072CE" style={styles.loader} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 175,
    marginBottom: 40,
  },
  loader: {
    marginTop: 30,
  },
});