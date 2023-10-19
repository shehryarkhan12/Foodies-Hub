import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import api from '../api/api';  // Your API module

// Define types
interface NotificationScreenProps {
  userId: string; // Define the type, assuming userId is a string
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({ userId }) => {
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const granted = await messaging().requestPermission();

      if (granted) {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
          // Save the user's FCM token to your backend
          await api.post('/save-token', { userId, fcmToken });
          setPermissionStatus('Token saved successfully!');
        } else {
          setPermissionStatus('Failed to get FCM Token!');
        }
      } else {
        setPermissionStatus('Notification permission denied!');
      }
    };

    requestPermission();
  }, [userId]);

  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Stay updated with our latest notifications</Text>

      <Text style={styles.status}>
        {permissionStatus || 'Requesting permission...'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => { /* perhaps navigate somewhere or prompt again */ }}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f9fc',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
    color: '#828282',
  },
  status: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default NotificationScreen;
