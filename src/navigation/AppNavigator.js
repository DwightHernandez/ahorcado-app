import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InicioScreen from '../screens/InicioScreen';
import JuegoScreen from '../screens/JuegoScreen';
import EstadisticasScreen from '../screens/EstadisticasScreen';
import ConfiguracionScreen from '../screens/ConfiguracionScreen';
// Importa CategoriaScreen e InstruccionesScreen cuando las crees

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Inicio">
      <Stack.Screen 
        name="Inicio" 
        component={InicioScreen} 
        options={{ headerShown: false }} // Ocultamos el header en el inicio
      />
      <Stack.Screen name="Juego" component={JuegoScreen} />
      <Stack.Screen name="Estadisticas" component={EstadisticasScreen} />
      <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
    </Stack.Navigator>
  );
}