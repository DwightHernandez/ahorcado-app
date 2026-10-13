import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { useTema } from '../context/TemaContext';

export default function Ahorcado({ errores }) {
  const { tema } = useTema();
  const soporte = tema.texto;
  const personaje = errores >= 4 ? tema.error : tema.primario;

  return (
    <View style={[styles.tarjeta, { backgroundColor: tema.teclaHabilitada, borderColor: tema.borde }]}>
      <Svg width="220" height="196" viewBox="0 0 220 196" accessibilityLabel={`Ahorcado, ${errores} errores de 6`}>
        <Circle cx="110" cy="98" r="83" fill={tema.fondo} opacity="0.55" />

        {/* Horca */}
        <Path d="M35 174 H125 M62 174 V22 H142 V42" fill="none" stroke={tema.borde} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <Line x1="125" y1="42" x2="125" y2="51" stroke={tema.borde} strokeWidth="5" strokeLinecap="round" />

        {/* Partes del cuerpo: una aparece por cada error */}
        {errores > 0 && <Circle cx="125" cy="68" r="17" fill="none" stroke={personaje} strokeWidth="5" />}
        {errores > 1 && <Line x1="125" y1="85" x2="125" y2="128" stroke={personaje} strokeWidth="5" strokeLinecap="round" />}
        {errores > 2 && <Line x1="125" y1="98" x2="101" y2="116" stroke={personaje} strokeWidth="5" strokeLinecap="round" />}
        {errores > 3 && <Line x1="125" y1="98" x2="149" y2="116" stroke={personaje} strokeWidth="5" strokeLinecap="round" />}
        {errores > 4 && <Line x1="125" y1="128" x2="105" y2="154" stroke={personaje} strokeWidth="5" strokeLinecap="round" />}
        {errores > 5 && <Line x1="125" y1="128" x2="145" y2="154" stroke={personaje} strokeWidth="5" strokeLinecap="round" />}
      </Svg>
      <View style={styles.indicadores}>
        {Array.from({ length: 6 }, (_, index) => (
          <View
            key={index}
            style={[styles.indicador, { backgroundColor: index < errores ? tema.error : tema.borde }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    width: '90%',
    maxWidth: 360,
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  indicadores: { flexDirection: 'row', gap: 6 },
  indicador: { width: 22, height: 5, borderRadius: 5 },
});
