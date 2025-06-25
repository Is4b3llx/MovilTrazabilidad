import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
<<<<<<< HEAD
import MateriasPrimasScreen from './src/screens/MateriasPrimasScreen';
import LotesScreen from './src/screens/LotesScreen';
import CertificadoScreen from './src/screens/CertificadoScreen';
import CertificadoDetalleScreen from './src/screens/CertificadoDetalleScreen';
import CertificarLoteScreen from './src/screens/CertificarLoteScreen';
import MaquinasScreen from './src/screens/MaquinasScreen';
=======
import MateriasPrimasScreen from './src/screens/MateriasPrimasScreen'; // 👈🏼 nueva línea
import MaquinasScreen from './src/screens/MaquinasScreen';
import ProcesosScreen from './src/screens/ProcesosScreen'; // ajusta la ruta si es distinta
import LotesScreen from './src/screens/LotesScreen';
import CertificadoScreen from './src/screens/CertificadoScreen';
import CertificadoDetalleScreen from './src/screens/CertificadoDetalleScreen';
import CertificadoQRScreen from './src/screens/CertificadoQRScreen';
import CertificarLoteScreen from './src/screens/CertificarLoteScreen';
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
<<<<<<< HEAD
        <Stack.Screen name="Lotes" component={LotesScreen} />
        <Stack.Screen name="Certificados" component={CertificadoScreen} />
        <Stack.Screen name="CertificadoDetalle" component={CertificadoDetalleScreen} options={{ headerShown: false }} />
=======
        <Stack.Screen name="Maquinas" component={MaquinasScreen} />
        <Stack.Screen name="Procesos" component={ProcesosScreen} />
        <Stack.Screen name="Lotes" component={LotesScreen} />
        <Stack.Screen name="Certificados" component={CertificadoScreen} />
        <Stack.Screen name="CertificadoDetalle" component={CertificadoDetalleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CertificadoQR" component={CertificadoQRScreen} options={{ headerShown: false }} />
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
        <Stack.Screen name="certificarlote" component={CertificarLoteScreen} />
        <Stack.Screen 
          name="MateriasPrimas" 
          component={MateriasPrimasScreen} 
          options={{ title: 'Materias Primas' }} 
        />
<<<<<<< HEAD
        <Stack.Screen name="Maquinas" component={MaquinasScreen} options={{ title: 'Máquinas' }} />
=======
>>>>>>> 1c5ee86969699d15ad52d2c74b237a0c88c830c3
      </Stack.Navigator>
    </NavigationContainer>
  );
}