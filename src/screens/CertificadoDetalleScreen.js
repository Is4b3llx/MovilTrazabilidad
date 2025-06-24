import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';

const API_BASE = "http://192.168.0.20:3000/api";

export default function CertificadoDetalleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { idLote } = route.params;
  
  const [lote, setLote] = useState(null);
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const viewRef = useRef();

  useEffect(() => {
    cargarCertificado();
  }, [idLote]);

  const cargarCertificado = async () => {
    try {
      setLoading(true);
      const [loteRes, logRes] = await Promise.all([
        fetch(`${API_BASE}/lote/${idLote}`),
        fetch(`${API_BASE}/proceso-evaluacion/log/${idLote}`)
      ]);
      
      if (!loteRes.ok || !logRes.ok) {
        throw new Error('Error al cargar el certificado');
      }
      
      const loteData = await loteRes.json();
      const logData = await logRes.json();
      
      setLote(loteData);
      setLog(logData);
    } catch (error) {
      console.error("Error al cargar el certificado:", error);
      Alert.alert("Error", "Error al cargar el certificado");
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = async () => {
    try {
      setGeneratingPDF(true);
      
      // Esperar a que se renderice la vista
      setTimeout(async () => {
        try {
          const uri = await captureRef(viewRef, {
            format: 'png',
            quality: 1,
            width: 794, // A4 width
            height: 1120 // A4 height
          });

          const fileName = `certificado-lote-${idLote}.png`;
          const filePath = `${FileSystem.documentDirectory}${fileName}`;
          
          // Copiar la imagen capturada al directorio de documentos
          await FileSystem.copyAsync({
            from: uri,
            to: filePath
          });

          // Compartir el archivo
          await Share.share({
            url: filePath,
            title: `Certificado Lote ${idLote}`,
            message: `Certificado de calidad del lote ${idLote}`
          });

        } catch (error) {
          console.error("Error al generar imagen:", error);
          Alert.alert("Error", "Error al generar el certificado");
        } finally {
          setGeneratingPDF(false);
        }
      }, 1000);

    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      Alert.alert("Error", "Error al generar el certificado");
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007c64" />
        <Text style={styles.loadingText}>Cargando certificado...</Text>
      </View>
    );
  }

  if (!lote || !log) {
    return (
      <View style={styles.center}>
        <MaterialIcons name="error" size={64} color="#d32f2f" />
        <Text style={styles.errorText}>No se pudo cargar el certificado</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarCertificado}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const estado = log.ResultadoFinal?.EstadoFinal;
  const motivo = log.ResultadoFinal?.Motivo;
  const fecha = new Date(log.ResultadoFinal?.FechaEvaluacion || Date.now()).toLocaleDateString();

  return (
    <View style={styles.container}>
      {/* Header con botón de descarga */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007c64" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Certificado Lote #{idLote}</Text>
        <TouchableOpacity
          onPress={descargarPDF}
          disabled={generatingPDF}
          style={[styles.downloadButton, generatingPDF && styles.buttonDisabled]}
        >
          <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
          <Text style={styles.downloadButtonText}>
            {generatingPDF ? 'Generando...' : '📥 Descargar PDF'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenido del certificado */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View ref={viewRef} style={styles.certificadoContainer}>
          {/* Encabezado institucional */}
          <View style={styles.certificadoHeader}>
            <Text style={styles.certificadoTitle}>Certificado de Calidad</Text>
            <Text style={styles.certificadoSubtitle}>Sistema de Trazabilidad y Producción</Text>
            <Text style={styles.certificadoFecha}>Fecha de evaluación: {fecha}</Text>
          </View>

          {/* Información general */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información del Lote</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>ID:</Text> {lote.IdLote}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Nombre:</Text> {lote.Nombre}
              </Text>
              <Text style={styles.infoText}>
                <Text style={styles.infoLabel}>Fecha de creación:</Text> {new Date(lote.FechaCreacion).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Materias primas */}
          {lote.MateriasPrimas && lote.MateriasPrimas.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Materias Primas Utilizadas</Text>
              <View style={styles.materiasContainer}>
                {lote.MateriasPrimas.map((mp) => (
                  <Text key={mp.IdMateriaPrima} style={styles.materiaText}>
                    • {mp.Nombre} – {mp.Cantidad}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Proceso por máquinas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Proceso de Transformación</Text>
            <View style={styles.maquinasContainer}>
              {log.Maquinas && log.Maquinas.map((maq) => (
                <View
                  key={maq.NumeroMaquina}
                  style={[
                    styles.maquinaCard,
                    maq.CumpleEstandar ? styles.maquinaCardOk : styles.maquinaCardFail
                  ]}
                >
                  <Text style={styles.maquinaTitle}>
                    {maq.NumeroMaquina}. {maq.NombreMaquina} {maq.CumpleEstandar ? "✅" : "❌"}
                  </Text>
                  <View style={styles.variablesContainer}>
                    {maq.VariablesIngresadas && Object.entries(maq.VariablesIngresadas).map(([k, v], index) => (
                      <Text key={`${maq.NumeroMaquina}-${k}-${index}-${Math.random()}`} style={styles.variableText}>
                        <Text style={styles.variableLabel}>{k}:</Text> {v}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Resultado final */}
          <View style={styles.resultadoSection}>
            <View style={[
              styles.resultadoBadge,
              estado === "Certificado" ? styles.resultadoOk : styles.resultadoFail
            ]}>
              <Text style={styles.resultadoText}>
                ✅ {estado}
              </Text>
            </View>
            <Text style={styles.resultadoMotivo}>{motivo}</Text>
          </View>

          {/* Sello visual (simulado) */}
          <View style={styles.selloContainer}>
            <Text style={styles.selloText}>CERTIFICADO</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007c64',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadButtonText: {
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
  },
  certificadoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  certificadoHeader: {
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: '#007c64',
    paddingBottom: 16,
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
    marginBottom: 8,
  },
  certificadoFecha: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 8,
  },
  infoContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  materiasContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
  },
  materiaText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  maquinasContainer: {
    gap: 12,
  },
  maquinaCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
  },
  maquinaCardOk: {
    borderColor: '#4caf50',
    backgroundColor: '#f1f8e9',
  },
  maquinaCardFail: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  maquinaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  variablesContainer: {
    marginLeft: 8,
  },
  variableText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  variableLabel: {
    fontWeight: 'bold',
  },
  resultadoSection: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resultadoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  resultadoOk: {
    backgroundColor: '#e8f5e8',
  },
  resultadoFail: {
    backgroundColor: '#ffebee',
  },
  resultadoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultadoMotivo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selloContainer: {
    position: 'absolute',
    top: '50%',
    right: 20,
    transform: [{ rotate: '15deg' }],
    opacity: 0.1,
  },
  selloText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007c64',
  },
}); 