import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { useDispatch, useSelector, Provider } from 'react-redux';
import store from './Redux/store.js';// LogBox.ignoreAllLogs();
import { saveUnitVariable } from './Redux/actions/unitAction.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  //----------------Redux-------------\\
  const dispatch = useDispatch();
  const unit = useSelector((state) => state.myState.unitVariable);

  const [isCelsius, setIsCelsius] = useState(unit);

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const saveSettings = async (isCelsius) => {
    try {
      await AsyncStorage.setItem('savedUnit', JSON.stringify({data : isCelsius}));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    dispatch(saveUnitVariable(isCelsius))
    saveSettings(isCelsius)
  },[isCelsius])
  return (
    <View style={{...styles.container, paddingTop : insets.top}}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Settings</Text>
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Temperature Unit</Text>
        <View style={styles.temperatureUnitToggle}>
          <Text style={[styles.temperatureUnitText, !isCelsius && styles.inactive]}>
            Celsius
          </Text>
          <Switch
            value={!isCelsius}
            onValueChange={toggleTemperatureUnit}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isCelsius ? '#f4f3f4' : '#f4f3f4'}
          />
          <Text style={[styles.temperatureUnitText, isCelsius && styles.inactive]}>
            Fahrenheit
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});


export default SettingsScreen;