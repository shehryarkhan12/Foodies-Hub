import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async () => {
    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    // TODO: Call the endpoint to update the password using the function provided in the previous answer.

    Alert.alert("Success", "Password updated successfully.");
    // TODO: Navigate to the desired screen after updating the password.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Create New Password</Text>
      <Text style={styles.subHeaderText}>Create a new unique password</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter Password"
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <TextInput 
        style={styles.input}
        placeholder="Enter Confirm Password"
        secureTextEntry={true}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.confirmButton} onPress={handlePasswordUpdate}>
        <Text style={styles.confirmButtonText}>Confirm</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>By Continuing you agree to</Text>
      <Text style={styles.linkText}>Privacy Policy</Text>
      <Text style={styles.linkText}>Terms & Conditions</Text>
      <Text style={styles.linkText}>Content Policy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 50,
  },
  subHeaderText: {
    fontSize: 16,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
fontWeight: 'bold',
},
footerText: {
fontSize: 14,
marginBottom: 10,
},
linkText: {
fontSize: 14,
color: 'blue',
textDecorationLine: 'underline',
marginBottom: 5,
},
});

export default NewPassword;