import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>Bienvenido, Juan Pérez</Text>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity 
          style={styles.squareCard}
          onPress={() => navigation.navigate('Maquinas')}
        >
          <Text style={styles.squareCardText}>⚙️ Ver máquinas asignadas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.squareCard}
          onPress={() => navigation.navigate("Procesos")}
        >
          <Text style={styles.squareCardText}>🛠️ Ver Procesos Existentes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.squareCard}>
          <Text style={styles.squareCardText}>📑 Ver certificado del proceso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.squareCard} onPress={() => navigation.navigate('MateriasPrimas')}>
          <Text style={styles.squareCardText}>📦 Ver materias primas (solo vista)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.squareCard}>
          <Text style={styles.squareCardText}>🧪 Ver lote asignado (si aplica)</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  welcomeCard: {
    width: '100%',
    backgroundColor: '#059669',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    marginBottom: 30,
    shadowColor: '#064e3b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },

  welcomeText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },

  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // para separar columnas
  },

  squareCard: {
    width: '48%', // dos cards por fila con espacio entre ellos
    aspectRatio: 1, // para que sea cuadrado
    borderWidth: 1.5,
    borderColor: 'black',
    borderRadius: 12,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // fondo blanco para que se vea limpio y contraste con borde negro
    padding: 10,
  },

  squareCardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
