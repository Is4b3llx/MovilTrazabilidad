import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE = "http://192.168.0.20:3000/api";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  certificadoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 12,
  },
  certificadoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  certificadoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  certificadoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  certificadoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  certificadoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    fontSize: 14,
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 20,
    paddingVertical: 10,
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

  const handleGenerarQR = (lote) => {
    navigation.navigate('CertificadoQR', { idLote: lote.IdLote });
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
          <Text style={styles.buttonText}>📄 Certificado</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleGenerarQR(item)}
          style={[styles.certificadoButton, styles.certificadoButtonSecondary]}
        >
          <MaterialIcons name="qr-code" size={20} color="#fff" />
          <Text style={styles.buttonText}>📲 Generar QR</Text>
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
    <View style={styles.container}>
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
    </View>
  );
}
