import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Button, Alert, FlatList, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from "react-native-element-dropdown";
import { Cache } from "react-native-cache";

function Settings()  {
  const cache = new Cache({
    namespace: "myapp",
    policy: {
      maxEntries: 100, // if unspecified, it can have unlimited entries
    },
      backend: AsyncStorage
  });
  const [Sortfav, setSortfav] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  
  const sort = [
    { label: 'Piority Level', value: 'Piority Level' },
    { label: 'DueDate', value: 'DueDate' },
  ];

  Sortfav_token = async () => AsyncStorage.getItem('Sortfav');

  const FetchSort = async () => {
    try {
      var Sorttoken = await this.Sortfav_token();
      setSortfav(Sorttoken)
      // console.log(Sorttoken)
    } 
    catch (error) {
      alert("Some error occured while fetching data. Check console logs for details.");
      console.log(error);
    }
  };

  const cacheSort = async (item) => {
    try {
      await AsyncStorage.setItem('Sortfav', item);
      setSortfav(item)
      console.log("Item with Sortfav " + item + " successfully cached.")
    } 
    catch (error) {
      alert("Some error occured while caching data. Check console logs for details.");
      console.log(error);
    }
  };

  const clearAllAlert = () => {
        Alert.alert('Clear Cache', 'Are you sure you want to clear ALL cache?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => clearAll()},
        ]);
      };
    
  const clearAll = async () => {
        await cache.clearAll();
        await AsyncStorage.clear()
        Alert.alert('Cleared', 'All cache have been cleared, please retart the app', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => console.log('ok Pressed')},
        ]);
      };

  useEffect(() => {
        FetchSort();
        console.log("Settings")
    }, []);

    return (
      <View style={styles.MainContainer}>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>General</Text>
        </View>
        
        <View style={styles.bodyContainer}>

          <Text style={styles.bodyText}>Sort Tasks by:</Text>
           <Text style={styles.settingText}>
            <Dropdown // Sortfav dropdown
              style={[styles.dropdown, isFocus]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={sort}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={"Piority Level"}
              searchPlaceholder="Search..."
              value={Sortfav}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                cacheSort(item.value)
                setIsFocus(false);
              }}
            />
          </Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Clear data</Text>
        </View>
        
        <View style={styles.smallerbodyContainer}>
          <Text style={styles.bodyText}>Clear all cache</Text>
          <View style={styles.button}>
            <Button
              title="Clear"
              onPress={() => clearAllAlert()}
            />
          </View>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  headerText: {
    fontSize: 30,
    color: '#C88141',
  },
  smallerbodyContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor:'#DADBDD',
    height: 100,
  },
  bodyContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor:'#DADBDD',
    height: 100,
  },
  bodyText: {
    fontSize: 25,
    color: 'black',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  settingText: {
    fontSize: 20,
    color: 'grey',
    marginHorizontal: 16,
  },
  dropdown: {
      height: 50,
      width: 150,
    },
  placeholderStyle: {
    fontSize: 20,
    color: 'grey',
  },
  selectedTextStyle: {
    fontSize: 20,
    color: 'grey',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    width: 100,
  },
});

export default Settings;