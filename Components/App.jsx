
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Register from './Register';
import RestaurantSearch from './RestaurantSearch';
import StartScreen from './StartScreen';
import newLogin from './newLogin';
import RestaurantDetails from './RestaurantDetails';
import ForgetPassword from './ForgetPassword';
import OTP from './OTP';
import NewPassword from './NewPassword';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen name="Login" component={Login} options={{ title: '' }} /> 
        <Stack.Screen name="Register" component={Register} options={{ title: '' }} />
        <Stack.Screen name="StartScreen" component={StartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RestaurantSearch" component={RestaurantSearch} options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="OTP" component={OTP} options={{ headerShown: false }} />
        <Stack.Screen name="NewPassword" component={NewPassword} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
