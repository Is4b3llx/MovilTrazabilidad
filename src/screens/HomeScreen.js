import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import styles from '../utils/homeStyles';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }) {
  // Obtener el cargo del usuario (puede venir por props o async storage)
  const userRole = route.params?.userRole || 'admin'; // Valor por defecto 'operador'

  // Cards principales - se filtran según el cargo
  const allMainCards = [
    {
      id: 1,
      title: "Ver Materia Primas",
      description: "Consulta el inventario disponible",
      icon: "inventory",
      color: "#059669",
      route: "MateriasPrimas",
      roles: ['admin', 'operador'] // Roles que pueden ver esta opción
    },
    {
      id: 2,
      title: "Ver Lotes",
      description: "Revisa los lotes en proceso",
      icon: "format-list-bulleted",
      color: "#059669",
      route: "Lotes",
      roles: ['admin', 'operador']
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
      roles: ['admin', 'operador']
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

  // Filtrar cards según el rol del usuario
  const mainCards = allMainCards.filter(card => 
    card.roles.includes(userRole.toLowerCase())
  );

  // Navegación inferior - también se filtra por cargo
  const allNavItems = [
    { 
      name: 'Home', 
      icon: 'home', 
      component: 'Home',
      iconType: MaterialIcons,
      active: true,
      roles: ['admin', 'operador']
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
      component: 'Transformacion',
      iconType: MaterialCommunityIcons,
      roles: ['admin', 'operador']
    },
    { 
      name: 'Certificados', 
      icon: 'file-certificate', 
      component: 'Certificados',
      iconType: FontAwesome5,
      route: "Certificado",
      roles: ['admin', 'operador']
    },
    { 
      name: 'Reportes', 
      icon: 'assessment', 
      component: 'Reportes',
      iconType: MaterialIcons,
      roles: ['admin'] // Solo admin
    }
  ];

  // Filtrar items de navegación según el rol
  const navItems = allNavItems.filter(item => 
    item.roles.includes(userRole.toLowerCase())
  ).map(item => ({
    ...item,
    active: item.component === 'Home' // Mantener solo Home como activo
  }));

  // Texto del cargo para mostrar en el header
  const roleDisplayText = {
    'admin': 'Administrador',
    'operador': 'Operador',
    'supervisor': 'Supervisor'
  }[userRole.toLowerCase()] || 'Usuario';

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