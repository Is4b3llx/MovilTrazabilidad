import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MateriasPrimasScreen from './src/screens/MateriasPrimasScreen'; // 👈🏼 nueva línea
import MaquinasScreen from './src/screens/MaquinasScreen';
import ProcesosScreen from './src/screens/ProcesosScreen'; // ajusta la ruta si es distinta
import LotesScreen from './src/screens/LotesScreen';
import OperadorScreen from './src/screens/OperadorScreen';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Maquinas" component={MaquinasScreen} />
        <Stack.Screen name="Procesos" component={ProcesosScreen} />
        <Stack.Screen name="Lotes" component={LotesScreen} />
  <Stack.Screen name="OperadorScreen" component={OperadorScreen} />
        <Stack.Screen 
  name="MateriasPrimas" 
  component={MateriasPrimasScreen} 
  options={{ title: 'Materias Primas' }} 
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}