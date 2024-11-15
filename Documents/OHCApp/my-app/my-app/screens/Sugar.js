import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Sugar = () => {
  const navigation = useNavigation();
  const [range, setRange] = useState('Random');
  const route = useRoute();
  const [message, setMessage] = useState(route.params?.message || '');

  const [sugarData, setSugarData] = useState([
    { date: '01-Oct-2024', TestType: 'Random', value: '90' },
    { date: '03-Oct-2024', TestType: 'Random', value: '80' },
    { date: '05-Oct-2024', TestType: 'Random', value: '135' },
    { date: '07-Oct-2024', TestType: 'Random', value: '300' },
  ]);

  const handleRangeChange = (selected) => {
    setRange(selected);
    if (selected === 'Random') {
        setSugarData([
          { date: '01-Oct-2024', TestType: 'Random', value: '90' },
          { date: '03-Oct-2024', TestType: 'Random', value: '80' },
          { date: '05-Oct-2024', TestType: 'Random', value: '135' },
          { date: '07-Oct-2024', TestType: 'Random', value: '300' },
        ]);
    } else if (selected === 'Fasting') {
        setSugarData([
          { date: '01-Oct-2024', TestType: 'Fasting', value: '70' },
          { date: '03-Oct-2024', TestType: 'Fasting', value: '80' },
          { date: '05-Oct-2024', TestType: 'Fasting', value: '100' },
          { date: '07-Oct-2024', TestType: 'Fasting', value: '85' },
        ]);
    }
  };

  const handleBackPress = () => { 
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container1}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
        <Text style={styles.headerText}>Blood Sugar</Text>
        <Ionicons name="add-circle-outline" size={30} color="#6b1f58" onPress={() => navigation.navigate('addsugar')}/>
      </View>
      
      <View style={styles.pickerContainer}>
        {Platform.OS === 'web' ? (
          <select
            value={range}
            onChange={(e) => handleRangeChange(e.target.value)}
            style={styles.webPicker}
          >
            <option value="select">Select</option>
            <option value="Random">Random</option>
            <option value="Fasting">Fasting</option>
          </select>
        ) : (
          <RNPicker
            selectedValue={range}
            onValueChange={handleRangeChange}
            style={styles.picker}
          >
            <RNPicker.Item label="Select" value="select" />
            <RNPicker.Item label="Random" value="Random" />
            <RNPicker.Item label="Fasting" value="Fasting" />
          </RNPicker>
        )}
      </View>

      {sugarData ? (
        <View>
          <View style={styles.chartContainer}>
            <LineChart
              data={{
                labels: sugarData.map(item => item.date),
                datasets: [
                  {
                    data: sugarData.map(item => Number(item.value)),
                    color: () => '#3b82f6', 
                  },
                ],
                legend: ['Blood Sugar'],
              }}
              width={Dimensions.get('window').width - 40} 
              height={220}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#fff',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 8,
              }}
            />
          </View>
          
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>TestType</Text>
              <Text style={styles.tableHeaderText}>Sugar (mm/Hg)</Text>
            </View>
            {sugarData.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}>
                <Text style={styles.tableRowText}>{item.date}</Text>
                <Text style={styles.tableRowText}>{item.TestType}</Text>
                <Text style={styles.tableRowText}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.otpContainer}>
          <Text style={styles.title}>No data available</Text>
        </View>
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#fff',
    // marginTop: 10
},
container1: {
    backgroundColor: '#fff',
    marginTop: 20,
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6b1f58',
  },
  pickerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#692367',
    marginBottom: 16,
  },
  picker: {
    height: 40,
    color: '#692367',
  },
  webPicker: {
    height: 40,
    color: '#692367',
    width: '100%',
    padding: 8,
  },
  chartContainer: {
    marginHorizontal: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  tableContainer: {
    margin: 0,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#6b1f58',
    padding: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  alternateRow: {
    backgroundColor: '#f3e5f5',
  },
  tableRowText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  otpContainer: {
    marginBottom: 20,
    alignItems: 'center',
    marginTop: 50,
  },
});

export default Sugar;
