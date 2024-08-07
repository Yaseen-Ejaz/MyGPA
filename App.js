import { View, Text, TextInput, StyleSheet, Animated, ScrollView, TouchableOpacity, SafeAreaView, Easing, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Font from "expo-font";
import Apploading from "expo-app-loading";
import LoadingScreen from './LoadingScreen';
import {Picker} from 'picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


const getFonts = () =>
  Font.loadAsync({
    SFProSemiBold: require('./assets/fonts/SF-Pro-Display-Semibold.ttf'),
    SFProBold: require('./assets/fonts/SF-Pro-Display-Bold.ttf'),
    SFProMedium: require('./assets/fonts/SF-Pro-Display-Medium.ttf'),
    SansMedium: require('./assets/fonts/ProductSans-Medium.ttf'),
    SansBold: require('./assets/fonts/ProductSans-Bold.ttf'),
  });
export default function App() {

  const data = [
    {label: 'A+/A', value: '4.0'},
    {label: 'A-', value: '3.67'},
    {label: 'B+', value: '3.33'},
    {label: 'B', value: '3.0'},
    {label: 'B-', value: '2.67'},
    {label: 'C+', value: '2.33'},
    {label: 'C', value: '2.0'},
    {label: 'C-', value: '1.67'},
    {label: 'D+', value: '1.33'},
    {label: 'D', value: '1.0'},
    {label: 'F', value: '0.0'},
    {label: 'X', value: '0.0'},
  ]
  const boxes = [
    { id: 1, text: 'Course 1' },
    { id: 2, text: 'Course 2' },
    { id: 3, text: 'Course 3' },
    { id: 4, text: 'Course 4' },
    { id: 5, text: 'Course 5' },
    { id: 6, text: 'Course 6' },
    { id: 7, text: 'Course 7' },
    { id: 8, text: 'Course 8' },
    { id: 9, text: 'Course 9' },
    { id: 10, text: 'Course 10' },
    { id: 11, text: 'Course 11' },
    { id: 12, text: 'Course 12' },
  ];

    
  const [courseValues, setCourseValues] = React.useState(Array(boxes.length).fill(''));
  const [selectedGrades, setSelectedGrades] = useState(Array(courseValues.length).fill('X')); // Default grades for each course
  const [gpaChangeAnimation] = useState(new Animated.Value(1));
  const [gpa, setGpa] = useState('0.00');
  const [showLoading, setShowLoading] = useState(true);
  const [fontsloaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLoading(false);
    }, 2000);
  }, []);

  const handleCourseChange = (index, value) => {
    const newCourseValues = [...courseValues];
    newCourseValues[index] = value;
    setCourseValues(newCourseValues);
  };
  
  const [crValues, setCrValues] = useState(new Array(boxes.length).fill(0));
  const handleIncrement = (index) => {
    if (crValues[index] < 3) {
      const newCrValues = [...crValues];
      newCrValues[index] += 1;
      setCrValues(newCrValues);
      updateGPA();

    }
  };

  const handleDecrement = (index) => {
    if (crValues[index] > 0) {
      const newCrValues = [...crValues];
      newCrValues[index] -= 1;
      setCrValues(newCrValues);
      updateGPA();

    }
  };

  const handleGradeChange = (index, value) => {
    const updatedSelectedGrades = [...selectedGrades];
    updatedSelectedGrades[index] = value;
    setSelectedGrades(updatedSelectedGrades);
    updateGPA();

  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    for (let i = 0; i < courseValues.length; i++) {
      if (selectedGrades[i] !== 'X') {
        const gradeValue = data.find(item => item.label === selectedGrades[i])?.value || 0;
        totalPoints += gradeValue * crValues[i];
        totalCredits += crValues[i];
      }
    }

    if (totalCredits > 0) {
      return (totalPoints / totalCredits).toFixed(2);
    } else {
      return '0.00';
    }
  };

  const calculateCredits = () => {
    let totalCredits = 0;
    
    for (let i = 0; i < courseValues.length; i++) {
      if (selectedGrades[i] !== 'X') {
        totalCredits += crValues[i];
      }
    }

    return totalCredits;
  };
  

  const updateGPA = () => {
    const newGpa = calculateGPA();
    setGpa(newGpa);

    // Animate the GPA text to make it larger temporarily
    Animated.timing(gpaChangeAnimation, {
      toValue: 1.1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      // Return the font size to the original size
      Animated.timing(gpaChangeAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
  };

  const [modalVisible, setModalVisible] = useState(false);

  if (showLoading) {
    return <LoadingScreen />;
  }

  if (!fontsloaded) {
    return <Apploading
    startAsync={getFonts}
    onFinish={() => {
      setFontsLoaded(true);
    }}
    onError={console.warn}

  />;
  }

    if(fontsloaded)
    {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.header} blurRadius={10}>

              <Text style={styles.intro}>MyGPA</Text>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}
                style={{marginBottom:15}}>
                  <Icon name="info" size={25} color="#333" />
                </TouchableOpacity>
                <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{fontFamily:"SansMedium",textAlign:"justify"}}>The MyGPA mobile app is a convenient and user-friendly tool designed to simplify the process of calculating your Grade Point Average (GPA) in academic settings. Whether you're a student in high school or college, this app provides a seamless way to keep track of your academic performance.</Text>
            <Text style={styles.modalTitle}>Grade Values</Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Grade</Text>
                <Text style={styles.headerText}>Value</Text>
              </View>
              {data.map((item, index) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={styles.tableCell}>{item.label}</Text>
                  <Text style={styles.tableCell}>{item.value}</Text>
                </View>
              ))}
            </View>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
              <Icon name="copyright" size={25} color="#333" />
              <Text style={{fontFamily:"SansMedium"}}>Developed by Yaseen Ejaz Ahmed</Text>
            </View>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
            

            
          <Animated.Text
          style={[
            styles.gpaText,
            {
              color:
                (parseFloat(calculateGPA()) >= 3.50 && parseFloat(calculateGPA()) <= 4.00)
                  ? '#489A43'
                  : (parseFloat(calculateGPA()) >= 3.00 && parseFloat(calculateGPA()) <= 3.49)
                  ? '#007BFF'
                  : (parseFloat(calculateGPA()) >= 2.50 && parseFloat(calculateGPA()) <= 2.99)
                  ? '#E7E700'
                  : (parseFloat(calculateGPA()) >= 2.00 && parseFloat(calculateGPA()) <= 2.49)
                  ? '#FAAA31'
                  : (parseFloat(calculateGPA()) >= 0.01 && parseFloat(calculateGPA()) <= 1.99)
                  ? '#FF4F4F'
                  : 'black',
              transform: [{ scale: gpaChangeAnimation }],
            },
          ]}
        >
          
            <Text style={styles.gpa}>{calculateGPA()}<Text style={styles.sgpa}> GPA</Text></Text>
          </Animated.Text>
          <Text style={styles.credits}>{calculateCredits()}<Text style={[styles.credits,{fontSize:15}]}>  Credits</Text></Text>
          </View>

          <View style={styles.heading}>
            <Text style={{fontFamily:"SFProBold", fontSize:16}}>Name</Text>
            <Text style={{fontFamily:"SFProBold", fontSize:16}}>Grade</Text>
            <Text style={{fontFamily:"SFProBold", fontSize:16}}>CrHrs</Text>
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.cont}>
          
          {boxes.map((box, index) => (
              <View key={box.id} style={[styles.box, selectedGrades[index] !== 'X' && crValues[index] > 0 && { backgroundColor: '#C7FFC4' }, // Apply green color if grade selected and crValue > 0
            ]}>
                <View style={styles.innerBox}>
                  <TextInput
                    label="Course"
                    placeholder={"Name"}                
                    value={courseValues[index]}
                    maxLength={10}
                    onChangeText={value => handleCourseChange(index, value)}
                    style={styles.textBox}
                  />
                  
                  <View style={styles.innerBox}>

                  
                  <Picker
              style={styles.picker}
              mode="dialog"
              dropdownIconRippleColor="blue"
              
              selectedValue={selectedGrades[index]}
              onValueChange={(value) => handleGradeChange(index, value)}
            >
              {data.map((item, gradeIndex) => (
                <Picker.Item
                style={styles.pickerItems}
                  key={gradeIndex}
                  label={item.label}
                  value={item.label}
                />
              ))}
            </Picker>
                    <TouchableOpacity onPress={() => handleDecrement(index)}
                    style={styles.roundButton1}>
                    <Text style={styles.buttonText}> - </Text>
                  </TouchableOpacity>

                    <Text style={styles.boxText}> {crValues[index]} </Text>
                    
                  <TouchableOpacity onPress={() => handleIncrement(index)}
                    style={styles.roundButton1}>
                    <Text style={styles.buttonText}> + </Text>
                  </TouchableOpacity>
                  </View>
                </View>

              </View>
            ))}
          </View>
  
          
  
        </ScrollView>
        </SafeAreaView>
    );
    }
