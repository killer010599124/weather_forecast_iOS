import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import locationData from "../assets/locations.json"
import { saveLocationVariable } from './Redux/actions/locationAction.js';
import { useDispatch, useSelector, Provider } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const LocationScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch()
  const locationlist = useSelector((state) => state.myState.locationListVariable);
  const currentPosition = useSelector((state) => state.myState.myPostionVariable)
  const [locations, setLocations] = useState(locationlist);


  //----------Get Current Position ------\\

  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  // Function to handle autocomplete suggestions
  const autocomplete = (text) => {
    setSearchText(text);
    // Make an API call to fetch autocomplete suggestions
    // Replace this with your actual autocomplete implementation
    const suggestionsList = locationData;
    const filteredSuggestions = suggestionsList.filter((suggestion) =>
      suggestion.toLowerCase().includes(text.toLowerCase())
    ).slice(0, 5);
    setSuggestions(filteredSuggestions);
  };

  // Function to add a location to the list
  const addLocationToList = (location) => {
    if (!locations.includes(location)) {
      // setLocations([location,...locations]);
      setSearchText(location);
      setSuggestions([]);
    }
  };

  // Function to remove a location from the list
  const removeLocationFromList = (location) => {
    setLocations(locations.filter((loc) => loc !== location));
  };


  const saveSettings = async (data) => {
    try {
      await AsyncStorage.setItem('savedLocations', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    dispatch(saveLocationVariable(locations))
    saveSettings(locations);
  }, [locations])

  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      <View style={styles.locationContainer}>
        <View style={styles.header}>
          <Text style={styles.location}>My Locations</Text>
          <View style={styles.inputContainer}>
            <Image source={require('../Image/search.png')} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Start typing to autocomplete..."
              onChangeText={(text) => autocomplete(text)}
              value={searchText}
            />
            <TouchableOpacity onPress={() => (setLocations([searchText, ...locations]))}>
              <Image source={require('../Image/add.png')} style={{ width: 30, height: 30 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={{ ...styles.location, fontSize: 24, marginLeft: 10 }}>Current Location</Text>
      {currentPosition != null ?
        <View style={styles.listContainer}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{currentPosition.name}</Text>
          <View >
            <Text style={{ fontWeight: '900', fontSize: 15 }}>Latitude : {Number(currentPosition.coords.latitude).toFixed(2)}</Text>
            <Text style={{ fontWeight: '900', fontSize: 15 }}>Longitude : {Number(currentPosition.coords.longitude).toFixed(2)}</Text>

          </View>
        </View> : ""}


      <Text style={{ ...styles.location, fontSize: 24, marginLeft: 10 }}>Saved Locations</Text>
      <View style={styles.listContainer}>
        <FlatList
          data={locations.filter(m => m !== currentPosition.name)}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item}</Text>
              <TouchableOpacity onPress={() => removeLocationFromList(item)}>
                <Image source={require('../Image/trash.png')} style={styles.searchIcon} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => addLocationToList(item)}>
                <Text style={styles.suggestion}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
    paddingTop: 16,
    color: 'black'
  },
  location: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black'
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    width: '100%',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    width: '100%'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    width: '90%',
    borderRadius: 20,
    paddingVertical: 2,
    color: 'black',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10
  },
  input: {
    flex: 1,
    padding: 3,
    color: 'black',
  },
  searchIcon: {
    marginRight: 10,
  },
  listContainer: {
    marginTop: 10,
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  listItem: {
    padding: 10,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionContainer: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 135,
    width: '90%',
    paddingHorizontal: 15,
  },
  suggestion: {
    padding: 10,
  },
  searchIcon: {
    width: 20,
    height: 20
  }
});




export default LocationScreen;