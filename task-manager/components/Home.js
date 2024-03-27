import React, { Component, Fragment, useState, useEffect, StatusBar } from 'react';
import { NavigationContainer, useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { View, TouchableOpacity, Text, StyleSheet, Button, Alert, FlatList } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cache } from "react-native-cache";
import moment from 'moment';

function Home()  {
  const navigation = useNavigation();
  const route = useRoute();
  const cache = new Cache({
    namespace: "myapp",
    policy: {
      maxEntries: 100, // if unspecified, it can have unlimited entries
    },
      backend: AsyncStorage
  });
  const isFocused = useIsFocused();
  var [task_data, settask] = useState([]);
  var [task_dataIP, settaskIP] = useState([]);
  var [task_dataC, settaskC] = useState([]);
  var [task_dataO, settaskO] = useState([]);
  //const [isStateDirty, setStateDirty] = useState(false);
  var datalist = [];
  const [Sortfav, setSortfav] = useState(null);
  var [counter, setcounter] = useState();
  var [showstate, setshowstate] = useState('InProgress');

  Sortfav_token = async () => AsyncStorage.getItem('Sortfav');

  Description_token = async () => AsyncStorage.getItem('Description');
  Code_token = async () => AsyncStorage.getItem('BusStopCode');

  const FetchSort = async () => {
    try {
      var Sorttoken = await this.Sortfav_token();
      setSortfav(Sorttoken)
      //console.log(Sorttoken)
    } 
    catch (error) {
      console.log("Some error occured while fetching data. Check console logs for details.");
      console.log(error);
    }
  };

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
        if (duedate < moment().format("YYYY-MM-DD")) {
          var progress = 'Overdue'
          var overduevalues = {name: name,
                              priority: priority, 
                              description: description, 
                              duedate: duedate, 
                              progress: progress};
          await cache.set(key, overduevalues);
        }
        else {
          var progress = Value.value.progress
        }
        count++
        var updatedValue = {"key": key, "name": name, "priority": priority, "description": description, "duedate": duedate, "progress": progress};
        //console.log(updatedValue);
        datalist.push(updatedValue);
      }
      settask(datalist)
      setcounter(count);
      //console.log(datalist);

      settaskIP(datalist.filter(item => item.progress == "In Progress"));

      settaskC(datalist.filter(item => item.progress == "Completed"));

      settaskO(datalist.filter(item => item.progress == "Overdue"));

      datalist=[];
      //setStateDirty(true);
    }
    catch(error){
      console.log(error);
    }
  }

  const checkroute = async() => {
    if (route.params?.add == true) {
      console.log(counter);
      var tobecachevalue = {name: route.params.name,
                            priority: route.params.priority, 
                            description: route.params.description, 
                            duedate: route.params.duedate, 
                            progress: route.params.progress};
      await cache.set(counter+1, tobecachevalue);
      var updatetask = {"key": counter+1, 
                        "name": route.params.name,
                        "priority": route.params.priority, 
                        "description": route.params.description, 
                        "duedate": route.params.duedate,
                        "progress": route.params.progress};
      console.log(updatetask)
      settaskIP([...task_dataIP, updatetask]);
      // Clear navigation params
      navigation.setParams({ name: undefined, priority: undefined, description: undefined, duedate: undefined, progress: undefined, add: undefined}); 
    }
    else if (route.params?.edit == true) {
      var editedcachevalue = {name: route.params.name,
                            priority: route.params.priority, 
                            description: route.params.description, 
                            duedate: route.params.duedate, 
                            progress: route.params.progress};
      await cache.set(route.params.key, editedcachevalue);
      // Clear navigation params
      navigation.setParams({ name: undefined, priority: undefined, description: undefined, duedate: undefined, progress: undefined, edit: undefined});
    }
  };

  const Delete = async(key) => {
      console.log("Deleted " + key)
      await cache.remove(key);
        
      settaskIP(task_dataIP.filter(item => item.key !== key));
      settaskC(task_dataC.filter(item => item.key !== key));
      settaskO(task_dataO.filter(item => item.key !== key));
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

  const showstate1 = () => {
      setshowstate('InProgress');
      //console.log(showstate);
  }
  const showstate2 = () => {
      setshowstate('Completed');
      //console.log(showstate);
  }
  const showstate3 = () => {
      setshowstate('Overdue');
      //console.log(showstate);
  }

  useEffect(() => {
    fetchData();
    FetchSort();
    checkroute();
    console.log("Home");
    console.log(showstate);
  }, [isFocused]);
    
    return (
      <View style={styles.MainContainer}>

        <View style={styles.headerContainer}>
          <Text style={styles.tempText}>Search for Task</Text>
          <View style={styles.button}>
            <Button
              title="Search"
              onPress={() => {navigation.navigate('Search')}}
            />
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.FavText}>Tasks: </Text>
          <Text style={styles.Addstops} onPress={() => navigation.navigate('Addtask', {task_data})}>
            Add more tasks <AntDesign name="pluscircleo" size={18} color={"black"} />
          </Text>
          <View style={styles.grid}>
            <Grid>
              <Row style={styles.row}>
                <View style={styles.sectionButton}>
                  <Button title="In Progress" color={showstate=='InProgress' ? "#f9c2ff" : undefined} onPress={() => {showstate1()}}/>
                </View>
                <View style={styles.sectionButton}>
                  <Button title="Completed" color={showstate=='Completed' ? "#f9c2ff" : undefined} onPress={() => {showstate2()}}/>
                </View>
                <View style={styles.sectionButton}>
                  <Button title="Overdue" color={showstate=='Overdue' ? "#f9c2ff" : undefined} onPress={() => {showstate3()}}/>
                </View>
              </Row>
            </Grid>
          </View>
          <View style={styles.absolute}>
            <FlatList
              data={Sortfav=='DueDate' ? task_dataIP.sort(function (a, b) {let x = new Date(a.duedate); let y = new Date(b.duedate); return x-y;}) : 
                   task_dataIP.sort(function (a, b) {if (a.priority > b.priority) {return -1;}if (a.priority < b.priority) {return 1;}return 0;})}
              extraData={Sortfav=='DueDate' ? task_dataIP.sort(function (a, b) {let x = new Date(a.duedate); let y = new Date(b.duedate); return x-y;}) : task_dataIP.sort(function (a, b) {if (a.priority > b.priority) {return -1;}if (a.priority < b.priority) {return 1;}return 0;})}
              renderItem={({item}) => showstate=='InProgress' ?
                (<View style={styles.item}>
                  <Text style={styles.TaskName}>{item.name} ({item.progress})</Text>
                  <Text style={styles.TaskPiority}>Priority Level: {item.priority == '1'? "Low" : 
                                                                    item.priority == '2'? "Medium" : "High"}</Text>
                  <Text style={styles.TaskDescription}>{item.description} </Text>
                  <Text style={styles.TaskDueDate}>Due date: {item.duedate} </Text>
                  <Text style={styles.staricon}><Feather name="trash" size={24} color="black" onPress={() => DeleteAlert(item)}/> 
                                                {'     '}
                                                <AntDesign name="edit" size={24} color="black" onPress={() => EditAlert(item)}/></Text>
                </View>) : undefined
              }
              keyExtractor={item => item.key}
            />
          </View>
          <View style={styles.absolute}>
            <FlatList
              data={Sortfav=='DueDate' ? task_dataC.sort(function (a, b) {let x = new Date(a.duedate); let y = new Date(b.duedate); return x-y;}) : 
                    Sortfav=='Piority Level' ? task_dataC.sort(function (a, b) {if (a.priority > b.priority) {return -1;}if (a.priority < b.priority) {return 1;}return 0;}) : 
                    task_dataC
                    }
              extraData={Sortfav=='DueDate' ? task_dataC.sort(function (a, b) {let x = new Date(a.duedate); let y = new Date(b.duedate); return x-y;}) : 
                    Sortfav=='Piority Level' ? task_dataC.sort(function (a, b) {if (a.priority > b.priority) {return -1;}if (a.priority < b.priority) {return 1;}return 0;}) : 
                    task_dataC
                    }
              renderItem={({item}) => showstate=='Completed' ?
                (<View style={styles.item}>
                  <Text style={styles.TaskName}>{item.name} ({item.progress})</Text>
                  <Text style={styles.TaskPiority}>Priority Level: {item.priority == '1'? "Low" : 
                                                                    item.priority == '2'? "Medium" : "High"}</Text>
                  <Text style={styles.TaskDescription}>{item.description} </Text>
                  <Text style={styles.TaskDueDate}>Due date: {item.duedate} </Text>
                  <Text style={styles.staricon}><Feather name="trash" size={24} color="black" onPress={() => DeleteAlert(item)}/> 
                                                {'     '}
                                                <AntDesign name="edit" size={24} color="black" onPress={() => EditAlert(item)}/></Text>
                </View>) : undefined
              }
              keyExtractor={item => item.key}
            />
          </View>
          <View style={styles.absolute}>
            <FlatList
              data={Sortfav=='DueDate' ? task_dataO.sort(function (a, b) {let x = new Date(a.duedate); let y = new Date(b.duedate); return x-y;}) : 
                    Sortfav=='Piority Level' ? task_dataO.sort(function (a, b) {if (a.priority > b.priority) {return -1;}if (a.priority < b.priority) {return 1;}return 0;}) : 
                    task_dataO
                    }
              extraData={Sortfav=='DueDate' ? task_dataO.sort(function (a, b) {let x = new Date(a.duedate); let y = new Date(b.duedate); return x-y;}) : 
                    Sortfav=='Piority Level' ? task_dataO.sort(function (a, b) {if (a.priority > b.priority) {return -1;}if (a.priority < b.priority) {return 1;}return 0;}) : 
                    task_dataO
                    }
              renderItem={({item}) => showstate=='Overdue' ?
                (<View style={styles.item}>
                  <Text style={styles.TaskName}>{item.name} ({item.progress})</Text>
                  <Text style={styles.TaskPiority}>Priority Level: {item.priority == '1'? "Low" : 
                                                                    item.priority == '2'? "Medium" : "High"}</Text>
                  <Text style={styles.TaskDescription}>{item.description} </Text>
                  <Text style={styles.TaskDueDate}>Due date: {item.duedate} </Text>
                  <Text style={styles.staricon}><Feather name="trash" size={24} color="black" onPress={() => DeleteAlert(item)}/> 
                                                {'     '}
                                                <AntDesign name="edit" size={24} color="black" onPress={() => EditAlert(item)}/></Text>
                </View>) : undefined
              }
              keyExtractor={item => item.key}
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
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  tempText: {
    fontSize: 35,
    color: 'black',
  },
  button: {
    paddingLeft: 10,
    paddingRight: 10,
    alignSelf: 'stretch'
  },
  grid: {
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    alignSelf: 'stretch',
    height: 40,
    width: '100%',
  },
  row: {
    height: 40,
  },
  sectionButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  bodyContainer: {
    flex: 5,
  },
  FavText: {
    fontSize: 35,
    color: 'black',
    paddingLeft: 10,
  },
  item: {
    backgroundColor: '#f9c2ff',
    flex: 2,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
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
  Addstops: {
    fontSize: 20,
    paddingLeft: 10,
    alignSelf: 'center',
    color: 'black',
  },
  staricon: {
    right: 5,
    top: 7,
  },
  
});

export default Home;