import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const oxygenData = [
  {
    date: '01-Oct-2024',
    time: '11:05 AM',
    value: 99
  },
  {
    date: '05-Oct-2024',
    time: '11:05 AM',
    value: 90
  },
];

const Oxygen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState(route.params?.message ? route.params?.message : '');

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.container1}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
        <Text style={styles.headerText}>Oxygen Level (SpO2)</Text>
        <Ionicons name="add-circle-outline" size={30} color="#6b1f58" onPress={() => navigation.navigate('addoxygen')}/>
      </View>

      {/* Chart */}
      {oxygenData ? (
        <View>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: oxygenData.map(item => item.date),
            datasets: [
              {
                data: oxygenData.map(item => item.value),
                color: () => '#3b82f6', 
              },
            ],
            legend: ['Oxygen Level (SpO2)'],
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

      {/* Table */}
      
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Date</Text>
          <Text style={styles.tableHeaderText}>Time</Text>
          <Text style={styles.tableHeaderText}>SpO2 (%)</Text>
        </View>
        {oxygenData.map((item, index) => (
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6b1f58',
  },
  chartContainer: {
    marginHorizontal: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  tableContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    marginTop: 20,
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

export default Oxygen;
