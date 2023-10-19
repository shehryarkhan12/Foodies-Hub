
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import api from '../api/api';

const Register = () => {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "", // Added this
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
        const { username, email, password } = formData; 
        console.log(formData)
        await api.post('/register', { username, email, password });
        Alert.alert('Registered successfully!');
        
        navigation.navigate('Login');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        Alert.alert('Registration failed!');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#aaa"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="#aaa"
          value={formData.email}
          onChangeText={(text) => handleInputChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          placeholderTextColor="#aaa"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          placeholderTextColor="#aaa"
          // Assuming you would have a 'confirmPassword' in your formData
           value={formData.confirmPassword}
           onChangeText={(text) => handleInputChange("confirmPassword", text)}
          secureTextEntry={true}
        />
      </View>
      
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Already have an account? 
        <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}> Login</Text>
      </Text>
      
      <Text style={styles.footerPolicyText}>
        By Continuing you agree to
        <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Privacy Policy</Text>,
        <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Terms & Conditions</Text>, and 
        <Text style={styles.linkText} onPress={() => Linking.openURL('#')}> Content Policy</Text>.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
  },
  registerButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerText: {
    fontSize: 16,
    marginBottom: 10,
  },
  linkText: {
    color: '#ff3b30',
  },
  footerPolicyText: {
    fontSize: 14,
    textAlign: 'center',
  }
});

export default Register;
