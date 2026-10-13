import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function InicioScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Pantalla de Inicio</Text>
      <Button 
        title="Ir a Juego" 
        onPress={() => navigation.navigate('Juego')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  texto: { fontSize: 20, marginBottom: 20 }
});