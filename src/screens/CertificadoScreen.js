import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Share, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import QRCode from 'react-native-qrcode-svg';
import styles from '../utils/lotesStyles';

const API_CERTIFICADOS = "http://192.168.0.19:3000/api/lote";

export default function CertificadosScreen() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQR, setCurrentQR] = useState('');
  const [currentLote, setCurrentLote] = useState(null);
  const viewRef = useRef();

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const response = await fetch(API_CERTIFICADOS);
        const data = await response.json();
        const lotesCertificados = data.filter(lote => lote.Estado === "Certificado");
        setCertificados(lotesCertificados);
      } catch (err) {
        setError("Error al cargar certificados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificados();
  }, []);

  const generatePDF = async (lote) => {
    try {
      Alert.alert(
        'Generando PDF',
        'Estamos preparando tu certificado...',
        [],
        { cancelable: false }
      );

      // Obtener datos completos del lote
      const [loteRes, logRes] = await Promise.all([
        fetch(`${API_CERTIFICADOS}/${lote.IdLote}`).then(res => res.json()),
        fetch(`http://192.168.0.19:3000/api/proceso-evaluacion/log/${lote.IdLote}`).then(res => res.json())
      ]);

      // Capturar la vista como imagen
      const uri = await captureRef(viewRef, {
        format: 'jpg',
        quality: 0.9,
      });

      // Convertir a PDF
      const pdfPath = `${FileSystem.documentDirectory}certificado_${lote.IdLote}.pdf`;
      const base64Data = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

      await FileSystem.writeAsStringAsync(pdfPath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el PDF
      await Share.share({
        url: `file://${pdfPath}`,
        title: `Certificado Lote ${lote.IdLote}`,
      });

    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  const showQR = (lote) => {
    setCurrentQR(`http://192.168.0.19:3000/certificado/${lote.IdLote}`);
    setCurrentLote(lote);
    setModalVisible(true);
  };

  const shareQR = async () => {
    try {
      await Share.share({
        message: `Certificado de calidad - Lote #${currentLote.IdLote}: ${currentQR}`,
        title: `Compartir QR - Lote ${currentLote.IdLote}`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const renderCertificado = ({ item }) => (
    <View style={styles.card} ref={viewRef} collapsable={false}>
      <Text style={styles.title}>Lote #{item.IdLote}</Text>
      <Text style={styles.detail}>Nombre: {item.Nombre}</Text>
      <Text style={styles.detail}>
        Certificado: {new Date(item.FechaCreacion).toLocaleDateString()}
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2E8B57', flex: 1, marginRight: 5 }]}
          onPress={() => generatePDF(item)}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>📄 Descargar PDF</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#5A6865', flex: 1, marginLeft: 5 }]}
          onPress={() => showQR(item)}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>📲 Ver QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#2E8B57"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>📄 Certificados de Calidad</Text>
        <Text style={{ color: '#666' }}>Selecciona un lote certificado</Text>
      </View>

      <FlatList
        data={certificados}
        renderItem={renderCertificado}
        keyExtractor={item => item.IdLote.toString()}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
            No hay lotes certificados
          </Text>
        }
      />

      {/* Modal para el QR */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
            width: '80%'
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              QR Lote #{currentLote?.IdLote}
            </Text>
            
            <QRCode
              value={currentQR}
              size={200}
              color="black"
              backgroundColor="white"
            />
            
            <Text style={{ marginTop: 15, fontSize: 12, color: '#666', textAlign: 'center' }}>
              {currentQR}
            </Text>
            
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#2E8B57', marginRight: 10 }]}
                onPress={shareQR}
              >
                <Text style={{ color: 'white' }}>Compartir</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#5A6865' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: 'white' }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}