import React, { useEffect, useState, useCallback } from 'react';
import { Alert, View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Geolocation from '@react-native-community/geolocation';
import { saveMyPositionVariable } from './Redux/actions/myPosition';
import { saveLocationVariable } from './Redux/actions/locationAction';
import { saveUnitVariable } from './Redux/actions/unitAction';
import { useDispatch, useSelector, Provider } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {

    const dispatch = useDispatch()
    const locationlist = useSelector((state) => state.myState.locationListVariable);
    const [loadState, setLoadState] = useState(locationlist)

    const [dimension, setDimension] = useState(Dimensions.get('window'));
    const onChange = useCallback(() => {
        setDimension(Dimensions.get('window'));
    }, []);

    const loadSettings = async () => {
        try {

            const unit = await AsyncStorage.getItem('savedUnit');
            if (unit !== null) {
                const data = JSON.parse(unit)
                console.log(data)
                dispatch(saveUnitVariable(data.data))
            }

            const locations = await AsyncStorage.getItem('savedLocations');
            console.log(locations)
            if (locations !== null) {
                const data = JSON.parse(locations)
                setLoadState(data)
               

                // dispatch(saveLocationVariable([...locationlist, data]))
            }

            return locations

        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    useEffect(() => {
        dispatch(saveLocationVariable(loadState))
    }, [loadState])

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', onChange);
        return () => {
            subscription.remove();
        };
    }, [onChange]);
    useEffect(() => {
        const data = loadSettings();
        // navigation.navigate('main');
        try {
            Geolocation.getCurrentPosition(
              async (pos) => {
                const crd = pos.coords;
                // Reverse geocoding using Google Maps Geocoding API
                const apiKey = 'AIzaSyB9_zPk9327zXx87L-zrS1wPvnx75PTlQg';
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${apiKey}`;
          
                await axios.get(url)
                  .then((response) => {
                    if (response.data.results.length > 0) {
                      dispatch(saveMyPositionVariable({ coords: crd, name: response.data.results[0].formatted_address }));
                      console.log(data);
                      if (data._j == null) {
                        console.log('hihi');
                        dispatch(saveLocationVariable([response.data.results[0].formatted_address, ...locationlist]));
                      }
                      navigation.navigate('main');
                    }
                  })
                  .catch((error) => {
                    console.error('Error getting location name:', error);
                  });
              },
              (error) => {
                console.error('Error getting location:', error);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          } catch (error) {
            console.error('Error calling Geolocation.getCurrentPosition():', error);
          }
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../Image/logo.png')}
                style={[styles.logo, { width: dimension.width * 0.6, height: dimension.height * 0.4 }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
    },
});

export default SplashScreen;