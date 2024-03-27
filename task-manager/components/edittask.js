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
const DataPro = [
  {
    name: 'In Progress'
  },
  {
    name: 'Completed'
  },
];

function EditTask() {
  const navigation = useNavigation();
  const route = useRoute();

  const filteredP = DataP.map(function(item) {
    return {
      name: item.priority
    };
  });
  //console.log(filteredP);
  var [selectedkey, setSelectedkey] = useState("");
  var [selectedItems, setSelectedItems] = useState("");
  var [selectedP, setSelectedP] = useState({});
  var [selectedPro, setSelectedPro] = useState({});
  var [description, setdescription] = useState("");
  var [duedate, setDate] = useState(new Date());

  const varHandler = () => {
    //console.log(selectedItems);
    //console.log(selectedP.name);
    //console.log(description);
    //console.log(typeof(duedate));
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
    else if (selectedPro.name == null) {
      Alert.alert('Missing progress', 'Please set a progress status', [
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
      if (typeof(duedate) == 'object') {
        var cacheduedate = moment(duedate.toDate()).format("YYYY-MM-DD");
        console.log(typeof(duedate));
        console.log(cacheduedate);
      }
      else {
        var cacheduedate = moment(duedate).format("YYYY-MM-DD");
        console.log(typeof(duedate));
        console.log(cacheduedate);
      }

      var selected = {key: selectedkey.name,
                      task: selectedItems.name, 
                      priority: priorityID, 
                      description: description.name, 
                      duedate: cacheduedate, 
                      progress: selectedPro.name};
      console.log(selected);
      EditAlert(selected)
    }
  }
  
  const EditAlert = (selected) => {
        Alert.alert('Edit', 'Are you done editing '+ selected.task + '?', [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => cacheData(selected)},
        ]);
      };

  const cacheData = async (selected) => {
    const cache_data_key = selected.key.toString();
    const cache_data_task = selected.task.toString();
    const cache_data_priority = selected.priority.toString();
    const cache_data_description = selected.description.toString();
    const cache_data_duedate = selected.duedate.toString();
    const cache_data_progress = selected.progress.toString();
    try {
      console.log("Item " + cache_data_key + " with description: " + cache_data_task + ", and priority: " + cache_data_priority + ", and description: " + cache_data_description + ", and duedate: " + cache_data_duedate + ", and progress: " + cache_data_progress + " successfully edited.")
      navigation.navigate('Home', {
        key: cache_data_key,
        name: cache_data_task,
        priority: cache_data_priority,
        description: cache_data_description,
        duedate: cache_data_duedate,
        progress: cache_data_progress,
        edit: true
      })
    } 
    catch (error) {
      console.log("Some error occured while caching data. Check console logs for details.");
      console.log(error);
    }
  };

  const checkroute = async() => {
    console.log(route.params);
    if (route.params?.key != undefined) {
      setSelectedkey({name: route.params.key});
      setSelectedItems({name: route.params.name});
      setSelectedP(route.params.priority == '1'? {name: "Low"} : route.params.priority == '2'? {name: "Medium"} : {name: "High"});
      setSelectedPro({name: route.params.progress});
      setdescription({name: route.params.description});
      setDate(moment(route.params.duedate).toISOString());
      // Clear navigation params
      navigation.setParams({ key: undefined, name: undefined, priority: undefined, description: undefined, duedate: undefined, progress: undefined});
    }
  };
  
  useEffect(() => {
      checkroute();
      console.log("Edit")
    }, []);
 
  return (
    <SafeAreaView style={styles.MainContainer}>
      <ScrollView keyboardShouldPersistTaps = 'always' style={styles.scrollView}>
        {/* <View style={styles.headerContainer}> */}
          <Text style={styles.tempText}>Editing task</Text>
        {/* </View> */}
        <Text style={styles.tempTextS}>Task Name:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setSelectedItems({name: text})}
          placeholder="Task Name"
          value={selectedItems.name}
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
          placeholder={selectedP.name}
          placeholderTextColor={'black'}
          // place holder for the search input
          resetValue={false}
          // reset textInput Value with true and false state
        />
        <Text style={styles.tempTextS}>Task progress:</Text>
        <SearchableDropdown
          onTextChange={(text) => setSelectedPro({name: text})}
          // On text change listner on the searchable input
          selectedItems={selectedPro}
          // onItemSelect={(name) => setSelectedPro(name)}
          onItemSelect={(name) => setSelectedPro(name)}
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
          items={DataPro}
          // mapping of item array
          defaultIndex={"progress Level"}
          // default selected item index
          placeholder={selectedPro.name}
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
          value={description.name}
        />
        <Text style={styles.tempTextS}>Task due Date:</Text>
        <View style={styles.container}>
          <DateTimePicker
            mode="single"
            date={duedate}
            onChange={(params) => setDate(params.date)}
            value={duedate}
          />
        </View>
        <View style={styles.button}>
          <Button title="Edit Task" onPress={() => varHandler()}/>
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

export default EditTask;