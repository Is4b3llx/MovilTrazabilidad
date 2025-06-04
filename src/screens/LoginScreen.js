import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (usuario === 'Isabella' && password === '123') {
      navigation.navigate('Home');
    } else if (usuario === 'Isa' && password === '123') {
      navigation.navigate('OperadorScreen');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Bienvenido</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor="#999"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ... (los estilos se mantienen igual)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f2e6', // verde muy claro para fondo suave
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 40,
    paddingHorizontal: 30,
    shadowColor: '#144d14', // sombra verde oscura
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2E8B57', // verde principal
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#4c7a44', // verde medio para subtítulo
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#2E8B57', // verde borde
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#2E8B57', // verde botón
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
});
