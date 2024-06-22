import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, DatePickerAndroid, TouchableOpacity, Button, Dimensions, Image, Modal, LogBox } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector, Provider } from 'react-redux';
LogBox.ignoreAllLogs();

const images = {
    "clear-day": require("../assets/images/clear-day.png"),
    "clear-night": require("../assets/images/clear-night.png"),
    "cloudy": require("../assets/images/cloudy.png"),
    "fog": require("../assets/images/fog.png"),
    "hail": require("../assets/images/hail.png"),
    "partly-cloudy-day": require("../assets/images/partly-cloudy-day.png"),
    "partly-cloudy-night": require("../assets/images/partly-cloudy-night.png"),
    "rain-snow-showers-day": require("../assets/images/rain-snow-showers-day.png"),
    "rain-snow-showers-night": require("../assets/images/rain-snow-showers-night.png"),
    "rain-snow": require("../assets/images/rain-snow.png"),
    "rain": require("../assets/images/rain.png"),
    "showers-day": require("../assets/images/showers-day.png"),
    "showers-night": require("../assets/images/showers-night.png"),
    "sleet": require("../assets/images/sleet.png"),
    "snow-showers-day": require("../assets/images/snow-showers-day.png"),
    "snow-showers-night": require("../assets/images/snow-showers-night.png"),
    "snow": require("../assets/images/snow.png"),
    "thunder-rain": require("../assets/images/thunder-rain.png"),
    "thunder-showers-day": require("../assets/images/thunder-showers-day.png"),
    "thunder-showers-night": require("../assets/images/thunder-showers-night.png"),
    "thunder": require("../assets/images/thunder.png"),
    "wind": require("../assets/images/wind.png"),

};

