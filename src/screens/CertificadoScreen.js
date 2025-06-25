import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE = "http://10.26.13.160:3000/api";
const { width, height } = Dimensions.get('window');
=======
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE = "http://192.168.0.20:3000/api";
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
<<<<<<< HEAD
    padding: width * 0.05,
=======
    padding: 20,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
<<<<<<< HEAD
    fontSize: Math.min(width * 0.07, 28),
=======
    fontSize: 28,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
<<<<<<< HEAD
    fontSize: Math.min(width * 0.04, 16),
=======
    fontSize: 16,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    color: '#666',
    textAlign: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
<<<<<<< HEAD
    padding: width * 0.05,
  },
  loadingText: {
    marginTop: 10,
    fontSize: Math.min(width * 0.04, 16),
=======
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    color: '#666',
  },
  errorText: {
    marginTop: 10,
<<<<<<< HEAD
    fontSize: Math.min(width * 0.04, 16),
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
=======
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007c64',
    paddingHorizontal: 20,
    paddingVertical: 10,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
<<<<<<< HEAD
    padding: width * 0.04,
    paddingBottom: height * 0.1,
=======
    padding: 16,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
  },
  certificadoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
<<<<<<< HEAD
    padding: width * 0.05,
    marginBottom: height * 0.02,
=======
    padding: 20,
    marginBottom: 16,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
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
<<<<<<< HEAD
    marginBottom: height * 0.015,
  },
  certificadoTitle: {
    fontSize: Math.min(width * 0.05, 20),
=======
    marginBottom: 12,
  },
  certificadoTitle: {
    fontSize: 20,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  certificadoText: {
<<<<<<< HEAD
    fontSize: Math.min(width * 0.035, 14),
=======
    fontSize: 14,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    color: '#666',
    marginBottom: 4,
  },
  certificadoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  certificadoButtons: {
<<<<<<< HEAD
    marginTop: height * 0.03,
=======
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
  },
  certificadoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< HEAD
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.03,
=======
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
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

<<<<<<< HEAD
=======
  const handleGenerarQR = (lote) => {
    navigation.navigate('CertificadoQR', { idLote: lote.IdLote });
  };

>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
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
<<<<<<< HEAD
          <Text style={styles.buttonText}>📄 Ver Certificado</Text>
=======
          <Text style={styles.buttonText}>📄 Certificado</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleGenerarQR(item)}
          style={[styles.certificadoButton, styles.certificadoButtonSecondary]}
        >
          <MaterialIcons name="qr-code" size={20} color="#fff" />
          <Text style={styles.buttonText}>📲 Generar QR</Text>
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
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
<<<<<<< HEAD
    <SafeAreaView style={styles.container}>
=======
    <View style={styles.container}>
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
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
<<<<<<< HEAD
    </SafeAreaView>
=======
    </View>
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
  );
}
