import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, Text, Alert, FlatList, TouchableOpacity, } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from "react-native-cache";
import SearchableDropdown from 'react-native-searchable-dropdown';

function Search() {
  const navigation = useNavigation();
  const route = useRoute();
  const cache = new Cache({
    namespace: "myapp",
    policy: {
      maxEntries: 100, // if unspecified, it can have unlimited entries
    },
      backend: AsyncStorage
  });
  var [task_data, settask] = useState([]);
  var [selectedItems, setSelectedItems] = useState({});
  if (Object.keys(selectedItems).length > 0) {
      var SelectedFilter = task_data.filter(x => x.name.toLowerCase().includes(selectedItems.name.toLowerCase()));
    }
  var datalist = [];

  const fetchData = async() => {
    try {
      const entries = await cache.getAll();
      //console.dir(entries);
      var keys = Object.keys(entries);
      
      var count = 0;
      for(k in keys) {
        var key = keys[count]
        var Value = entries[keys[count]]
        var name = Value.value.name
        var priority = Value.value.priority
        var description = Value.value.description
        var duedate = Value.value.duedate
        var progress = Value.value.progress
        count++
        var updatedValue = {"key": key, "name": name, "priority": priority, "description": description, "duedate": duedate, "progress": progress};
        //console.log(updatedValue);
        datalist.push(updatedValue);
      }
      settask(datalist)
      //console.log(datalist);
      datalist=[];
    }
    catch(error){
      console.log(error.cause);
    }
  }

  const filterSearch = task_data.map(function(item) {
    return {
      name: item.name
    };
  });
  //console.log(filterSearch);

  const Delete = async(key) => {
      await cache.remove(key);
        
      settask(task_data.filter(item => item.key !== key));
      console.log("Deleted")
    };  

  const DeleteAlert = (item) => {
        Alert.alert('Delete', 'Are you sure you want to delete ' + item.key + '?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => Delete(item.key)},
        ]);
      };

  const Editnav = (item) => {
    navigation.navigate('Edit', {
        key: item.key,
        name: item.name,
        priority: item.priority,
        description: item.description,
        duedate: item.duedate,
        progress: item.progress,
      })
  };

  const EditAlert = (item) => {
        Alert.alert('Edit', 'Do you want to edit ' + item.name + '?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => Editnav(item)},
        ]);
      };

  useEffect(() => {
        fetchData();
        console.log("Search")
    }, []);
 
  return (
    <SafeAreaView style={styles.MainContainer}>
      {/* <View style={styles.headerContainer}> */}
        <Text style={styles.tempText}>Search your task</Text>
      {/* </View> */}
      <SearchableDropdown
        onTextChange={(text) => setSelectedItems({name: text})}
        // On text change listner on the searchable input
        selectedItems={selectedItems}
        // onItemSelect={(name) => setSelectedItems(name)}
        onItemSelect={(name) => setSelectedItems(name)}
        // onItemSelect called after the selection from the dropdown
        containerStyle={{ padding: 10 }}
        // suggestion container style
        textInputStyle={styles.dropdowninput}
        itemStyle={styles.dropdownitem}
        itemTextStyle={styles.dropdownitemtext}
        itemsContainerStyle={{
          // items container style you can pass maxHeight
          // to restrict the items dropdown hieght
          maxHeight: 250,
        }}
        items={filterSearch}
        // mapping of item array
        defaultIndex={"Search your Task"}
        // default selected item index
        placeholder="Search your Task"
        // place holder for the search input
        placeholderTextColor={'black'}
        resetValue={false}
        // reset textInput Value with true and false state
      />
      <FlatList
              data={SelectedFilter}
              extraData={SelectedFilter}
              renderItem={({item}) => 
                <TouchableOpacity style={styles.item}>
                  <Text style={styles.TaskName}>{item.name} ({item.progress})</Text>
                  <Text style={styles.TaskPiority}>Priority Level: {item.priority == '1'? "Low" : 
                                                                    item.priority == '2'? "Medium" : "High"}</Text>
                  <Text style={styles.TaskDescription}>{item.description} </Text>
                  <Text style={styles.TaskDueDate}>Due date: {item.duedate} </Text>
                  <Text style={styles.staricon}><Feather name="trash" size={24} color="black" onPress={() => DeleteAlert(item)}/>
                                                {'     '}
                                                <AntDesign name="edit" size={24} color="black" onPress={() => EditAlert(item)}/></Text>
                </TouchableOpacity>
              }
              keyExtractor={item => item.key}
              />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  tempText: {
    margin: 12,
    fontSize: 35,
    color: 'black',
  },
  item: {
    backgroundColor: '#f9c2ff',
    flex: 2,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  dropdowninput: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FAF9F8",
    borderColor: "#bbb",
    borderWidth: 1,
  },
  dropdownitem: {
    padding: 10,
    marginTop: 2,
    backgroundColor: "#FAF9F8",
    borderColor: "#bbb",
    borderWidth: 1,
  },
  dropdownitemtext: {
    color: "#222",
  },
  TaskName: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'black',
    width: '50%'
  },
  TaskPiority: {
    position: 'absolute', 
    left: '60%',
    top: 10,
    color: 'black',
    width: '40%',
  },
  TaskDescription: {
    color: 'black',
    maxHeight: 100,
  },
  TaskDueDate: {
    position: 'absolute', 
    left: '60%',
    bottom: 10,
    color: 'black',
    width: '40%',
  },
  staricon: {
    right: 5,
    top: 7,
  },
});

export default Search;