import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CertificadoQRScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idLote } = route.params;
  
  const [sharing, setSharing] = useState(false);
  
  // URL del certificado (como en la web)
  const certificadoURL = `http://192.168.0.20:3000/api/certificado/${idLote}`;

  const compartirCertificado = async () => {
    try {
      setSharing(true);
      
      // Compartir la URL del certificado
      await Share.share({
        message: `Certificado del lote ${idLote}\n\nAccede al certificado completo aquí:\n${certificadoURL}`,
        title: `Certificado Lote ${idLote}`,
      });
    } catch (error) {
      console.error("Error al compartir:", error);
      Alert.alert("Error", "No se pudo compartir el certificado");
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007c64" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certificado QR</Text>
        <TouchableOpacity
          onPress={compartirCertificado}
          disabled={sharing}
          style={[styles.shareButton, sharing && styles.buttonDisabled]}
        >
          <MaterialIcons name="share" size={20} color="#fff" />
          <Text style={styles.shareButtonText}>
            {sharing ? 'Compartiendo...' : 'Compartir'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido del certificado */}
      <View style={styles.content}>
        <View style={styles.certificadoContainer}>
          <View style={styles.certificadoHeader}>
            <MaterialIcons name="qr-code" size={64} color="#007c64" />
            <Text style={styles.certificadoTitle}>Lote #{idLote}</Text>
            <Text style={styles.certificadoSubtitle}>Certificado de Calidad</Text>
          </View>
          
          <View style={styles.qrPlaceholder}>
            <MaterialIcons name="qr-code-2" size={120} color="#007c64" />
            <Text style={styles.qrPlaceholderText}>Código QR</Text>
            <Text style={styles.qrPlaceholderSubtext}>
              Escanea para ver el certificado completo
            </Text>
          </View>
          
          <View style={styles.urlContainer}>
            <Text style={styles.urlLabel}>URL del certificado:</Text>
            <Text style={styles.urlText}>{certificadoURL}</Text>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <MaterialIcons name="info" size={20} color="#007c64" />
            <Text style={styles.infoText}>
              Este QR contiene toda la información del certificado de calidad
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="smartphone" size={20} color="#007c64" />
            <Text style={styles.infoText}>
              Puedes compartir este certificado para que otros puedan verificar la calidad
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <MaterialIcons name="verified" size={20} color="#007c64" />
            <Text style={styles.infoText}>
              El certificado incluye el proceso completo y resultado de evaluación
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007c64',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  shareButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  certificadoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  certificadoHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  certificadoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  certificadoSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  qrPlaceholder: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
  },
  qrPlaceholderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007c64',
    marginTop: 8,
    marginBottom: 4,
  },
  qrPlaceholderSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  urlContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    width: '100%',
  },
  urlLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  urlText: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
}); 