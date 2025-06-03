import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import styles from '../utils/homeStyles';
import { MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  // Cards principales
  const mainCards = [
    {
      id: 1,
      title: "Ver Materia Primas",
      description: "Consulta el inventario disponible",
      icon: "inventory",
      color: "#059669",
      route: "MateriasPrimas" // Ruta original que ya tienes funcionando
    },
    {
      id: 2,
      title: "Ver Lotes",
      description: "Revisa los lotes en proceso",
      icon: "format-list-bulleted",
      color: "#059669",
      route: "Lotes" // ← Aquí se dirige a LotesScreen
    },
    {
      id: 3,
      title: "Ver Máquinas",
      description: "Estado de equipos disponibles",
      icon: "precision-manufacturing",
      color: "#059669",
      route: "Maquinas" // Ruta original
    }
  ];

  // Navegación inferior
  const navItems = [
    { 
      name: 'Home', 
      icon: 'home', 
      component: 'Home',
      iconType: MaterialIcons,
      active: true
    },
    { 
      name: 'Proceso', 
      icon: 'factory', 
      component: 'Procesos',
      iconType: MaterialCommunityIcons
    },
    { 
      name: 'Transformación', 
      icon: 'bottle-tonic', 
      component: 'Transformacion',
      iconType: MaterialCommunityIcons
    },
    { 
      name: 'Certificados', 
      icon: 'file-certificate', 
      component: 'Certificados',
      iconType: FontAwesome5
    },
    { 
      name: 'Reportes', 
      icon: 'assessment', 
      component: 'Reportes',
      iconType: MaterialIcons
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bienvenido, Isabella Parada </Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>Administrador</Text>
          </View>
        </View>

        {/* Contenido principal */}
        <ScrollView style={styles.mainContent}>
          {/* Cards principales */}
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

          {/* Estadísticas */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Resumen del día</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>Máquinas</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Procesos</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>98%</Text>
                <Text style={styles.statLabel}>Eficiencia</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Barra de navegación inferior */}
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
