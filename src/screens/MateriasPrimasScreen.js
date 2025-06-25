<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet, 
  RefreshControl 
} from 'react-native';

const API = "http://10.26.13.160:3000/api/materia-prima";
=======
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity,
  TextInput, Modal, Alert, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../utils/materiasStyles';

const API = "http://192.168.0.20:3000/api/materia-prima";
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3

export default function MateriasPrimasScreen() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
<<<<<<< HEAD
=======
  const [modalVisible, setModalVisible] = useState(false);

  const [nombre, setNombre] = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [cantidad, setCantidad] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fecha, setFecha] = useState(new Date());
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3

  const fetchMaterias = () => {
    setRefreshing(true);
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setMaterias(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        console.error("Error al obtener materias primas:", err);
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchMaterias();
<<<<<<< HEAD
  }, []);

=======
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setFecha(today);
    setFechaRecepcion(formatted);
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFecha(selectedDate);
      setFechaRecepcion(formattedDate);
    }
  };

  const handleAddMateria = async () => {
    if (!nombre || !fechaRecepcion || !cantidad) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Nombre: nombre,
          FechaRecepcion: fechaRecepcion,
          Proveedor: proveedor,
          Cantidad: parseFloat(cantidad),
        }),
      });
      if (response.ok) {
        Alert.alert("Éxito", "Materia prima creada correctamente");
        setModalVisible(false);
        resetForm();
        fetchMaterias();
      } else {
        Alert.alert("Error", "No se pudo crear la materia prima");
      }
    } catch (error) {
      Alert.alert("Error", "Error al crear materia prima");
      console.error(error);
    }
  };

  const resetForm = () => {
    setNombre('');
    setProveedor('');
    setCantidad('');
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setFecha(today);
    setFechaRecepcion(formatted);
  };

>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E8B57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Materias Primas Registradas</Text>
        </View>
<<<<<<< HEAD
      </View>

=======

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Agregar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nueva Materia Prima</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre de la materia prima"
            />

            <Text style={styles.label}>Fecha de Recepción *</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{fechaRecepcion || "Seleccionar fecha"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={fecha}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.label}>Proveedor</Text>
            <TextInput
              style={styles.input}
              value={proveedor}
              onChangeText={setProveedor}
              placeholder="Nombre del proveedor"
            />

            <Text style={styles.label}>Cantidad *</Text>
            <TextInput
              style={styles.input}
              value={cantidad}
              onChangeText={setCantidad}
              placeholder="Cantidad"
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddMateria}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
      <FlatList
        data={materias}
        keyExtractor={(item) => item.IdMateriaPrima.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.Nombre}</Text>
            <Text style={styles.detail}>Cantidad: {item.Cantidad} {item.Unidad}</Text>
            {item.Proveedor && <Text style={styles.detail}>Proveedor: {item.Proveedor}</Text>}
            {item.Descripcion && <Text style={styles.detail}>Descripción: {item.Descripcion}</Text>}
          </View>
        )}
        refreshing={refreshing}
        onRefresh={fetchMaterias}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No hay materias primas registradas
          </Text>
        }
      />
    </View>
  );
}
<<<<<<< HEAD

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#E6F2E6',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2E8B57',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
=======
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
