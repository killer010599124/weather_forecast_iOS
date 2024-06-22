import React, { useEffect, useState, useCallback } from 'react';
import { Alert, View, Image, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import './constants.js'
import { Directions } from 'react-native-gesture-handler';
import { saveStateVariable } from './Redux/actions/alertAction.js';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store from './Redux/store.js';// LogBox.ignoreAllLogs();
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const AlertScreen = ({ navigation }) => {

  const insets = useSafeAreaInsets();
  const [alerts, setAlerts] = useState([])
  const alertVal = useSelector((state) => state.myState.alertVariable);
  return (
    <View style={{...styles.container, paddingTop : insets.top}}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Weather Alerts</Text>
      </View>
      <ScrollView contentContainerStyle={styles.hourlyForecastContainer}>

        {alertVal.length != 0 ? alertVal.map((alert, index) => (
          <View key={index} style={styles.hourlyForecastItem}>
            <Text>{alert.event}</Text>
            <Text>{alert.onset.slice(0, 10)} ~ {alert.ends.slice(0, 10)}</Text>
            <Text>{alert.description}</Text>
            <Text></Text>
          </View>
        )) :
          (<Text>
            There are currentrly no weather alerts for this location.
          </Text>)
          }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  pageHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  temperatureUnitToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temperatureUnitText: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  inactive: {
    color: '#767577',
  },
  hourlyForecastItem: {
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    padding: 6,
    marginVertical: 6,
    borderRadius: 10
  },
  hourlyForecastContainer: {

  }
});



export default AlertScreen;