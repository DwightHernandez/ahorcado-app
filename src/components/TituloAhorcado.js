// src/components/TituloAhorcado.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colores } from '../theme/colores';

const LETRAS = ['A', 'H', 'O', 'R', 'C', 'A', 'D'];

export default function TituloAhorcado() {
  const tema = colores.claro;

  // Creamos un valor de animación (opacidad e Y) para cada una de las 7 letras + el "O"-muñeco (total 8)
  const animaciones = useRef(
    Array(8).fill(null).map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Animación secuencial (tipo fade-in y subida leve) con retraso de 120ms entre cada letra
    const secuencia = animaciones.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      });
    });

    Animated.stagger(120, secuencia).start();
  }, [animaciones]);

  return (
    <View style={styles.contenedor}>
      {/* 1. Renderizar letras "A H O R C A D" */}
      {LETRAS.map((letra, index) => {
        const animEstilo = {
          opacity: animaciones[index],
          transform: [
            {
              translateY: animaciones[index].interpolate({
                inputRange: [0, 1],
                outputRange: [15, 0], // Sube levemente de abajo hacia arriba al aparecer
              }),
            },
          ],
        };

        return (
          <Animated.Text
            key={index}
            style={[styles.letra, animEstilo, { color: tema.primario }]}
          >
            {letra}
          </Animated.Text>
        );
      })}

      {/* 2. Renderizar la "O"-Stickman al final */}
      <Animated.View
        style={[
          styles.contenedorO,
          {
            opacity: animaciones[7],
            transform: [
              {
                translateY: animaciones[7].interpolate({
                  inputRange: [0, 1],
                  outputRange: [15, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Svg height="65" width="40" viewBox="0 0 40 65">
          {/* Cabeza (La letra O) */}
          <Circle
            cx="20"
            cy="15"
            r="8"
            stroke={tema.primario}
            strokeWidth="3.5"
            fill="none"
          />
          {/* Detalle sutil de la soga o gorrito superior (opcional) */}
          <Line
            x1="20"
            y1="2"
            x2="20"
            y2="7"
            stroke={tema.primario}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Tronco/Cuerpo */}
          <Line
            x1="20"
            y1="23"
            x2="20"
            y2="42"
            stroke={tema.primario}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Brazos */}
          <Line
            x1="20"
            y1="28"
            x2="10"
            y2="38"
            stroke={tema.primario}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Line
            x1="20"
            y1="28"
            x2="30"
            y2="38"
            stroke={tema.primario}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Piernas */}
          <Line
            x1="20"
            y1="42"
            x2="11"
            y2="57"
            stroke={tema.primario}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <Line
            x1="20"
            y1="42"
            x2="29"
            y2="57"
            stroke={tema.primario}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 20,
    height: 75, 
  },
  letra: {
    fontSize: 48,
    fontFamily: 'System', // Cambiar si usas una fuente personalizada
    fontWeight: '900', // Black font weight
    marginHorizontal: 1,
  },
  contenedorO: {
    marginLeft: 3,
    marginTop: 6, // Ajuste para alinear la "O" con la base de las letras
  },
});