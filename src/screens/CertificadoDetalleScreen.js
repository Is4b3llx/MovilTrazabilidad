import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, StyleSheet, Alert, Share, SafeAreaView, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../utils/certificadodetalleStyle';

const API_BASE = "http://10.26.13.160:3000/api";
const { width, height } = Dimensions.get('window');


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
      
      // Crear el HTML del certificado
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Certificado Lote ${idLote}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: white;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #007c64;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .fecha {
              font-size: 12px;
              color: #999;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 16px;
              font-weight: bold;
              color: #007c64;
              margin-bottom: 10px;
            }
            .info-container {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 6px;
            }
            .info-text {
              font-size: 14px;
              color: #333;
              margin-bottom: 5px;
            }
            .info-label {
              font-weight: bold;
            }
            .maquina-card {
              border: 1px solid #ddd;
              border-radius: 6px;
              padding: 15px;
              margin-bottom: 10px;
            }
            .maquina-ok {
              border-color: #4caf50;
              background-color: #f1f8e9;
            }
            .maquina-fail {
              border-color: #f44336;
              background-color: #ffebee;
            }
            .maquina-title {
              font-size: 14px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .variables-container {
              margin-left: 10px;
            }
            .variable-text {
              font-size: 12px;
              color: #666;
              margin-bottom: 3px;
            }
            .variable-label {
              font-weight: bold;
            }
            .resultado-section {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
            .resultado-badge {
              padding: 10px 20px;
              border-radius: 20px;
              margin-bottom: 10px;
              display: inline-block;
            }
            .resultado-ok {
              background-color: #e8f5e8;
              color: #2e7d32;
            }
            .resultado-fail {
              background-color: #ffebee;
              color: #d32f2f;
            }
            .resultado-text {
              font-size: 16px;
              font-weight: bold;
            }
            .resultado-motivo {
              font-size: 14px;
              color: #666;
            }
            .sello {
              position: absolute;
              top: 50%;
              right: 20px;
              transform: rotate(15deg);
              opacity: 0.1;
              font-size: 48px;
              font-weight: bold;
              color: #007c64;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">Certificado de Calidad</div>
            <div class="subtitle">Sistema de Trazabilidad y Producción</div>
            <div class="fecha">Fecha de evaluación: ${fecha}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Información del Lote</div>
            <div class="info-container">
              <div class="info-text"><span class="info-label">ID:</span> ${lote.IdLote}</div>
              <div class="info-text"><span class="info-label">Nombre:</span> ${lote.Nombre}</div>
              <div class="info-text"><span class="info-label">Fecha de creación:</span> ${new Date(lote.FechaCreacion).toLocaleDateString()}</div>
            </div>
          </div>
          
          ${lote.MateriasPrimas && lote.MateriasPrimas.length > 0 ? `
          <div class="section">
            <div class="section-title">Materias Primas Utilizadas</div>
            <div class="info-container">
              ${lote.MateriasPrimas.map(mp => `<div class="info-text">• ${mp.Nombre} – ${mp.Cantidad}</div>`).join('')}
            </div>
          </div>
          ` : ''}
          
          <div class="section">
            <div class="section-title">Proceso de Transformación</div>
            ${log.Maquinas && log.Maquinas.map(maq => `
              <div class="maquina-card ${maq.CumpleEstandar ? 'maquina-ok' : 'maquina-fail'}">
                <div class="maquina-title">
                  ${maq.NumeroMaquina}. ${maq.NombreMaquina} ${maq.CumpleEstandar ? "✅" : "❌"}
                </div>
                <div class="variables-container">
                  ${maq.VariablesIngresadas && Object.entries(maq.VariablesIngresadas).map(([k, v]) => 
                    `<div class="variable-text"><span class="variable-label">${k}:</span> ${v}</div>`
                  ).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="resultado-section">
            <div class="resultado-badge ${(estado === 'Aprobado' || estado === 'Certificado' || estado === 'Aprobada') ? 'resultado-ok' : 'resultado-fail'}">
              <div class="resultado-text">
                ${(estado === 'Aprobado' || estado === 'Certificado' || estado === 'Aprobada') ? '✅ APROBADO' : '❌ RECHAZADO'}
              </div>
            </div>
            ${motivo ? `<div class="resultado-motivo">${motivo}</div>` : ''}
          </div>
          
          <div class="sello">CERTIFICADO</div>
        </body>
        </html>
      `;

      // Generar el PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });

      // Compartir el archivo PDF
      await Share.share({
        url: uri,
        title: `Certificado Lote ${idLote}`,
        message: `Certificado de calidad del lote ${idLote}`
      });

    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      Alert.alert("Error", "Error al generar el certificado PDF");
    } finally {
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
    <SafeAreaView style={styles.container}>
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
                      <Text key={`${maq.NumeroMaquina}-${k}-${index}`} style={styles.variableText}>
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
              estado === 'Aprobado' || estado === 'Certificado' || estado === 'Aprobada' ? styles.resultadoOk : styles.resultadoFail
            ]}>
              <Text style={[
                styles.resultadoText,
                { color: (estado === 'Aprobado' || estado === 'Certificado' || estado === 'Aprobada') ? '#2e7d32' : '#d32f2f' }
              ]}>
                {(estado === 'Aprobado' || estado === 'Certificado' || estado === 'Aprobada') ? '✅ APROBADO' : '❌ RECHAZADO'}
              </Text>
            </View>
            {motivo && (
              <Text style={styles.resultadoMotivo}>{motivo}</Text>
            )}
          </View>

          {/* Sello de agua */}
          <View style={styles.selloContainer}>
            <Text style={styles.selloText}>CERTIFICADO</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 