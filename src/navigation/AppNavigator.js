// src/navigation/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all your screens
import InicioScreen from '../screens/InicioScreen';
import CategoriaScreen from '../screens/CategoriaScreen'; // Make sure this line is here
import JuegoScreen from '../screens/JuegoScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Inicio">
      <Stack.Screen 
        name="Inicio" 
        component={InicioScreen} 
        options={{ headerShown: false }} 
      />
      {/* Add Categoria here, before Juego */}
      <Stack.Screen 
        name="Categoria" 
        component={CategoriaScreen} 
        options={{ title: 'Preparar Partida' }} 
      />
      <Stack.Screen 
        name="Juego" 
        component={JuegoScreen} 
      />
      <Stack.Screen 
        name="Estadisticas" 
        component={EstadisticasScreen} 
      />
      <Stack.Screen 
        name="Configuracion" 
        component={ConfiguracionScreen} 
      />
    </Stack.Navigator>
  );
}