else {
      return (
        <Apploading
          startAsync={getFonts}
          onFinish={() => {
            setFontsLoaded(true);
          }}
          onError={console.warn}
        />
      );
    }  
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#C1E5FF"
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    marginTop:10,
    fontFamily:"SansBold",
    
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 3,
    gap:45,
    backgroundColor: '#C1E5FF',
  },
  headerText: {
    fontFamily:"SFProBold",
    },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding:5,
    borderBottomWidth: 0.5,
    borderColor: '#C1E5FF',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontFamily:"SansMedium",

  },

  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    color: 'blue',
  },

  heading:
  {
    flexDirection:"row",
    justifyContent:"space-evenly",
    alignItems:"center",
    gap:50,
    backgroundColor:"#C1E5FF",
    padding:10,
  },

  header:{
    alignItems:"center",
    
    backgroundColor: '#E5FCFF',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,   // Adjust the width to control the horizontal shadow position
      height: 10,  // Adjust the height to control the vertical shadow position
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
  },

  titleInfo:
  {
    flexDirection:"row",
  },

  gpa:
  {
    fontSize:50,
    paddingTop: 70,
    paddingBottom: 20,
    fontFamily:"SansBold",
    backgroundColor: 'transparent', // Set to transparent so shadow appears behind
    textShadowColor: '#CCC',
            textShadowOffset: {width: 3, height: 3},
            textShadowRadius: 1,
          
  },

  sgpa:
  {
    fontSize:20,
    paddingTop: 60,
    paddingBottom: 10,
    fontFamily:"SansBold",
    color:"black",
            textShadowOffset: {width: 0, height: 0},
            textShadowRadius: 1,
  },

  credits:
  {
    fontSize:20,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily:"SansBold",
    color:"black",
            textShadowOffset: {width: 1, height: 0},
            textShadowRadius: 1,
  },
  

  intro:
  {
    marginTop:40,
    marginBottom:5,
    fontFamily:"SansMedium",
    fontSize:20
  },

  contentContainer: {
    padding: 16,
    backgroundColor: '#E5FCFF',
    borderTopRightRadius:20,
    borderTopLeftRadius:20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 10,

  },
  textContent: {
    fontSize: 500,
  },

  cont: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  box: {
    width:370,
    height: 80,
    backgroundColor: '#dfdff7',
    marginVertical: 10,
    flexDirection:"column",
    justifyContent: 'space-evenly',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,   // Adjust the width to control the horizontal shadow position
      height: 10,  // Adjust the height to control the vertical shadow position
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    
  },
  boxText: {
    fontSize: 18,
    fontFamily:"SansBold"

  },

  innerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin:10,
    gap:10
  },
  
    
  
    textBox: {
      maxWidth: '20%',
      fontSize:14,
      fontFamily:"SFProSemiBold"

    },

    roundButton1: {
      width: 35,
      height: 35,
      margin:-7,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: '#CBCCF4',
      shadowColor: '#000',
    shadowOffset: {
      width: 10,   // Adjust the width to control the horizontal shadow position
      height: 10,  // Adjust the height to control the vertical shadow position
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    },

    buttonText:
    {
      fontFamily:"SansBold",
      fontSize:20
    },
    picker:
    {
      width: 117,
      marginLeft:40,
    height: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    fontFamily:"SFProSemiBold"
    },

    pickerItems:
    {
      fontFamily:"SansMedium"
    }
  
});
