import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../utils/homeStyles';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  // Obtener el nombre del usuario al cargar el componente
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        }
      } catch (error) {
        console.error('Error al obtener información del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  // Cards principales - solo funcionalidades de operador
  const mainCards = [
    {
      id: 1,
      title: "Ver Materia Primas",
      description: "Consulta el inventario disponible",
      icon: "inventory",
      color: "#059669",
      route: "MateriasPrimas"
    },
    {
      id: 2,
      title: "Ver Lotes",
      description: "Revisa los lotes en proceso",
      icon: "format-list-bulleted",
      color: "#059669",
      route: "Lotes"
    },
    {
      id: 3,
      title: "Ver Certificados",
      description: "Consulta los certificados",
      icon: "file-certificate",
      color: "#059669",
      route: "Certificados"
    },
    {
      id: 4,
      title: "Ver Máquinas",
      description: "Consulta y gestiona las máquinas",
      icon: "precision-manufacturing",
      color: "#059669",
      route: "Maquinas"
    }
  ];

  // Navegación inferior - solo funcionalidades de operador
  const navItems = [
    { 
      name: 'Home', 
      icon: 'home', 
      component: 'Home',
      iconType: MaterialIcons,
      active: true
    },
    { 
      name: 'Certificar Lote', 
      icon: 'bottle-tonic', 
      component: 'certificarlote',
      iconType: MaterialCommunityIcons
    },
    { 
      name: 'Certificados', 
      icon: 'file-certificate', 
      component: 'Certificados',
      iconType: FontAwesome5,
      route: "Certificado"
    }
  ];

  // Si está cargando, mostrar un indicador simple
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Encabezado - muestra el nombre del operador */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bienvenido</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Operador</Text>
          </View>
        </View>

        {/* Contenido principal - muestra solo las cards de operador */}
        <ScrollView style={styles.mainContent}>
          <View style={styles.mainCardsContainer}>
            {mainCards.map((card) => (
              <TouchableOpacity 
                key={card.id}
                style={[styles.mainCard, { backgroundColor: card.color }]}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(card.route)} 
              >
                <MaterialIcons name={card.icon} size={30} color="white" />
                <Text style={styles.mainCardTitle}>{card.title}</Text>
                <Text style={styles.mainCardDescription}>{card.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Barra de navegación inferior - solo funcionalidades de operador */}
        <View style={styles.bottomNav}>
          {navItems.map((item, index) => {
            const Icon = item.iconType;
            return (
              <TouchableOpacity 
                key={index}
                style={item.active ? styles.navItemActive : styles.navItem}
                onPress={() => navigation.navigate(item.component)}
              >
                <Icon name={item.icon} size={24} color={item.active ? "#2E8B57" : "#666"} />
                <Text style={[styles.navItemText, item.active && styles.navItemTextActive]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
