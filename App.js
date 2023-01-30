import React, {useState,useEffect} from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import TaskInputField from './components/TaskInputField';
import TaskItem from './components/TaskItem';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const addTask = (task) => {
    let myHeaders = {
      "Content-Type" : "application/json",
    };
    if (task == null) return;
    
    let raw = JSON.stringify({
      "name": task,
      "description": "description 2"
    });
    
    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    
    fetch("http://5.180.49.10:5001/api/todo", requestOptions)
      .then(response => response.text())
      .then(result => fetchData())
      .catch(error => console.log('error', error));
    Keyboard.dismiss()
  }

  const deleteTask = (deleteIndex) => {
    var requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(`http://5.180.49.10:5001/api/todo/${deleteIndex}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
    fetchData();
  }

  const fetchData = async () => {
    const response = await fetch('http://5.180.49.10:5001/api/todo/?page=1');
    const data = await response.json();
    setData(data.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  },[]);

  return (
    <View style={styles.container}>
        <Text style={styles.heading}>TODO LIST</Text>
      <ScrollView style={styles.scrollView}>
        {
        data.map((item, index) => {
          return (
            <View key={index} style={styles.taskContainer}>
              <TaskItem index={index + 1} task={item.name} deleteTask={() => deleteTask(item._id)}/>
            </View>
          );
        })
      }
      </ScrollView>
      <TaskInputField addTask={addTask}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CE7777',
  },
  heading: {
    color: '#2B3A55',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 70,
    marginBottom: 10,
    marginLeft: 20,
  },
  scrollView: {
    marginBottom: 70,
  },
  taskContainer: {
    marginTop: 20,
  }
});