import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../utils/homeStyles';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }) {
  const [userRole, setUserRole] = useState('operador'); // Valor por defecto
  const [loading, setLoading] = useState(true);

  // Obtener el cargo del usuario al cargar el componente
  useEffect(() => {
    const getUserRole = async () => {
      try {
        // Primero intentar obtener desde las props (si viene del login)
        const roleFromProps = route.params?.userRole;
        console.log('Cargo desde props:', roleFromProps);
        
        if (roleFromProps) {
          setUserRole(roleFromProps);
        } else {
          // Si no viene por props, obtener desde AsyncStorage
          const storedRole = await AsyncStorage.getItem('userCargo');
          console.log('Cargo desde AsyncStorage:', storedRole);
          if (storedRole) {
            setUserRole(storedRole);
          }
        }
      } catch (error) {
        console.error('Error al obtener el cargo del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    getUserRole();
  }, [route.params?.userRole]);

  // Debug: mostrar el cargo actual
  useEffect(() => {
    console.log('Cargo actual del usuario:', userRole);
  }, [userRole]);

  // Cards principales - se filtran según el cargo (exactamente como en la web)
  const allMainCards = [
    {
      id: 1,
      title: "Ver Materia Primas",
      description: "Consulta el inventario disponible",
      icon: "inventory",
      color: "#059669",
      route: "MateriasPrimas",
      roles: ['admin', 'operador', 'supervisor'] // Todos pueden ver
    },
    {
      id: 2,
      title: "Ver Lotes",
      description: "Revisa los lotes en proceso",
      icon: "format-list-bulleted",
      color: "#059669",
      route: "Lotes",
      roles: ['admin', 'operador', 'supervisor'] // Todos pueden ver
    },
    {
      id: 3,
      title: "Ver Máquinas",
      description: "Estado de equipos disponibles",
      icon: "precision-manufacturing",
      color: "#059669",
      route: "Maquinas",
      roles: ['admin'] // Solo admin
    },
    {
      id: 4,
      title: "Ver Certificados",
      description: "Consulta los certificados",
      icon: "file-certificate",
      color: "#059669",
      route: "Certificados",
      roles: ['admin', 'operador', 'supervisor'] // Todos pueden ver
    },
    {
      id: 5,
      title: "Ver Procesos",
      description: "Gestión de procesos",
      icon: "factory",
      color: "#059669",
      route: "Procesos",
      roles: ['admin'] // Solo admin
    }
  ];

  // Filtrar cards según el rol del usuario (exactamente como en la web)
  const mainCards = allMainCards.filter(card => {
    const hasAccess = card.roles.includes(userRole);
    console.log(`Card "${card.title}": usuario=${userRole}, roles=${card.roles}, acceso=${hasAccess}`);
    return hasAccess;
  });

  // Navegación inferior - también se filtra por cargo
  const allNavItems = [
    { 
      name: 'Home', 
      icon: 'home', 
      component: 'Home',
      iconType: MaterialIcons,
      active: true,
      roles: ['admin', 'operador', 'supervisor'] // Todos pueden ver
    },
    { 
      name: 'Proceso', 
      icon: 'factory', 
      component: 'Procesos',
      iconType: MaterialCommunityIcons,
      roles: ['admin'] // Solo admin
    },
    { 
      name: 'Certificar Lote', 
      icon: 'bottle-tonic', 
      component: 'certificarlote',
      iconType: MaterialCommunityIcons,
      roles: ['admin', 'operador', 'supervisor'] // Todos pueden ver
    },
    { 
      name: 'Certificados', 
      icon: 'file-certificate', 
      component: 'Certificados',
      iconType: FontAwesome5,
      route: "Certificado",
      roles: ['admin', 'operador', 'supervisor'] // Todos pueden ver
    },
  ];

  // Filtrar items de navegación según el rol (exactamente como en la web)
  const navItems = allNavItems.filter(item => {
    const hasAccess = item.roles.includes(userRole);
    console.log(`Nav item "${item.name}": usuario=${userRole}, roles=${item.roles}, acceso=${hasAccess}`);
    return hasAccess;
  }).map(item => ({
    ...item,
    active: item.component === 'Home' // Mantener solo Home como activo
  }));

  // Texto del cargo para mostrar en el header
  const roleDisplayText = {
    'admin': 'Administrador',
    'operador': 'Operador',
    'supervisor': 'Supervisor'
  }[userRole] || 'Usuario';

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
        {/* Encabezado - muestra el cargo dinámico */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bienvenido</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{roleDisplayText}</Text>
          </View>
        </View>

        {/* Contenido principal - muestra solo las cards permitidas */}
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

        {/* Barra de navegación inferior - muestra solo los items permitidos */}
        <View style={styles.bottomNav}>
          {navItems.map((item, index) => {
            const Icon = item.iconType;
            return (
              <TouchableOpacity 
                key={index}
                style={item.active ? styles.navItemActive : styles.navItem}
                onPress={() => navigation.navigate(item.component)}
              >
                <Icon 
                  name={item.icon} 
                  size={24} 
                  color={item.active ? "#059669" : "#6b7280"} 
                />
                <Text style={item.active ? styles.navTextActive : styles.navText}>
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
