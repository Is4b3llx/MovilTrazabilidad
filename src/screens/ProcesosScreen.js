import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView, Image, StyleSheet } from 'react-native';
import styles from '../utils/procesosStyles';

const API = "http://192.168.0.19:3000/api/procesos";

export default function ProcesosScreen({ navigation }) {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProceso, setSelectedProceso] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setProcesos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener procesos:", err);
        setLoading(false);
      });
  }, []);

  const handleVerDetalle = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`);
      const data = await response.json();
      setSelectedProceso(data);
      setModalVisible(true);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#2E8B57"
        style={{ flex: 1, justifyContent: 'center' }}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Botón para crear nuevo proceso */}
      <TouchableOpacity 
        style={styles.crearButton}
        onPress={() => navigation.navigate('CrearProceso')}
      >
        <Text style={styles.crearButtonText}>➕ Crear Proceso</Text>
      </TouchableOpacity>

      <FlatList
        data={procesos}
        keyExtractor={(item) => item.IdProceso.toString()}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.Nombre}</Text>
            <Text style={styles.detail}>{item.Descripcion}</Text>
            
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#2E8B57' }]}
                onPress={() => handleVerDetalle(item.IdProceso)}
              >
                <Text style={styles.buttonText}>Ver detalle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de Detalles */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
      >
        <ScrollView style={detailStyles.modalContainer}>
          {selectedProceso && (
            <>
              <View style={detailStyles.header}>
                <Text style={detailStyles.headerTitle}>Proceso de Transformación</Text>
                <Text style={detailStyles.procesoTitle}>{selectedProceso.Nombre}</Text>
                <Text style={detailStyles.procesoId}>ID: {selectedProceso.IdProceso}</Text>
              </View>

              {/* Listado de Máquinas */}
              <View style={detailStyles.maquinasContainer}>
                {selectedProceso.Maquinas?.map((maquina) => (
                  <View key={maquina.IdMaquina} style={detailStyles.maquinaCard}>
                    <Image 
                      source={{ uri: maquina.Imagen }} 
                      style={detailStyles.maquinaImage} 
                      resizeMode="contain"
                    />
                    <Text style={detailStyles.maquinaTitle}>
                      #{maquina.Numero} – {maquina.Nombre}
                    </Text>
                    <View style={detailStyles.variablesContainer}>
                      {maquina.variables?.map((variable, index) => (
                        <Text key={index} style={detailStyles.variableText}>
                          • {variable.nombre} ({variable.min} – {variable.max})
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          <TouchableOpacity 
            style={detailStyles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={detailStyles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

// Estilos específicos para el modal de detalle
const detailStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007c64',
    marginBottom: 5,
  },
  procesoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  procesoId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  maquinasContainer: {
    marginBottom: 20,
  },
  maquinaCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  maquinaImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  maquinaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  variablesContainer: {
    marginLeft: 10,
  },
  variableText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '500',
  },
});

