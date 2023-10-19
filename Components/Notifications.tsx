import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';



// Define the prop types for this component if there are any (none in this example)
interface NotificationsProps {}

const Notifications: React.FC<NotificationsProps> = () => {
    const [latestNotification, setLatestNotification] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            if (remoteMessage.notification && remoteMessage.notification.body) {
                setLatestNotification(remoteMessage.notification.body);
            }
        });

        return unsubscribe;
    }, []);

    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Latest Notification:</Text>
            <Text style={styles.message}>{latestNotification || "No new notifications"}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#f0f4f7',
    },
    icon: {
        alignSelf: 'center',
        width: 64,
        height: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
    },
});

export default Notifications;
