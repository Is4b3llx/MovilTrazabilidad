import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MateriasPrimasScreen from './src/screens/MateriasPrimasScreen';
import LotesScreen from './src/screens/LotesScreen';
import CertificadoScreen from './src/screens/CertificadoScreen';
import CertificadoDetalleScreen from './src/screens/CertificadoDetalleScreen';
import CertificarLoteScreen from './src/screens/CertificarLoteScreen';
import MaquinasScreen from './src/screens/MaquinasScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Lotes" component={LotesScreen} />
        <Stack.Screen name="Certificados" component={CertificadoScreen} />
        <Stack.Screen name="CertificadoDetalle" component={CertificadoDetalleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="certificarlote" component={CertificarLoteScreen} />
        <Stack.Screen 
          name="MateriasPrimas" 
          component={MateriasPrimasScreen} 
          options={{ title: 'Materias Primas' }} 
        />
        <Stack.Screen name="Maquinas" component={MaquinasScreen} options={{ title: 'Máquinas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}