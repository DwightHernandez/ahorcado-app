// src/components/Ahorcado.js
import React from 'react';
import { View } from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';
import { useTema } from '../context/TemaContext';

export default function Ahorcado({ errores }) {
  const { tema } = useTema();
  const colorTrazo = tema.texto;

  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      {/* Dimensiones y lienzo del SVG */}
        <Svg height="190" width="160" viewBox="0 0 200 250">
        <G stroke={colorTrazo} strokeWidth="5" strokeLinecap="round">
          
          {/* Base y Poste (Siempre visibles) */}
          <Line x1="10" y1="240" x2="190" y2="240" />
          <Line x1="50" y1="240" x2="50" y2="20" />
          <Line x1="50" y1="20" x2="130" y2="20" />
          <Line x1="130" y1="20" x2="130" y2="50" />

          {/* Error 1: Cabeza */}
          {errores > 0 && <Circle cx="130" cy="75" r="25" fill="none" />}
          
          {/* Error 2: Cuerpo */}
          {errores > 1 && <Line x1="130" y1="100" x2="130" y2="160" />}
          
          {/* Error 3: Brazo Izquierdo */}
          {errores > 2 && <Line x1="130" y1="120" x2="90" y2="150" />}
          
          {/* Error 4: Brazo Derecho */}
          {errores > 3 && <Line x1="130" y1="120" x2="170" y2="150" />}
          
          {/* Error 5: Pierna Izquierda */}
          {errores > 4 && <Line x1="130" y1="160" x2="100" y2="220" />}
          
          {/* Error 6: Pierna Derecha */}
          {errores > 5 && <Line x1="130" y1="160" x2="160" y2="220" />}
        </G>
      </Svg>
    </View>
  );
}
