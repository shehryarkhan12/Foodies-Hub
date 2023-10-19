
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ImageBackground } from 'react-native';
import ForgetPassword from './ForgetPassword';


// Import your API client, make sure to point to the correct file
import api from '../api/api';


const Login = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async () => {
  try {
    const { username, password } = formData; // Destructuring from formData
    const response = await api.post('/login', { username, password });
    if (response.data && response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert('Logged in!');
        
        // Navigate to Restaurant Search screen
        navigation.navigate('RestaurantSearch');
    } else {
        throw new Error('No token received');
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Login failed!');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <View style={styles.inputContainer}>
      <ImageBackground source={require('../Images/email.png')} style={styles.iconStyle} resizeMode="contain"></ImageBackground>
      <TextInput
        style={styles.inputWithIcon}
        placeholder="Enter Username or Email"
        value={formData.username}
        onChangeText={(text) => handleInputChange("username", text)}
      />
      </View>
      <View style={styles.inputContainer}>
      <ImageBackground source={require('../Images/lock.png')} style={styles.iconStyle} resizeMode="contain"></ImageBackground>
      <TextInput
        style={styles.inputWithIcon}
        placeholder="Enter Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
        secureTextEntry={true}
      />
      </View>
      <TouchableOpacity o onPress={() => navigation.navigate('ForgetPassword')}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.terms}>
    <Text>By Continuing you agree to</Text>
    <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => {/* Handle Privacy Policy link click */}}>
            <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text>  </Text>
        <TouchableOpacity onPress={() => {/* Handle Terms & Conditions link click */}}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
        </TouchableOpacity>
        <Text>  </Text>
        <TouchableOpacity onPress={() => {/* Handle Content Policy link click */}}>
            <Text style={styles.linkText}>Content Policy</Text>
        </TouchableOpacity>
    </View>
</View>

</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    color: 'red'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
  },
  forgotPassword: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    marginRight:260,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  terms: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
},
linkText: {
    color: 'red',
    textDecorationLine: 'underline',
},
inputContainer: {
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  marginBottom: 20,
  alignItems: 'center',
},
iconStyle: {
  width: 24, // adjust this based on the size you want for the icon
  height: 24, // adjust this based on the size you want for the icon
  marginRight: 10,
},
inputWithIcon: {
  flex: 1, // to ensure the input takes up the remaining width
  fontSize: 18,
},
});

export default Login;


