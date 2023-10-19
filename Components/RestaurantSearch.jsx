import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Platform, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const RestaurantSearch = () => {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [rating, setRating] = useState('');
  const [dietaryOptions, setDietaryOptions] = useState('');

  const handleSearch = async () => {
    console.log("Searching restaurants with filters:", {
      cuisine,
      priceRange,
      rating,
      dietaryOptions,
      location
    });

    // Implement your API call logic here
    try {
        console.log("Parameters being sent:", {
            latitude: location?.latitude,
            longitude: location?.longitude, 
            cuisine, 
            priceRange, 
            rating, 
            dietaryOptions 
        });

        const params = {
            latitude: location?.latitude,
            longitude: location?.longitude,
            cuisine,
            priceRange,
            rating,
            dietaryOptions
        };
        
        console.log('Sending parameters:', params);
        
        const response = await api.get('/search', { params });
        setResults(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
        // Request location permission for Android
        request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log('This feature is not available (on this device / in this context)');
                    break;
                case RESULTS.DENIED:
                    console.log('The permission has not been requested / is denied but requestable');
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    // After permission is granted, fetch the current location
                    Geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            setLocation({ latitude, longitude });
                        },
                        (error) => {
                            console.log(error);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                    break;
            }
        }).catch((error) => {
            console.error('Permission request error:', error);
        });
    } else {
        // If the device is not Android, directly fetch the current location
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }
}, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchForm}>
        <TextInput
          placeholder="Cuisine"
          value={cuisine}
          onChangeText={setCuisine}
          style={styles.input}
        />
        <TextInput
          placeholder="Price Range"
          value={priceRange}
          onChangeText={setPriceRange}
          style={styles.input}
        />
        <TextInput
          placeholder="Rating"
          value={rating}
          onChangeText={setRating}
          style={styles.input}
        />
        <TextInput
          placeholder="Dietary Options"
          value={dietaryOptions}
          onChangeText={setDietaryOptions}
          style={styles.input}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchForm: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default RestaurantSearch;


//const [results, setResults] = useState([]);


// const handleSearch = async () => {
    // try {
    //     console.log("Parameters being sent:", {
    //         latitude: location?.latitude,
    //         longitude: location?.longitude, 
    //         cuisine, 
    //         priceRange, 
    //         rating, 
    //         dietaryOptions 
    //     });

    //     const params = {
    //         latitude: location?.latitude,
    //         longitude: location?.longitude,
    //         cuisine,
    //         priceRange,
    //         rating,
    //         dietaryOptions
    //     };
        
    //     console.log('Sending parameters:', params);
        
    //     const response = await api.get('/search', { params });
    //     setResults(response.data);
    // } catch (error) {
    //     console.error(error);
    // }
// };
