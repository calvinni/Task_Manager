import React, {useEffect, useState} from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {ActivityIndicator, FlatList, Text, View, StyleSheet} from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Home from './components/Home';
import AddTask from './components/Addtask';
import Search from './components/Search';
import Settings from './components/Settings';
import EditTask from './components/edittask';

const App = () => {
  
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home} options={({ route, navigation }) => ({ 
          title: "Task Manager", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Addtask' component={AddTask} options={({ route, navigation }) => ({ 
          title: "Add Task", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Search' component={Search} options={({ route, navigation }) => ({ 
          title: "Search", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Edit' component={EditTask} options={({ route, navigation }) => ({ 
          title: "Edit Task", 
          headerTitleAlign: "center", 
          headerRight: () => (
              <Text onPress={() => {navigation.navigate('Settings')}}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
              </Text>
        ) })} />
        <Stack.Screen name='Settings' component={Settings} options={{ title: "Settings", headerTitleAlign: "center", }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;