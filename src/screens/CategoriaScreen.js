// src/screens/CategoriaScreen.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTema } from '../context/TemaContext';

const CATEGORIAS = ['Capitales de Colombia', 'Animales de Colombia', 'Frutas', 'Comidas típicas', 'Aleatoria'];
const NIVELES = ['Fácil', 'Medio', 'Difícil'];

export default function CategoriaScreen({ route, navigation }) {
  const { jugador } = route.params;
  const [categoriaSel, setCategoriaSel] = useState('Aleatoria');
  const [nivelSel, setNivelSel] = useState('Fácil');
  const { tema } = useTema();

  const iniciarJuego = () => {
    navigation.navigate('Juego', { 
      jugador, 
      categoria: categoriaSel, 
      nivel: nivelSel 
    });
  };

  return (
    <ScrollView contentContainerStyle={[styles.contenedor, { backgroundColor: tema.fondo }]}>
      <Text style={[styles.saludo, { color: tema.texto }]}>Hola, {jugador}</Text>
      <Text style={[styles.instruccion, { color: tema.texto }]}>Selecciona una categoría:</Text>
      
      <View style={styles.grilla}>
        {CATEGORIAS.map(cat => (
          <Pressable 
            key={cat} 
            style={[styles.tarjeta, categoriaSel === cat ? { backgroundColor: tema.primario } : { backgroundColor: tema.teclaHabilitada }]}
            onPress={() => setCategoriaSel(cat)}
          >
            <Text style={[styles.textoTarjeta, { color: categoriaSel === cat ? '#FFF' : tema.texto }]}>{cat}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.instruccion, { color: tema.texto }]}>Nivel de dificultad:</Text>
      <View style={styles.filaNiveles}>
        {NIVELES.map(niv => (
          <Pressable 
            key={niv} 
            style={[styles.botonNivel, nivelSel === niv ? { backgroundColor: tema.acierto } : { backgroundColor: tema.teclaHabilitada }]}
            onPress={() => setNivelSel(niv)}
          >
            <Text style={[styles.textoNivel, { color: nivelSel === niv ? '#FFF' : tema.texto }]}>{niv}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.botonJugar} onPress={iniciarJuego}>
        <Text style={styles.textoJugar}>¡EMPEZAR A JUGAR!</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexGrow: 1, padding: 20, alignItems: 'center' },
  saludo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 10 },
  instruccion: { fontSize: 18, fontWeight: '600', alignSelf: 'flex-start', marginBottom: 10, marginTop: 10 },
  grilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 20 },
  tarjeta: { padding: 15, borderRadius: 10, width: '45%', alignItems: 'center', elevation: 2 },
  textoTarjeta: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  filaNiveles: { flexDirection: 'row', gap: 10, width: '100%', justifyContent: 'center', marginBottom: 30 },
  botonNivel: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  textoNivel: { fontSize: 16, fontWeight: 'bold' },
  botonJugar: { width: '90%', backgroundColor: '#FF9800', padding: 18, borderRadius: 12, alignItems: 'center', elevation: 4 },
  textoJugar: { color: '#FFF', fontSize: 20, fontWeight: 'bold', letterSpacing: 1 }
});
