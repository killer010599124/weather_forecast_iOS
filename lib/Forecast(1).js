import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, DatePickerAndroid, TouchableOpacity, Button, Dimensions, Image, Modal, LogBox, Alert, ActivityIndicator } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import leftIcon from '../Image/left.png'
import rightIcon from '../Image/right.png'
import enterIcon from '../Image/enter.png'
import axios, { isCancel } from 'axios';
import './constants.js'
import { saveAlertVariable } from './Redux/actions/alertAction.js';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { saveCurrentLocationVariable } from './Redux/actions/currentLocation.js';

import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
const ForecastScreen = ({ navigation }) => {



  const insets = useSafeAreaInsets();
  //----------------Redux-------------\\
  const dispatch = useDispatch();
  const locationlist = useSelector((state) => state.myState.locationListVariable);
  // const global_currentLocation = useSelector((state) => state.myState.currentLocationVariable);
  const unit = useSelector((state) => state.myState.unitVariable);

  const [dimension, setDimension] = useState(Dimensions.get('window'));
  const { width, height } = Dimensions.get('window');
  const onChange = useCallback(() => {
    setDimension(Dimensions.get('window'));
  }, []);

  const [loading, setLoading] = useState(false);
  //------------Location -------\\
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [currentTimeZone, setCurrentTimeZone] = useState()

  const [currentLocation, setCurrentLocation] = useState(locationlist[currentLocationIndex])
  const handleLocationChange = (direction) => {
    if (direction === 'left') {
      setCurrentLocationIndex((prevIndex) => (prevIndex === 0 ? locationlist.length - 1 : prevIndex - 1));
    } else {
      setCurrentLocationIndex((prevIndex) => (prevIndex === locationlist.length - 1 ? 0 : prevIndex + 1));
    }
  };

  useEffect(() => {
    dispatch(saveCurrentLocationVariable(currentLocation))
  }, [currentLocation])


  const [startDate, setStartDate] = useState(dayjs());


  const [endDate, setEndDate] = useState(dayjs().add(10, 'day'));

  const [showStartDatePicker, setshowStartDatePicker] = useState(false);
  const [showEndDatePicker, setshowEndDatePicker] = useState(false);

  const toggleStartDatePicker = () => {
    setshowStartDatePicker(!showStartDatePicker);
  };
  const toggleEndDatePicker = () => {
    setshowEndDatePicker(!showEndDatePicker);
  };


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
    let date = dateString.split("T")[0];

    // Split the date string into year, month, and day
    let [year, month, day] = date.split("-");

    // Get the day of the week
    let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let dayOfWeek = daysOfWeek[new Date(year, month - 1, day).getDay()];

    // Format the output
    let formattedDateTime = `${dayOfWeek} ${new Date(year, month - 1, day).toLocaleString('en-US', { month: 'short' })} ${day}`;
    return formattedDateTime
    // return `${days[dayIndex]} ${months[monthIndex]} ${day}`;
  }

  function format24T12(time24) {
    let [hours, minutes] = time24.split(':');
    let hours12 = parseInt(hours) % 12 || 12;
    return `${hours12}:${minutes}`;
  }

  async function call_Weather_API(location) {
    setLoading(true);
    // Retrieve user's local timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${startDate.toISOString().slice(0, 10)}/${endDate.toISOString().slice(0, 10)}?key=3C8TRCWYPKSPU83H6U8CJ5CUR&unitGroup=metric&elements=%2Baqius,%2Breflectivity,%2Baqielement,%2Buvindex2,%2Bprecipremote,%2Breflectivity2&include=days,hours,minutes,current,alerts,obs,fcst,stats&options=subhourlyfcst`
    console.log(url)
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      // url : "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/36.7591,-95.3833/2024-05-24/2024-05-31?key=3C8TRCWYPKSPU83H6U8CJ5CUR&unitGroup=metric&elements=%2Breflectivity&include=minutes,current&options=subhourlyfcst&iconSet=icons2",
      headers: {}
    };

    try {
      const response = await axios.request(config);

      const data = JSON.stringify(response.data);


      setLoading(false);
      return data;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return null;
    }
  }

  const [currentCondition, setCurrentCondition] = useState()
  const [todayWeather, setTodayWeather] = useState()
  const [daysWeather, setDaysWeather] = useState()

  //-----------Getting Reflectvitiy -----------\\

  const [reflectivityData, setReflectivityData] = useState()
  const [noReflet, setNoReflet] = useState(false)

  function getReflectivity(data, today, current) {
    const date = today.datetime + " " + current.datetime
    const now = new Date(date);
    // Extract the reflectivity values and their date/time within the 120 minute range
    const newReflectivityData = [];
    setNoReflet(false)

    // const timeStep = [];
    for (let i = 0; i < data.days.length; i++) {
      const day = data.days[i];
      if (day.hours != undefined) {
        for (let j = 0; j < day.hours.length; j++) {
          const hour = day.hours[j];
          for (let k = 0; k < hour.minutes.length; k++) {
            const minute = hour.minutes[k];
            const dateTimeStr = `${day.datetime} ${minute.datetime}`;
            const dateTimeObj = new Date(dateTimeStr);
            if ((dateTimeObj.getTime() - now.getTime()) <= 2 * 7200000 && (dateTimeObj.getTime() - now.getTime()) >= 0) { // 120 minutes
              // if ((dateTimeObj.getTime() - now.getTime()) >=7200000 && (dateTimeObj.getTime() - now.getTime()) >= -3600000 ) { // 120 minutes
              let reflectivity;
              if (minute.reflectivity == null) reflectivity = 0
              else {
                reflectivity = minute.reflectivity;
                setNoReflet(true)
              }

              // newReflectivityData.push(reflectivity);
              // timeStep.push(format24T12(minute.datetime.slice(0, 5)))
              newReflectivityData.push({ refValue: reflectivity, time: format24T12(minute.datetime.slice(0, 5)) })

            }
          }
        }
      }
    }

    const tempData = newReflectivityData.map((item, index) => {
      const dataPoint = {
        value: item.refValue,
        labelComponent: () => customLabel(item.time),
      };


      return dataPoint;
    });
    setReflectivityData(tempData)
  };



  async function getTimezoneFromLocation(locationName) {
    try {
      // Use the Google Maps Geocoding API to get the geographic coordinates
      const geocodeResponse = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationName)}&key=AIzaSyB9_zPk9327zXx87L-zrS1wPvnx75PTlQg`);

      // Check if the Geocoding API returned any results
      if (geocodeResponse.data.results.length === 0) {
        console.error(`No results found for location: ${locationName}`);
        return null;
      }

      const { lat, lng } = geocodeResponse.data.results[0].geometry.location;
      // Use the Google Maps Timezone API to get the timezone
      // const timezoneResponse = await axios.get("https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810%2C-119.6822510&timestamp=1331161200&key=AIzaSyB9_zPk9327zXx87L-zrS1wPvnx75PTlQg")
      const timezoneResponse = await axios.get(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=1331161200&key=AIzaSyB9_zPk9327zXx87L-zrS1wPvnx75PTlQg`);
      if (timezoneResponse.data.status !== 'OK') {
        console.error(`Error getting timezone for location: ${locationName}`);
        return null;
      }
      return timezoneResponse.data.timeZoneId;
    } catch (error) {
      console.error("Error getting timezone:", error);
      return null;
    }
  }

  async function pickTodayWeather(days) {
    const userTimezone = await getTimezoneFromLocation(currentLocation)
    const selectedDateInLocalTimezone = new Date().toLocaleString('en-US', { timeZone: userTimezone });

    console.log(selectedDateInLocalTimezone)

    function convertDateFormat(dateString) {
      let [month, day, year] = dateString.split('/');

      month = month.padStart(2, '0');
      day = day.padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const todayDateString = convertDateFormat(selectedDateInLocalTimezone.split(',')[0])
    const todayIndex = days.findIndex(day => {
      return (day.datetime === todayDateString)
    })

    return days[todayIndex]
  }
  async function pickDaysWeather(days) {
    const userTimezone = await getTimezoneFromLocation(currentLocation)
    const selectedDateInLocalTimezone = new Date().toLocaleString('en-US', { timeZone: userTimezone });


    function convertDateFormat(dateString) {
      let [month, day, year] = dateString.split('/');

      month = month.padStart(2, '0');
      day = day.padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    const todayDateString = convertDateFormat(selectedDateInLocalTimezone.split(',')[0])
    const todayIndex = days.findIndex(day => {
      return (day.datetime === todayDateString)
    })

    const remainingDays = days.filter((_, index) => index !== todayIndex);
    return remainingDays
  }

  const convertTemperature = (temp) => {
    if (unit) {
      return Math.round(temp)
    } else {
      const fahrenheitValue = (parseFloat(temp) * 9 / 5) + 32;
      return Math.round(fahrenheitValue)
    }
  };

  const showAlert = (content) => {
    Alert.alert(
      'Alert Title',
      content,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
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
      if (precip == null) return "0㎜"
      else return Math.round(precip * 25.4).toString() + "㎜"
    } else {
      if ((precip == null)) return "0in"
      else return precip.toFixed(2).toString() + "in"
    }
  };

  useEffect(() => {


    async function fetchWeather() {

      if (startDate !== "" && endDate !== "") {
        const weatherData = JSON.parse(await call_Weather_API(currentLocation));
        setCurrentCondition(weatherData.currentConditions)
        const todayWeather = await pickTodayWeather(weatherData.days)
        setTodayWeather(todayWeather)
        setDaysWeather(await pickDaysWeather(weatherData.days))
        if (weatherData.currentConditions != undefined) {
          getReflectivity(weatherData, todayWeather, weatherData.currentConditions)
        } else {
          setReflectivityData(undefined)
        }

        if (weatherData.alerts != undefined) {
          // setAlertStateVariable(weatherData.alerts)
          dispatch(saveAlertVariable(weatherData.alerts))
        }
      }
    }
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate)
    if (endDate <= startDate) {
      showAlert("Sorry, you have selected an invalid date. The end date must be later than the start date.")
    } else if ((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24) > 30) {


      showAlert("Sorry, you have selected an invalid date. There must be less than 30 days between the start date and the end date.")
    } else {

      fetchWeather();
    }

  }, [startDate, endDate, currentLocation]);

  const getFilteredHours = (hours, currentHour) => {
    return hours.filter((hour) => {
      const [hourStr, minuteStr, secondStr] = hour.datetime.split(':');
      const hourInt = parseInt(hourStr, 10);
      return hourInt > currentHour.split(':')[0];
    });
  };

  useEffect(() => {
    setCurrentLocation(locationlist[currentLocationIndex])
  }, [currentLocationIndex]);

  useEffect(() => {
    setCurrentLocation(locationlist[currentLocationIndex])
  }, [locationlist]);


  const customLabel = val => {
    return (
      <View style={{ width: 70, marginLeft: 10 }}>
        <Text style={{ color: 'black', fontWeight: 'bold', }}>{val}</Text>
      </View>
    );
  };

  return (

    <ScrollView style={{...styles.container, paddingTop : insets.top}}>
      <View style={styles.locationContainer}>
        <TouchableOpacity onPress={() => handleLocationChange('left')} style={styles.locationChangeButton}>
          <Image source={leftIcon} style={[styles.tabBarIconImage]} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.location}>{currentLocation}</Text>
          <View style={styles.currentLocationIndicator}>
            {locationlist.map((_val, index) => (
              <Text
                key={index}
                style={index === currentLocationIndex ? { fontWeight: 'bold', color: 'black', fontSize: 16, textAlign: 'center', marginHorizontal: 5 } :
                  { fontWeight: 'bold', color: 'gray', fontSize: 16, textAlign: 'center', marginHorizontal: 5 }}>
                ⬤</Text>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={() => handleLocationChange('right')} style={styles.locationChangeButton}>
          <Image source={rightIcon} style={[styles.tabBarIconImage]} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={{ ...styles.loadingContainer, height: height, width: width }}>
          <ActivityIndicator size={Math.min(width, height) * 0.2} color="#000000" />

        </View>
      )}

      <View style={styles.dateRange}>
        <TouchableOpacity onPress={toggleStartDatePicker}>
          <Text style={{ color: 'black', fontSize: width * 0.035 }}>{startDate.toISOString().slice(0, 10)}</Text>
        </TouchableOpacity>
        <Modal visible={showStartDatePicker} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                mode="single"
                date={startDate}
                onChange={(date) => {

                  let currentDate = new Date(date.date);
                  let nextDay = new Date(currentDate);
                  nextDay.setDate(currentDate.getDate() + 1);

                  setStartDate(currentDate);
                  setshowStartDatePicker(false)
                }}
              />
              <TouchableOpacity onPress={toggleStartDatePicker}>
                <Text style={{ alignSelf: 'flex-end' }}>Ok</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>
        <Text>~~</Text>
        <TouchableOpacity onPress={toggleEndDatePicker}>
          <Text style={{ color: 'black', fontSize: width * 0.035 }}>{endDate.toISOString().slice(0, 10)}</Text>
        </TouchableOpacity>
        <Modal visible={showEndDatePicker} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                mode="single"
                date={endDate}
                onChange={(date) => {
                  let currentDate = new Date(date.date);
                  let nextDay = new Date(currentDate);
                  nextDay.setDate(currentDate.getDate() + 1);
                  setEndDate(currentDate);
                  setshowEndDatePicker(false)
                }}
              />
              <TouchableOpacity onPress={toggleEndDatePicker}>
                <Text style={{ alignSelf: 'flex-end' }}>Ok</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {todayWeather != undefined && currentCondition != undefined ?
        <View style={styles.currentWeatherCard}>
          <Text style={{ fontSize: 24, color: 'black' }}>Current</Text>
          <Text style={{ fontSize: width * 0.035 }}>Today : {todayWeather != undefined ? changeDateFormat_7(todayWeather.datetime) : ""} : {currentCondition != undefined ? currentCondition.datetime : ""}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
            <Image
              style={{ width: 50, height: 50 }}
              source={images[currentCondition != undefined ? currentCondition.icon : ""]}
              alt="Weather"
            />
            <Text style={styles.temperature}>{currentCondition != undefined ? convertTemperature(currentCondition.temp) : ""}°</Text>
            <View>
              <View>
                <Text style={{ fontSize: width * 0.035 }}>Feelslike</Text>
                <Text style={styles.condition}>{currentCondition != undefined ? convertTemperature(currentCondition.feelslike) : ""}°</Text>
              </View>
              <View>
                <Text>
                  Humidity
                </Text>
                <Text style={styles.condition}>{currentCondition != undefined ? Math.round(currentCondition.humidity) : ""}%</Text>
              </View>
            </View>

            <View>
              <View>
                <Text>
                  Precip
                </Text>
                <Text style={styles.condition}>{currentCondition != undefined ? convertPrecipUnit(currentCondition.precip) : ""}</Text>
              </View>
              <View>
                <Text>
                  windspeed
                </Text>
                <Text style={styles.condition}>{currentCondition != undefined ? convertWindUnit(currentCondition.windspeed) : ""}</Text>
              </View>
            </View>

          </View>
          <Text style={{ alignSelf: 'center', color: 'black', fontSize: width * 0.035 }}>{todayWeather != undefined ? todayWeather.description : ""}</Text>
        </View> : ""}

      {reflectivityData != undefined ?
        <View style={styles.nextTwoHoursCard}>
          <Text style={styles.sectionTitle}>Rain Nearby</Text>
          {reflectivityData ?
            <View style={{
              marginTop: -10,
              paddingVertical: 30,
            }}>
              {noReflet ?
                <LineChart
                  thickness={5}
                  color="transparent"
                  rotateLabel
                  maxValue={80}
                  noOfSections={8}
                  areaChart
                  yAxisTextStyle={{ color: 'black' }}
                  data={reflectivityData}
                  // curved
                  areaGradientId="ag" // same as the id passed in <LinearGradient> below
                  areaGradientComponent={() => {

                    const maxRefValue = Math.max(...reflectivityData.map(data => data.value));
                    console.log(maxRefValue)
                    const ReferenceColors = [
                      { value: 0, color: 'rgb(64, 97, 159)' },
                      // { value: 10, color: 'white' },
                      { value: 10, color: 'rgb(62, 209, 136)' },
                      { value: 20, color: 'rgb(37, 151, 0)' },
                      { value: 30, color: 'rgb(238, 207, 0)' },
                      { value: 40, color: 'rgb(254, 134, 0)' },
                      { value: 50, color: 'rgb(247, 0, 0)' },
                      { value: 60, color: 'rgb(255, 201, 255)' },
                      { value: 70, color: 'rgb(255, 2, 230)' },
                      { value: 80, color: 'rgb(112, 0, 224)' },
                    ];

                    const start = 0.0;
                    const end = 1.0;
                    const numElements = Math.floor(maxRefValue / 10) + 1;
                    const offsets = Array.from({ length: numElements }, (_, i) => start + (i * (end - start) / (numElements - 1)));

                    return (
                      <LinearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                        {offsets.map((value, index) => (
                          <Stop key={index} offset={value} stopColor={ReferenceColors[offsets.length - index].color} />
                        ))}
                      </LinearGradient>
                    );
                  }}
                  startOpacity={0.4}
                  endOpacity={0.4}
                  spacing={(width - 50) / 20}
                  backgroundColor="white"
                  rulesColor="gray"
                  rulesType="solid"
                  initialSpacing={10}
                  yAxisColor="black"
                  // xAxisColor="#259700"
                  xAxisColor="lightgray"
                  yAxisLabelSuffix={unit ? "㎜" : 'in'}
                  yAxisLabelWidth={50}
                  xAxisLineWidth={10}
                  // xAxisThickness={0}
                  style={{ width: '100%', }}
                /> : <Text>No rain for 240 minutes.</Text>}
            </View> : ""}
        </View> : ""}

      {todayWeather != undefined && currentCondition != undefined ?
        <View style={styles.hourlyForecastCard} >
          <TouchableOpacity
            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              navigation.navigate("hourly", { currentData: currentCondition, hourlyData: todayWeather.hours, location: currentLocation, todayData: todayWeather });
            }}
          >
            <Text style={styles.sectionTitle}>
              Today's Hourly Forecast
            </Text>
            <Image source={enterIcon} style={[styles.tabBarIconImage]} />
          </TouchableOpacity>
          <ScrollView horizontal contentContainerStyle={styles.hourlyForecastContainer}>
            {todayWeather != undefined && currentCondition != undefined ? (getFilteredHours(todayWeather.hours, currentCondition.datetime)).map((forecast, index) => (
              <View key={index} style={styles.hourlyForecastItem}>
                <Text>{formatTime(forecast.datetime)}</Text>

                <Image // Adjust the desired width and height values
                  style={{ width: 25, height: 25 }}
                  source={images[forecast != undefined ? forecast.icon : ""]}
                  alt="Weather"
                />
                <Text>{convertTemperature(forecast.temp)}°</Text>
              </View>
            )) : ""}
          </ScrollView>
        </View> :
        ""}

      {daysWeather != undefined ?
        <View style={styles.nextFifteenDaysCard}>
          <Text style={styles.sectionTitle}>Days Forecast</Text>
          {daysWeather != undefined ? daysWeather.map((forecast, index) => (
            <TouchableOpacity
              key={index}
              style={styles.fifteenDaysForecastItem}
              onPress={() => {
                navigation.navigate("daily", { data: forecast, location: currentLocation });
              }}
            >
              <View style={{ alignItems: 'center', display: 'flex' }}>
                <Image // Adjust the desired width and height values
                  style={{ width: width * 0.1, height: width * 0.1 }}
                  // source={`../assets/images/${currentCondition != undefined ? currentCondition.icon : ""}.svg`}
                  source={images[forecast != undefined ? forecast.icon : ""]}
                  alt="Weather"
                />
                <Text style={{ textAlign: 'center' }}>{changeDateFormat_7(forecast.datetime)}</Text>
              </View>
              <View style={{ width: '70%', justifyContent: 'space-between' }}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={{ color: 'black', textAlign: 'center', fontSize: width * 0.035 }}>{forecast.description}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '5px' }}>
                  <Text style={{ color: 'black', textAlign: 'center', fontSize: width * 0.035 }}>{convertTemperature(forecast.temp)}°</Text>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>

                    <Text style={{ color: 'red', textAlign: 'center', fontSize: width * 0.035 }}>{convertTemperature(forecast.tempmax)}°</Text>
                    <Text>/</Text>
                    <Text style={{ color: 'blue', textAlign: 'center', fontSize: width * 0.035 }}>{convertTemperature(forecast.tempmin)}°</Text>
                  </View>
                  <Text style={{ color: 'black', textAlign: 'center', fontSize: width * 0.035 }}>{Math.round(forecast.humidity)}%</Text>
                  <Text style={{ color: 'black', textAlign: 'center', fontSize: width * 0.035 }}>{convertWindUnit(forecast.windspeed)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )) : ""}
        </View> : ""}



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
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 10,
    color: 'black'
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
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
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 10,
    marginTop: 8
  },
  hourlyForecastCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 8
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
    marginBottom: 8,
    marginTop: 8
  },
  fifteenDaysForecastItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
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
    width: '70%'
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginRight: 10
  },
  tabBarIconImage: {
    width: 24,
    height: 24
  },
  loadingContainer: {
    position: 'absolute',
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});



export default ForecastScreen;