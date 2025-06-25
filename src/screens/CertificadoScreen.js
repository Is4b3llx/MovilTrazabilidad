import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE = "http://10.26.13.160:3000/api";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: width * 0.05,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: Math.min(width * 0.07, 28),
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#666',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05,
  },
  loadingText: {
    marginTop: 10,
    fontSize: Math.min(width * 0.04, 16),
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: Math.min(width * 0.04, 16),
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: width * 0.04,
    paddingBottom: height * 0.1,
  },
  certificadoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.05,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e8f5e8',
  },
  certificadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  certificadoTitle: {
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  certificadoText: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#666',
    marginBottom: 4,
  },
  certificadoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  certificadoButtons: {
    marginTop: height * 0.03,
  },
  certificadoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
    borderRadius: 6,
  },
  certificadoButtonPrimary: {
    backgroundColor: '#007c64',
  },
  certificadoButtonSecondary: {
    backgroundColor: '#5A6865',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: Math.min(width * 0.035, 14),
  },
  noResultsText: {
    fontSize: Math.min(width * 0.04, 16),
    color: '#999',
    marginBottom: 16,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default function CertificadosScreen() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/lote`);
      const data = await response.json();
      const lotesCertificados = data.filter(lote => lote.Estado === "Certificado");
      setCertificados(lotesCertificados);
    } catch (err) {
      console.error("Error al cargar certificados:", err);
      setError("Error al cargar los certificados");
    } finally {
      setLoading(false);
    }
  };

  const handleVerCertificado = (lote) => {
    navigation.navigate('CertificadoDetalle', { idLote: lote.IdLote });
  };

  const renderCertificado = ({ item }) => (
    <View style={styles.certificadoCard}>
      <View style={styles.certificadoHeader}>
        <MaterialIcons name="description" size={24} color="#007c64" />
        <Text style={styles.certificadoTitle}>Lote #{item.IdLote}</Text>
      </View>
      
      <Text style={styles.certificadoText}>
        <Text style={styles.certificadoLabel}>Nombre:</Text> {item.Nombre}
      </Text>
      <Text style={styles.certificadoText}>
        <Text style={styles.certificadoLabel}>Fecha de certificación:</Text> {new Date(item.FechaCreacion).toLocaleDateString()}
      </Text>

      <View style={styles.certificadoButtons}>
        <TouchableOpacity
          onPress={() => handleVerCertificado(item)}
          style={[styles.certificadoButton, styles.certificadoButtonPrimary]}
        >
          <MaterialIcons name="description" size={20} color="#fff" />
          <Text style={styles.buttonText}>📄 Ver Certificado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007c64" />
        <Text style={styles.loadingText}>Cargando certificados...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error" size={64} color="#d32f2f" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCertificados}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📄 Certificados de Calidad</Text>
        <Text style={styles.subtitle}>Selecciona un lote certificado para ver su trazabilidad completa</Text>
      </View>

      {certificados.length === 0 ? (
        <View style={styles.center}>
          <MaterialIcons name="description" size={64} color="#ccc" />
          <Text style={styles.noResultsText}>No hay lotes certificados</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchCertificados}>
            <Text style={styles.refreshButtonText}>Actualizar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={certificados}
          keyExtractor={item => item.IdLote.toString()}
          renderItem={renderCertificado}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