const DayScreen = ({ route }) => {
    const insets = useSafeAreaInsets();
    const unit = useSelector((state) => state.myState.unitVariable);

    const data = route.params?.data;
    const currentLocation = route.params?.location;

    const [expandedIndex, setExpandedIndex] = useState(-1);

    function formatTime(timeString) {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        let amPm = 'AM';
        let formattedHours = hours;
        if (hours === 0) {
          formattedHours = '12';
          amPm = 'AM';
        } else if (hours == 12) {
          formattedHours = hours;
          amPm = 'PM';
        } else if (hours > 12) {
          formattedHours = hours - 12;
          amPm = 'PM';
        }
        return `${formattedHours} ${amPm}`;
      }


    const changeDateFormat_7 = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dayIndex = date.getDay();
        const monthIndex = date.getMonth();
        const day = date.getDate();


        return `${days[dayIndex]} ${months[monthIndex]} ${day}`;
    }

    const handleFifteenDaysForecastItemPress = (index) => {
        setExpandedIndex(index === expandedIndex ? -1 : index);
    };

    const convertTemperature = (temp) => {
        if (unit) {
            return Math.round(temp)
        } else {
            const fahrenheitValue = (parseFloat(temp) * 9 / 5) + 32;
            return Math.round(fahrenheitValue)
        }
    };
    const convertWindUnit = (speed) => {
        if (unit) {
            return Math.round(speed * 0.44704).toString() + "m/s"
        } else {
            return Math.round(speed).toString() + "mph"
        }
    };

    const convertPrecipUnit = (precip) => {
        if (unit) {
          if(precip == null) return "0㎜"
          else return Math.round(precip * 25.4).toString() + "㎜"
        } else {
          if((precip == null)) return "0in"
          else return precip.toFixed(2).toString() + "in"
        }
      };

    return (
        <ScrollView style={{...styles.container, paddingTop : insets.top}}>
            <View style={styles.locationContainer}>
                <View style={styles.header}>
                    <Text style={styles.location}>{currentLocation}</Text>
                </View>
            </View>



            <View style={styles.currentWeatherCard}>
                <Text style={{ fontSize: 24, color: 'black' }}>{changeDateFormat_7(data.datetime)}</Text>
                {/* <Text> {data != undefined ? data.datetime : ""}</Text> */}
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={images[data != undefined ? data.icon : ""]}
                        alt="Weather"
                    />
                    <Text style={styles.temperature}>{data != undefined ? convertTemperature(data.temp) : ""}°</Text>
                    <View>
                        <View>
                            <Text>Feelslike</Text>
                            <Text style={styles.condition}>{data != undefined ? convertTemperature(data.feelslike) : ""}°</Text>
                        </View>
                        <View>
                            <Text>Humidity</Text>
                            <Text style={styles.condition}>{data != undefined ? Math.round(data.humidity) : ""}%</Text>
                        </View>
                    </View>
                    <View>
                        <View>
                            <Text>Precip</Text>
                            <Text style={styles.condition}>{data != undefined ? convertPrecipUnit(data.precip) : ""}</Text>
                        </View>
                        <View>
                            <Text>windspeed</Text>
                            <Text style={styles.condition}>{data != undefined ? convertWindUnit(data.windspeed) : ""}</Text>
                        </View>
                    </View>
                </View>
                <Text style={{ alignSelf: 'center', color: 'black' }}>{data != undefined ? data.description : ""}</Text>
            </View>

            <View style={styles.nextFifteenDaysCard}>
                <Text style={styles.sectionTitle}>Days Forecast</Text>
                {(data.hours) != undefined ? (data.hours).map((forecast, index) => (
                    <TouchableOpacity
                        key={index}
                        style={{ borderBottomColor: 'gray', borderBottomWidth: 1 }}
                        onPress={() => handleFifteenDaysForecastItemPress(index)}
                    >
                        <View style={styles.fifteenDaysForecastItem}>
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: 25, height: 25 }}
                                    source={images[forecast != undefined ? forecast.icon : ""]}
                                    alt="Weather"
                                />
                                <Text>{formatTime(forecast.datetime)}</Text>
                            </View>
                            <View style={{ justifyContent: 'space-evenly' }}>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: 'black', textAlign: 'center', fontSize: 16 }}>{forecast.conditions}</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ width: '33%' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14 }}>Temperature</Text>
                                        <Text style={{ color: 'black', textAlign: 'center', fontSize: 14 }}>{convertTemperature(forecast.temp)}°</Text>
                                    </View>
                                    <View style={{ width: '33%', }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14 }}>Humidity</Text>
                                        <Text style={{ color: 'black', textAlign: 'center', fontSize: 14 }}>{Math.round(forecast.humidity)}%</Text>
                                    </View>
                                    <View style={{ width: '33%' }}>
                                        <Text style={{ textAlign: 'center', fontSize: 14 }}>Windspeed</Text>
                                        <Text style={{ color: 'black', textAlign: 'center', fontSize: 14 }}>{Math.round(forecast.windspeed)}m/s</Text>
                                    </View>


                                </View>
                            </View>
                        </View>


                        {expandedIndex === index && (
                            <View style={{display : 'flex', flexDirection : 'row', justifyContent : 'space-between'}}>
                                <View style={{ display: 'flex', flexDirection: 'column',width : '33%',   }}>
                                    <View style={{ alignItems: 'center', }}>
                                        <Text>Feelslike</Text>
                                        <Text style={styles.condition}>{forecast != undefined ? convertTemperature(forecast.feelslike) : ""}°</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>Humidity</Text>
                                        <Text style={styles.condition}>{Math.round(forecast.humidity)}%</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>Dew Point</Text>
                                        <Text style={styles.condition}>{convertTemperature(forecast.dew)}°</Text>
                                    </View>
                                </View>

                                <View style={{ display: 'flex', flexDirection: 'column',width : '33%', }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>Visibility</Text>
                                        <Text style={styles.condition}>{Math.round(forecast.visibility)}km</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text> Cloudcover</Text>
                                        <Text style={styles.condition}>{Math.round(forecast.cloudcover)}%</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>Pressure</Text>
                                        <Text style={styles.condition}>{Math.round(forecast.pressure)}mmHg</Text>
                                    </View>
                                </View>

                                <View style={{ display: 'flex', flexDirection: 'column', width : '33%', }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>Temp</Text>
                                        <Text style={styles.condition}>{convertTemperature(forecast.temp)}°</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text> Precip</Text>
                                        <Text style={styles.condition}>{convertPrecipUnit(forecast.precip)}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>Windspeed</Text>
                                        <Text style={styles.condition}>{convertWindUnit(forecast.windspeed)}</Text>
                                    </View>
                                </View>

                            </View>
                        )}
                    </TouchableOpacity>
                )) : ""}
            </View>

        </ScrollView >
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEAEA',
        paddingTop: 16,
        color: 'black'
        // padding: 16,
    },
    currentWeatherCard: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        marginTop: 8,
        marginHorizontal: 10,
        color: 'black'
    },
    location: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    condition: {
        fontSize: 20,
    },
    nextTwoHoursCard: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 16,
    },
    hourlyForecastCard: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
    },
    hourlyForecastContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hourlyForecastItem: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    nextFifteenDaysCard: {
        padding: 16,
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    fifteenDaysForecastItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 8,
        padding: 8,
        // backgroundColor: '#f0f0f0',
        borderRadius: 8,
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    datePickerContainer: {
        padding: 16,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
        width: '80%',
        alignSelf: 'center'
    },
    locationChangeButton: {
        backgroundColor: 'white',
        position: 'absolute',
        top: 16,
        fontSize: 24,
        fontWeight: 'bold',
    },
    locationChangeButtonLeft: {
        left: 16,
    },
    locationChangeButtonRight: {
        right: 16,
    },
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: 'white',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 8,
        backgroundColor: 'white',
        width: '100%'
    },
    locationChangeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    locationChangeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    currentLocationIndicator: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%'
    },
    datePickerButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginTop: 8,
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        width: '80%',
        borderRadius: 8,
    },
    dateRange: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        width: '50%',
        borderRadius: 10,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginRight: 10
    },
    tabBarIconImage: {
        width: 24,
        height: 24
    }
});

export default DayScreen;