import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, SafeAreaView, Text, View, TextInput, Image, Button, FlatList, TouchableOpacity, Alert, ScrollView} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import DateTimePicker from 'react-native-ui-datepicker';
import moment from 'moment';

const DataP = [
  {
    id: 1,
    priority: 'Low'
  },
  {
    id: 2,
    priority: 'Medium'
  },
  {
    id: 3,
    priority: 'High'
  },
];

function AddTask() {
  const navigation = useNavigation();
  const route = useRoute();

  const filteredP = DataP.map(function(item) {
    return {
      name: item.priority
    };
  });
  //console.log(filteredP);

  var [selectedItems, setSelectedItems] = useState("");
  var [selectedP, setSelectedP] = useState({});
  var [description, setdescription] = useState("");
  var [duedate, setDate] = useState(new Date());

  const varHandler = () => {
    //console.log(selectedItems);
    //console.log(selectedP.name);
    //console.log(description);
    //console.log(duedate);
    //console.log(moment(duedate.toDate()).format("YYYY-MM-DD"));
    if (selectedItems.name == null) {
      Alert.alert('Missing name', 'Please give the task a name', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
    else if (selectedP.name == null) {
      Alert.alert('Missing priority', 'Please set a priority', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
    else if (description.name == null) {
      Alert.alert('Missing description', 'Please write a simply description', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
    else if (duedate < new Date()) {
      Alert.alert('Too late', 'Please set the due date any day after today', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
    }
    else {
      const prioritylist = DataP.filter(x => x.priority == selectedP.name);
      //console.log(prioritylist);
      const priorityID = prioritylist.map(function(item) {return item.id}).toString();
      //console.log(priorityID);
      var selected = {task: selectedItems.name, 
                      priority: priorityID, 
                      description: description.name, 
                      duedate: moment(duedate.toDate()).format("YYYY-MM-DD"), 
                      progress: "In Progress"};
      console.log(selected);
      AddAlert(selected)
    }
  }
  
  const AddAlert = (selected) => {
        Alert.alert('Add', 'Do you want to add '+ selected.task + ' to the list?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => cacheData(selected)},
        ]);
      };

  const cacheData = async (selected) => {
    const cache_data_task = selected.task.toString();
    const cache_data_priority = selected.priority.toString();
    const cache_data_description = selected.description.toString();
    const cache_data_duedate = selected.duedate.toString();
    const cache_data_progress = selected.progress.toString();
    try {
      console.log("Item with description: " + cache_data_task + ", and priority: " + cache_data_priority + ", and description: " + cache_data_description + ", and duedate: " + cache_data_duedate + ", and progress: " + cache_data_progress + " successfully cached.")
      navigation.navigate('Home', {
        name: cache_data_task,
        priority: cache_data_priority,
        description: cache_data_description,
        duedate: cache_data_duedate,
        progress: cache_data_progress,
        add: true
      })
    } 
    catch (error) {
      console.log("Some error occured while caching data. Check console logs for details.");
      console.log(error.cause);
    }
  };
  
  useEffect(() => {
      console.log("Favourites")
    }, []);
 
  return (
    <SafeAreaView style={styles.MainContainer}>
      <ScrollView keyboardShouldPersistTaps = 'always' style={styles.scrollView}>
        {/* <View style={styles.headerContainer}> */}
          <Text style={styles.tempText}>What task would like to add?</Text>
        {/* </View> */}
        <Text style={styles.tempTextS}>Task Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setSelectedItems({name: text})}
          placeholder="Task Name"
        />
        <Text style={styles.tempTextS}>Task priority:</Text>
        <SearchableDropdown
          onTextChange={(text) => setSelectedP({name: text})}
          // On text change listner on the searchable input
          selectedItems={selectedP}
          // onItemSelect={(name) => setSelectedP(name)}
          onItemSelect={(name) => setSelectedP(name)}
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
          items={filteredP}
          // mapping of item array
          defaultIndex={"priority Level"}
          // default selected item index
          placeholder="Priority Level"
          placeholderTextColor={'black'}
          // place holder for the search input
          resetValue={false}
          // reset textInput Value with true and false state
        />
        <Text style={styles.tempTextS}>Task description:</Text>
        <TextInput
          editable
          multiline
          numberOfLines={4}
          maxLength={40}
          onChangeText={(text) => setdescription({name: text})}
          placeholder="description"
          style={styles.inputD}
        />
        <Text style={styles.tempTextS}>Task due Date:</Text>
        <View style={styles.container}>
          <DateTimePicker
            mode="single"
            date={duedate}
            onChange={(params) => setDate(params.date)}
          />
        </View>
        <View style={styles.button}>
          <Button title="Add Task" onPress={() => varHandler()}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputD: {
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  tempText: {
    margin: 12,
    fontSize: 25,
    color: 'black',
  },
  tempTextS: {
    marginLeft: 12,
    fontSize: 18,
    color: 'black',
  },
  button: {
    padding: 10,
    alignSelf: 'stretch'
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
   });

export default AddTask;