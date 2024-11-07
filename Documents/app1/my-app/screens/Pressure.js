import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const pressureData = [
  { date: '01-Oct-2024', time: '11:05 AM', value: '90/80' },
  { date: '03-Oct-2024', time: '11:05 AM', value: '80/70' },
  { date: '05-Oct-2024', time: '10:00 AM', value: '85/75' },
  { date: '07-Oct-2024', time: '09:30 AM', value: '88/78' },
];

const Pressure = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState(route.params?.message || '');
  
  // Extract systolic and diastolic values for the chart
  const systolicData = pressureData.map(item => parseInt(item.value.split('/')[0], 10));
  const diastolicData = pressureData.map(item => parseInt(item.value.split('/')[1], 10));
  const labels = pressureData.map(item => item.date);

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
        <Text style={styles.headerText}>Blood Pressure</Text>
        <Ionicons name="add-circle-outline" size={30} color="#6b1f58" onPress={() => navigation.navigate('addpressure')}/>
      </View>

      {/* Chart */}
      {pressureData ? (
        <View>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: labels,
            datasets: [
              {
                data: systolicData,
                color: () => '#3b82f6', // Systolic line color
              },
              {
                data: diastolicData,
                color: () => '#d97706', // Diastolic line color
              },
            ],
            legend: ['Systolic', 'Diastolic'],
          }}
          width={Dimensions.get('window').width - 20} // Adjust width
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
          <Text style={styles.tableHeaderText}>Time</Text>
          <Text style={styles.tableHeaderText}>Systolic/Diastolic (mm/Hg)</Text>
        </View>
        {pressureData.map((item, index) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.alternateRow]}>
            <Text style={styles.tableRowText}>{item.date}</Text>
            <Text style={styles.tableRowText}>{item.time}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 30,
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
    marginTop: 50
  },
});

export default Pressure;
