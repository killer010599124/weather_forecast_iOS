import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Alert, View, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

import MapView, { PROVIDER_GOOGLE, UrlTile, Marker, Camera } from 'react-native-maps';
import leftIcon from '../Image/left.png'
import rightIcon from '../Image/right.png'
import playIcon from '../Image/play.png'
import pauseIcon from '../Image/pause.png'
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const MapScreen = ({ navigation }) => {

    const insets = useSafeAreaInsets();
    const mapView = React.useRef(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const currentLocation = useSelector((state) => state.myState.currentLocationVariable);

    useEffect(() => {
        const apiKey = 'AIzaSyB9_zPk9327zXx87L-zrS1wPvnx75PTlQg';
        // const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${crd.latitude},${crd.longitude}&key=${apiKey}`;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${currentLocation}&key=${apiKey}`
        axios.get(url)
            .then(response => {
                const latitude = response.data.results[0].geometry.location.lat;
                const longitude = response.data.results[0].geometry.location.lng;
                setCurrentPosition({
                    latitude: response.data.results[0].geometry.location.lat,
                    longitude: response.data.results[0].geometry.location.lng,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                })
                mapView.current.animateToRegion({
                    latitude: response.data.results[0].geometry.location.lat,
                    longitude: response.data.results[0].geometry.location.lng,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }, 100);
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }, [currentLocation]);

    //-------------------Handle Radar --------------------//
    const [radarTime, setRadarTime] = useState(new Date())
    const [isAuto, setIsAuto] = useState(false)
    let radarInterval;

    function convertTimestamp(isoTimestamp) {
        const date = new Date(isoTimestamp);

        const year = date.getFullYear();
        const monthName = date.toLocaleString('default', { month: 'short' });
        const day = date.getDate();
        let hours = date.getHours() % 12;
        let minutes = date.getMinutes();

        // Truncate to the nearest 10-minute interval
        minutes = Math.floor(minutes / 10) * 10;

        // If less than half of the interval has passed, subtract another interval
        if (date.getMinutes() - minutes < 5) {
            minutes -= 10;
            if (minutes < 0) {
                minutes = 50;
                hours--;
            }
        }

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${year} ${monthName} ${day} ${formattedHours}${formattedMinutes}`;
    }

    function convertRadarTimestamp(isoTimestamp) {

        let dateTime = new Date(isoTimestamp);

        // Extract the individual components
        let year = dateTime.getUTCFullYear().toString();
        let month = (dateTime.getUTCMonth() + 1).toString().padStart(2, '0');
        let day = dateTime.getUTCDate().toString().padStart(2, '0');
        let hours = dateTime.getUTCHours().toString().padStart(2, '0');
        let minutes = dateTime.getUTCMinutes().toString().padStart(2, '0');

        // Combine the components into the desired format
        let formattedDateTimee = year + month + day + hours + minutes;

        console.log(formattedDateTimee);

        return formattedDateTimee;
    }

    const backRadarFrame = () => {
        const updateTime = new Date(radarTime.getTime() - 10 * 60 * 1000);
        if (updateTime.getTime() <= new Date().getTime() - 60 * 60 * 1000) {
            // If the updated time is less than or equal to 60 minutes before the current time, stop moving backward
            return;
        }
        setRadarTime(updateTime);
    };

    const forwardRadarFrame = () => {

        const updateTime = new Date(radarTime.getTime() + 10 * 60 * 1000);
        if (updateTime.getTime() >= new Date().getTime() + 120 * 60 * 1000) {
            // If the updated time is greater than or equal to 120 minutes after the current time, set the time to 60 minutes after the current time
            const newTime = new Date(new Date().getTime() - 60 * 60 * 1000);
            setRadarTime(newTime);
        } else {
            setRadarTime(updateTime);
        }
    };

    useEffect(() => {
        if (isAuto)
            radarInterval = setInterval(() => {
                forwardRadarFrame();
            }, 300); // Call forwardRadarFrame() every 10 seconds

        return () => clearInterval(radarInterval);
    }, [forwardRadarFrame]);

    const [mapReady, setMapReady] = useState(false);

    const handleMapReady = () => {
        setMapReady(true);
        setCurrentPosition({
            ...currentPosition,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        });
    };

    const colorBarData = [
        { value: -30, color: 'rgb(119, 86, 167)' },
        { value: -20, color: 'rgb(143, 139, 147)' },
        { value: -10, color: 'rgb(208, 211, 178)' },
        { value: 0, color: 'rgb(64, 97, 159)' },
        { value: 10, color: 'rgb(62, 209, 136)' },
        { value: 20, color: 'rgb(37, 151, 0)' },
        { value: 30, color: 'rgb(238, 207, 0)' },
        { value: 40, color: 'rgb(254, 134, 0)' },
        { value: 50, color: 'rgb(247, 0, 0)' },
        { value: 60, color: 'rgb(255, 201, 255)' },
        { value: 70, color: 'rgb(255, 2, 230)' },
        { value: 80, color: 'rgb(112, 0, 224)' }
    ];
    return (
        <View style={{ ...styles.page }}>
            {currentPosition ?
                <MapView
                    // provider={PROVIDER_GOOGLE}
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={currentPosition}
                    onLayout={handleMapReady}
                    zoomEnabled={true}
                    ref={mapView}
                >
                    <UrlTile
                        urlTemplate={`https://weather1.visualcrossing.com/VisualCrossingWebServices/rest/services/retrievetile/reflectivity/{z}/{x}/{y}/${convertRadarTimestamp(radarTime.toISOString())}?key=ZMM2U9XUSJ6UV37L4L49NQACY&model=weatherRadarSubhourly_location&altitude=0&refresh=true&nocache=1715977236564`}
                        zIndex={0}
                    />
                    <Marker
                        coordinate={{
                            latitude: currentPosition.latitude,
                            longitude: currentPosition.longitude,
                        }}
                        title="Your Location"
                    />

                </MapView> : ""}


            <View style={styles.radarContainer}>
                <TouchableOpacity onPress={backRadarFrame} >
                    <Image source={leftIcon} style={[styles.tabBarIconImage]} />
                </TouchableOpacity>
                <View >
                    <Text style={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>{convertTimestamp(radarTime.toISOString()).slice(12, 14)} : {convertTimestamp(radarTime.toISOString()).slice(14, 16)} </Text>
                    <Text style={{ color: 'black', fontWeight: 'bold' }}>{convertTimestamp(radarTime.toISOString()).slice(0, 12)}</Text>
                </View>

                <TouchableOpacity onPress={forwardRadarFrame} >
                    <Image source={rightIcon} style={[styles.tabBarIconImage]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setIsAuto(!isAuto) }} style={styles.playButton}>
                    <Image source={isAuto ? pauseIcon : playIcon} style={[styles.tabBarIconImage]} />
                </TouchableOpacity>
            </View>

            <View style={{...styles.locationBarContainer, paddingTop : insets.top}}>
                {currentLocation ?
                    <Text style={{ fontSize: 24, color: 'black', textAlign: 'center' }}>
                        {currentLocation}
                    </Text> : ""}
            </View>

            <View style={styles.colorBarContainer}>
                {colorBarData.map((item, index) => (
                    <Text
                        key={index}

                        style={{ ...styles.colorItem, backgroundColor: item.color }}
                    >
                        {item.value}
                    </Text>
                ))}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    camera: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    playButton: {
        position: 'absolute',
        right: 0,
        marginRight: 20,
        alignSelf: 'center'
    },
    container: {
        height: 300,
        width: 300,
        backgroundColor: "tomato"
    },
    tabBarIconImage: {
        width: 30,
        height: 30
    },
    map: {
        flex: 1
    },
    radarContainer: {
        position: 'absolute',
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        opacity: 0.8,
        display: 'flex',
        flexDirection: 'row',
        color: 'black',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        bottom: 0,
        marginBottom: 25
    },
    colorBarContainer: {
        position: 'absolute',
        display: 'flex',
        textAlign: 'center',
        bottom: 100,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    locationBarContainer: {
        position: 'absolute',
        display: 'flex',
        textAlign: 'center',
        top: 20,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    colorItem: {
        width: 25,
        textAlign: 'center'
    }
});

export default MapScreen;