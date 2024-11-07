import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const visitData = [
    { date: '01-Oct-2024', health: 'Common Cold disorder (TM1)', doctor: 'Dr, tester tester' },
];

const Visits = () => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
                <Text style={styles.headerTitle}>Visits</Text>
                <Ionicons name="refresh" size={24} color="#6b1f58" />
            </View>
            <View style={styles.separatorLine} />

            {/* Table Section */}
            {visitData ? (
                <View style={styles.tableContainer}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderText}>Date</Text>
                        <Text style={styles.tableHeaderText}>Health Condition</Text>
                        <Text style={styles.tableHeaderText}>Doctor Name</Text>
                    </View>
                    {visitData.map((item, index) => (
                        <View style={styles.tableRow}>
                            <Text style={styles.tableRowText}>{item.date}</Text>
                            <Text style={styles.tableRowText}>{item.health}</Text>
                            <Text style={styles.tableRowText}>{item.doctor}</Text>
                        </View>
                    ))}
                </View>
            ) :
                (
                    <View style={styles.otpContainer}>
                        <Text style={styles.title}>No data available</Text>
                    </View>
                )}
        </SafeAreaView>
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
    separatorLine: {
        height: 5, // Thick line
        backgroundColor: '#692367',
        width: '100%',
        marginBottom: 20,
        padding: 0
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6b1f58',
        // marginLeft: '30%'
    },
    tableContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: '#6b1f58',
        borderRadius: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#6b1f58',
        padding: 10,
    },
    tableHeaderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    tableRowText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    otpContainer: {
        marginBottom: 20,
        alignItems: 'center',
        marginTop: 50
      },
});

export default Visits;
