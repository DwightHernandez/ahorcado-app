import React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { TemaProvider, useTema } from './src/context/TemaContext';
import MusicaFondo from './src/components/MusicaFondo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function NavegacionConTema() {
  const { tema, modoOscuro } = useTema();
  const temaNavegacion = {
    ...(modoOscuro ? DarkTheme : DefaultTheme),
    colors: {
      ...(modoOscuro ? DarkTheme.colors : DefaultTheme.colors),
      primary: tema.primario,
      background: tema.fondo,
      card: tema.fondo,
      text: tema.texto,
      border: tema.borde,
    },
  };

  return (
    <NavigationContainer theme={temaNavegacion}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <StatusBar hidden />
        <MusicaFondo />
        <NavegacionConTema />
      </TemaProvider>
    </SafeAreaProvider>
  );
}
