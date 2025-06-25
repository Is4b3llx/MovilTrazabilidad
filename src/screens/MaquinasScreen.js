import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../utils/maquinasStyles';

const API = "http://10.26.13.160:3000/api/maquinas";
const API_MAQUINAS_ASIGNADAS = "http://10.26.13.160:3000/api/operadores";

export default function MaquinasScreen() {
  const [maquinas, setMaquinas] = useState([]);
  const [maquinasAsignadas, setMaquinasAsignadas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resMaquinas = await fetch(API);
      const dataMaquinas = await resMaquinas.json();
      setMaquinas(dataMaquinas);
      const operadorId = await AsyncStorage.getItem('operadorId');
      if (operadorId) {
        const resAsignadas = await fetch(`${API_MAQUINAS_ASIGNADAS}/${operadorId}/maquinas`);
        const dataAsignadas = await resAsignadas.json();
        setMaquinasAsignadas(dataAsignadas.map(m => m.IdMaquina));
      } else {
        setMaquinasAsignadas([]);
      }
    } catch (error) {
      setMaquinas([]);
      setMaquinasAsignadas([]);
    } finally {
      setLoading(false);
=======
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../utils/maquinasStyles';

const API = "http://192.168.0.20:3000/api/maquinas";
const UPLOAD_API = "http://192.168.0.20:3000/api/maquinas/upload";

export default function MaquinasScreen() {
  const [maquinas, setMaquinas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [cargando, setCargando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);

  useEffect(() => {
    cargarMaquinas();
  }, []);

  const cargarMaquinas = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setMaquinas(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las máquinas");
      console.error(error);
    }
  };

  const seleccionarImagen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0]);
    }
  };

  const subirImagen = async () => {
    if (!imagen) return;
    
    setSubiendo(true);
    const formData = new FormData();
    
    // Preparar el archivo para FormData
    formData.append('imagen', {
      uri: imagen.uri,
      type: 'image/jpeg', // o el tipo correcto de tu imagen
      name: 'maquina.jpg'
    });

    try {
      const res = await fetch(UPLOAD_API, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const data = await res.json();
      if (res.ok) {
        setImagenUrl(data.imageUrl);
      } else {
        throw new Error(data.message || 'Error al subir imagen');
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubiendo(false);
    }
  };

  const guardarMaquina = async () => {
    if (!nombre || !imagenUrl) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setCargando(true);
    
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, imagenUrl }),
      });

      const data = await res.json();
      
      if (res.ok) {
        Alert.alert("Éxito", "Máquina guardada ✅");
        setNombre("");
        setImagen(null);
        setImagenUrl("");
        cargarMaquinas();
      } else {
        throw new Error(data.message || 'Error al guardar máquina');
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
    }
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
=======
      <Text style={styles.titulo}>Gestión de Máquinas</Text>

      {/* Formulario de creación */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la máquina"
          value={nombre}
          onChangeText={setNombre}
        />

        <TouchableOpacity 
          style={styles.imagePickerButton} 
          onPress={seleccionarImagen}
        >
          <MaterialIcons name="cloud-upload" size={24} color="gray" />
          <Text style={styles.imagePickerText}>
            {imagen ? imagen.uri.split('/').pop() : "Seleccionar imagen"}
          </Text>
        </TouchableOpacity>

        {imagenUrl ? (
          <Image 
            source={{ uri: imagenUrl }} 
            style={styles.previewImage} 
          />
        ) : null}

        <TouchableOpacity 
          style={[styles.button, (!imagen || subiendo) && styles.buttonDisabled]}
          onPress={subirImagen}
          disabled={!imagen || subiendo}
        >
          {subiendo ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>📤 Subir imagen</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.saveButton, (!nombre || !imagenUrl || cargando) && styles.buttonDisabled]}
          onPress={guardarMaquina}
          disabled={!nombre || !imagenUrl || cargando}
        >
          {cargando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>💾 Guardar máquina</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Lista de máquinas */}
      <Text style={styles.subtitulo}>Máquinas registradas</Text>
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
      <FlatList
        data={maquinas}
        keyExtractor={(item) => item.IdMaquina.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
<<<<<<< HEAD
        ListHeaderComponent={
          <>
            <Text style={styles.titulo}>Gestión de Máquinas</Text>
            <Text style={styles.subtitulo}>Todas las máquinas</Text>
            {loading && <ActivityIndicator color="#007c64" />}
          </>
        }
=======
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
        renderItem={({ item }) => (
          <View style={styles.maquinaCard}>
            <Image
              source={{ uri: item.ImagenUrl }}
              style={styles.maquinaImage}
              resizeMode="contain"
            />
<<<<<<< HEAD
            <Text style={[
              styles.maquinaNombre,
              maquinasAsignadas.includes(item.IdMaquina) && { color: 'red', fontWeight: 'bold' }
            ]}>
              {item.Nombre}
            </Text>
=======
            <Text style={styles.maquinaNombre}>{item.Nombre}</Text>
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
          </View>
        )}
      />
    </View>
  );
}