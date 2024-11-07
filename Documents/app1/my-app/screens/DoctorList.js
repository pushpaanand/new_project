import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import StarRating from 'react-native-star-rating-widget';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

export default function DoctorList() {
    const [specialty, setSpecialty] = useState('');
    const navigation = useNavigation();

    const [doctors, setDoctors] = useState([
        { id: '1', name: 'Dr. Maran T', specialty: 'Family Medicine', degree: 'M.B.B.S', fees: 100, rating: 0 },
        { id: '2', name: 'Dr. Keerthana S', specialty: 'Family Medicine', degree: 'M.B.B.S', fees: 200, rating: 4 },
        { id: '3', name: 'Dr. Sivarajan P', specialty: 'Family Medicine', degree: 'M.B.B.S', fees: 300, rating: 1 },
    ]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleDetails = (item) => {
        // navigation.goBack();
        navigation.navigate('details', {item: item});
    };

    const handleSpecialtyChange = (selectedSpecialty) => {
        setSpecialty(selectedSpecialty);
        // Here you would typically filter the doctor data based on the selected specialty.
        // For demonstration, we'll update the list with new doctor data.
        if (selectedSpecialty === 'Family Medicine') {
            setDoctors([
                { id: '1', name: 'Dr. Maran T', specialty: 'Family Medicine', degree: 'M.B.B.S', fees: 100, rating: 0 },
                { id: '2', name: 'Dr. Keerthana S', specialty: 'Family Medicine', degree: 'M.B.B.S', fees: 200, rating: 4 },
                { id: '3', name: 'Dr. Sivarajan P', specialty: 'Family Medicine', degree: 'M.B.B.S', fees: 300, rating: 1 },
            ]);
        } else if (selectedSpecialty === 'Cardiology') {
            setDoctors([
                { id: '4', name: 'Dr. Arun K', specialty: 'Cardiology', degree: 'M.D', fees: 500, rating: 5 },
                { id: '5', name: 'Dr. Sneha R', specialty: 'Cardiology', degree: 'M.D', fees: 600, rating: 3 },
            ]);
        }
    };

    const renderDoctorCard = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={()=>handleDetails(item)}>

            <View style={styles.cardContent}>
            <View style={styles.leftBar} />
                <Image source={require('../assets/doctoricon.png')} style={styles.avatar} />
                <View style={styles.details}>
                    <Text style={styles.doctorName}>{item.name}</Text>
                    <Text>{item.specialty}</Text>
                    <Text>{item.degree}</Text>
                    <Text>Fees: ₹{item.fees}</Text>
                    <Text>Average Rating:</Text>
                    <StarRating
                        rating={item.rating}
                        onChange={() => { }}
                        starSize={16}
                        color="#800080"
                        enableSwiping={false}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.arrowButton}>
                <Text style={styles.arrowText}>&gt;</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Search Doctor</Text> */}
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress}/>
                <Text style={styles.headerTitle}>Search Doctor</Text>
                {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
            </View>
            <View style={styles.separatorLine} />

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={specialty}
                    onValueChange={handleSpecialtyChange}
                    style={styles.picker}
                >
                    <Picker.Item label="Select" value="select" />
                    <Picker.Item label="Family Medicine" value="Family Medicine" />
                    <Picker.Item label="Cardiology" value="Cardiology" />
                    {/* Add more specialties here */}
                </Picker>
            </View>

            {/* <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity> */}

            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id}
                renderItem={renderDoctorCard}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
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
        marginLeft: '20%'
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
    submitButton: {
        backgroundColor: '#692367',
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '30%',
        marginBottom: 16,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    listContainer: {
        paddingBottom: 16,
        marginTop: 20
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        flex: 1,
    },
    avatar: {
        width: 70,
        height: 100,
        borderRadius: 25,
        backgroundColor: '#DDD',
        marginRight: 16,
    },
    details: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    arrowButton: {
        backgroundColor: '#692367',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowText: {
        color: '#FFFFFF',
        fontSize: 18,
    },
    leftBar: {
        marginLeft: 0,
        width: 5, // Narrow sidebar
        backgroundColor: '#692367', // Customize the color as needed
    },
});
