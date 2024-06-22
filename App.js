import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from './lib/Splash';
import { Image, Text, StyleSheet, View } from 'react-native';
import Forecast from './Image/forecast.png';
import Location from './Image/location.png';
import Map from './Image/map.png';
import Settings from './Image/setting.png';
import Bell from './Image/bell.png'
import Bell_Alert from './Image/bell_alert.gif'
import ForecastScreen from './lib/Forecast';
import LocationScreen from './lib/Location';
import MapScreen from './lib/Map';
import SettingsScreen from './lib/Setting';
import AlertScreen from './lib/Alert';
import HourlyScreen from './lib/Hourly';
import DayScreen from './lib/DayDetail';

import { useDispatch, useSelector, Provider } from 'react-redux';
import store from './lib/Redux/store';// LogBox.ignoreAllLogs();


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ForecastTabScreen() {
  const alertVal = useSelector((state) => state.myState.alertVariable);

 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          paddingVertical: 5,
          borderTopLeftRadius : 20,
          borderTopRightRadius : 20,
        },
        sx: {

        },
        tabBarIcon: ({ focused }) => {
          let iconSource;
          let iconColor;
          switch (route.name) {
            case 'Forecast':
              iconSource = Forecast;
              iconColor = focused ? 'lightgreen' : 'white';
              break;
            case 'Location':
              iconSource = Location;
              iconColor = focused ? 'lightgreen' : 'white';
              break;
            case 'Map':
              iconSource = Map;
              iconColor = focused ? 'lightgreen' : 'white';
              break;
            case 'Settings':
              iconSource = Settings;
              iconColor = focused ? 'lightgreen' : 'white';
              break;
            case 'Alert':
              iconSource = Bell;
              iconColor = alertVal.length != 0 ? 'red' : 'black';
              break;
            default:
              iconSource = Forecast;
              iconColor = focused ? 'lightgreen' : 'white';
          }

          if (route.name != 'Alert') {
            return (
              <View style={styles.tabBarIcon}>
                <Image source={iconSource} style={[styles.tabBarIconImage, { tintColor: iconColor }]} />
                <Text style={[styles.tabBarIconText, { color: iconColor}]}>{route.name}</Text>
              </View>
            );
          }
          else {
            return (
              <View style={{ ...styles.tabBarIcon, backgroundColor: 'white', marginBottom: 40, borderRadius: 40, width: 60, height: 60, borderColor: 'black', borderWidth: 1 }}>
                <Image source={iconSource} style={[styles.tabBarIconImage, { tintColor: iconColor, width: 40, height: 40 }]} />
              </View>
            );
          }
        },
      })}
    >
      <Tab.Screen name="Forecast" component={ForecastScreen} />
      <Tab.Screen name="Location" component={LocationScreen} />
      <Tab.Screen name="Alert" component={AlertScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function Main() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="main" component={ForecastTabScreen} options={{ headerShown: false }} />
        <Stack.Screen name='hourly' component={HourlyScreen} options={{ headerShown: false }} />
        <Stack.Screen name='daily' component={DayScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};
export default App;

const styles = StyleSheet.create({
  tabBarIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    // display : 'flex'
  },
  bellIcon: {

  },
  tabBarIconImage: {
    width: 24,
    height: 24,
  },
  tabBarIconText: {
    fontSize: 12,
    marginTop: 4,
    
  },
});