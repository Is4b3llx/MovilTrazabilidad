import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Configuración de la API (ajusta la IP según tu entorno)
const API_LOTES = "http://192.168.0.20:3000/api/lote";
const API_PROCESO = "http://192.168.0.20:3000/api/proceso-transformacion"; // Ajusta según tus endpoints

export default function CertificarLoteScreen() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Obtener lotes pendientes
  useEffect(() => {
    const fetchLotesPendientes = async () => {
      try {
        const response = await fetch(API_LOTES);
        const data = await response.json();
        const pendientes = data.filter(lote => lote.Estado === "Pendiente");
        setLotes(pendientes);
        setError(null);
      } catch (err) {
        console.error("Error al cargar lotes:", err);
        setError("Error al cargar los lotes. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchLotesPendientes();
  }, []);

  // Navegar al detalle del lote
  const handleSeleccionarLote = (idLote) => {
    navigation.navigate('DetalleProcesoLote', { idLote });
  };

  // Pantalla de carga
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  // Manejo de errores
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  // Sin lotes pendientes
  if (lotes.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No hay lotes pendientes para certificar.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Lotes Pendientes</Text>
      <Text style={styles.subtitle}>Selecciona un lote para iniciar su certificación</Text>

      <FlatList
        data={lotes}
        keyExtractor={(item) => item.IdLote.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleSeleccionarLote(item.IdLote)}
          >
            <Text style={styles.cardTitle}>Lote #{item.IdLote}</Text>
            <Text style={styles.cardText}>Nombre: {item.Nombre}</Text>
            <Text style={styles.cardText}>
              Fecha: {new Date(item.FechaCreacion).toLocaleDateString()}
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.Estado}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// Estilos (similar a tu web)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E8B57',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  badge: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFEB3B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '500',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});