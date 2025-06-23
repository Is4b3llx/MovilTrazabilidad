import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, Share, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import QRCode from 'react-native-qrcode-svg';

const API_BASE = "http://192.168.0.20:3000/api";

export default function CertificadosScreen() {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentQR, setCurrentQR] = useState('');
  const [currentLote, setCurrentLote] = useState(null);
  const [currentLog, setCurrentLog] = useState(null);
  const viewRef = useRef();

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const response = await fetch(`${API_BASE}/lote`);
        const data = await response.json();
        const lotesCertificados = data.filter(lote => lote.Estado === "Certificado");
        setCertificados(lotesCertificados);
      } catch (err) {
        Alert.alert("Error al cargar los certificados");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificados();
  }, []);

  const generatePDF = async (lote) => {
    try {
      const [loteData, logData] = await Promise.all([
        fetch(`${API_BASE}/lote/${lote.IdLote}`).then(res => res.json()),
        fetch(`${API_BASE}/proceso-evaluacion/log/${lote.IdLote}`).then(res => res.json())
      ]);

      setCurrentLote(loteData);
      setCurrentLog(logData);

      setTimeout(async () => {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1
        });

        const pdfPath = `${FileSystem.documentDirectory}certificado_${lote.IdLote}.jpg`;
        const base64Data = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.writeAsStringAsync(pdfPath, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Share.share({
          url: pdfPath,
          title: `Certificado Lote ${lote.IdLote}`,
        });
      }, 500);

    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      Alert.alert("Error al generar el certificado");
    }
  };

  const showQR = (lote) => {
    setCurrentQR(`http://192.168.0.20:3000/api/certificado/${lote.IdLote}`);
    setCurrentLote(lote);
    setModalVisible(true);
  };

  const renderCertificado = ({ item }) => (
    <View style={{
      backgroundColor: "#fff", padding: 16, marginBottom: 12, borderRadius: 8,
      shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2
    }}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Lote #{item.IdLote}</Text>
      <Text>Nombre: {item.Nombre}</Text>
      <Text>Fecha: {new Date(item.FechaCreacion).toLocaleDateString()}</Text>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity
          onPress={() => generatePDF(item)}
          style={{ flex: 1, backgroundColor: "#007c64", padding: 10, borderRadius: 6, marginRight: 4 }}
        >
          <Text style={{ color: "#fff", textAlign: 'center' }}>📄 PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => showQR(item)}
          style={{ flex: 1, backgroundColor: "#5A6865", padding: 10, borderRadius: 6, marginLeft: 4 }}
        >
          <Text style={{ color: "#fff", textAlign: 'center' }}>📲 QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>📄 Certificados de Calidad</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007c64" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={certificados}
          keyExtractor={item => item.IdLote.toString()}
          renderItem={renderCertificado}
        />
      )}

      {/* QR Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>QR - Lote #{currentLote?.IdLote}</Text>
            <QRCode value={currentQR} size={200} />
            <Text style={{ marginTop: 10, fontSize: 12 }}>{currentQR}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 20 }}>
              <Text style={{ color: '#007c64' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Vista invisible del certificado */}
      {currentLote && currentLog && (
        <View ref={viewRef} style={{
          position: 'absolute', top: -9999, left: -9999, width: 794, minHeight: 1120, backgroundColor: '#fff', padding: 24
        }}>
          <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>CERTIFICADO DE CALIDAD</Text>
          <Text style={{ textAlign: 'center' }}>Fecha: {new Date(currentLog.ResultadoFinal.FechaEvaluacion).toLocaleDateString()}</Text>
          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Lote #{currentLote.IdLote}</Text>
          <Text>Nombre: {currentLote.Nombre}</Text>
          <Text>Fecha de creación: {new Date(currentLote.FechaCreacion).toLocaleDateString()}</Text>

          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Materias Primas:</Text>
          {currentLote.MateriasPrimas.map(mp => (
            <Text key={mp.IdMateriaPrima}>- {mp.Nombre}: {mp.Cantidad}</Text>
          ))}

          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Proceso:</Text>
          {currentLog.Maquinas.map(m => (
            <View key={m.NumeroMaquina}>
              <Text>{m.NumeroMaquina}. {m.NombreMaquina} {m.CumpleEstandar ? "✅" : "❌"}</Text>
              {Object.entries(m.VariablesIngresadas).map(([k, v]) => (
                <Text key={k}>  {k}: {v}</Text>
              ))}
            </View>
          ))}

          <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Resultado:</Text>
          <Text style={{ color: currentLog.ResultadoFinal.EstadoFinal === "Certificado" ? "green" : "red" }}>
            {currentLog.ResultadoFinal.EstadoFinal}
          </Text>
          <Text>{currentLog.ResultadoFinal.Motivo}</Text>
        </View>
      )}
    </View>
  );
}
