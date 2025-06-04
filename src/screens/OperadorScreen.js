import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';

const API_MAQUINAS = "http://192.168.0.19:3000/api/maquinas";

export default function OperadorScreen({ navigation }) {
  const [maquinas, setMaquinas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Datos de ejemplo para las tareas (puedes mantenerlos si los necesitas)
  const tareas = [
    { id: 1, descripcion: 'Revisión de equipos mañana', estado: 'Pendiente' },
  ];

  useEffect(() => {
    cargarMaquinas();
  }, []);

  const cargarMaquinas = async () => {
    try {
      const res = await fetch(API_MAQUINAS);
      if (!res.ok) throw new Error("Error al cargar máquinas");
      const data = await res.json();
      setMaquinas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2E8B57" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel de Operador</Text>
        <Text style={styles.headerSubtitle}>Bienvenido, Isa</Text>
      </View>

      {/* Contenido principal */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card de resumen */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Resumen</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{maquinas.length}</Text>
              <Text style={styles.statLabel}>Máquinas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Operativas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>En Mantenimiento</Text>
            </View>
          </View>
        </View>

        {/* Lista de máquinas */}
        <Text style={styles.sectionTitle}>Máquinas registradas</Text>
        
        {cargando ? (
          <ActivityIndicator size="large" color="#2E8B57" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          maquinas.map((maquina) => (
            <TouchableOpacity 
              key={maquina.IdMaquina} 
              style={styles.taskCard}
              onPress={() => navigation.navigate('DetalleMaquina', { maquina })}
            >
              <Text style={styles.taskText}>{maquina.Nombre}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Operativa</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Botón de acción */}
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('NuevaTarea')}
        >
          <Text style={styles.actionButtonText}>+ Reportar Incidencia</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Añade estos nuevos estilos al objeto StyleSheet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E8B57',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  content: {
    padding: 15,
    paddingBottom: 30,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#444',
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#f1c40f',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#2ecc71',
  },
  statusInProgress: {
    backgroundColor: '#3498db',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});