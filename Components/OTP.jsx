import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation object
  const verifyCode = async () => {
    // Concatenating the individual digits to form the OTP
    const otpCode = otp.join('');

    // POST request to verify reset code
    const response = await fetch('http://192.168.1.4:4000/verify-reset-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'Shahryarinam34@gmail.com', code: otpCode }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      Alert.alert("Success", "Code verified successfully");
      navigation.navigate('NewPassword'); 
    } else {
      Alert.alert("Error", data.message || "Failed to verify code.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        <Text style={styles.otpText}>Enter OTP!</Text>
        <Text style={styles.subText}>Enter code shared on your email</Text>
        <View style={styles.inputContainer}>
          <TextInput style={styles.input} maxLength={1} />
          <TextInput style={styles.input} maxLength={1} />
          <TextInput style={styles.input} maxLength={1} />
          <TextInput style={styles.input} maxLength={1} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText} onPress={verifyCode}>Verify</Text>
        </TouchableOpacity>
        <Text style={styles.resendText}>Didn't receive code? <Text style={styles.resendLink}>Resend</Text></Text>
      </View>
      <Text style={styles.footer}>By Continuing you agree to</Text>
      <Text style={styles.link}>Privacy Policy</Text>
      <Text style={styles.link}>Terms & Conditions</Text>
      <Text style={styles.link}>Content Policy</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpContainer: {
    width: '80%',
    alignItems: 'center',
  },
  otpText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    textAlign: 'center',
    fontSize: 18,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  resendText: {
    fontSize: 16,
  },
  resendLink: {
    color: 'red',
  },
  footer: {
    marginTop: 50,
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
  },
});

export default OTP;
