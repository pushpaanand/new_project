import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function DoctorDetails() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleAvail = () => {
        navigation.navigate('avail');
    };

    return (
        <View style={styles.container}>
            <View style={styles.container1}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress} />
                <Text style={styles.headerTitle}>Doctor Profile</Text>
                {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
            </View>
            <View style={styles.separatorLine} />

            <View style={styles.profileImageContainer}>
                <Image
                    source={require('../assets/doctoricon.png')} // Replace with actual image path
                    style={styles.profileImage}
                />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{item.name}</Text>

                <Text style={styles.label}>Speciality</Text>
                <Text style={styles.value}>{item.specialty}</Text>

                <Text style={styles.label}>Education Qualification</Text>
                <Text style={styles.value}>{item.qualification}</Text>

                <Text style={styles.label}>Fees</Text>
                <Text style={styles.value}>₹{item.fees}</Text>

                <Text style={styles.label}>Experience</Text>
                <Text style={styles.value}>{item.experience} Years</Text>

                <Text style={styles.label}>Average Rating</Text>
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => (
                        <MaterialIcons
                            key={index}
                            name="star"
                            size={24}
                            color={index < item.rating ? '#6b1f58' : 'gray'}
                        />
                    ))}
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAvail}>
                <Text style={styles.buttonText}>Check Availability</Text>
            </TouchableOpacity>
            </View>
        </View>
    );
}

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
    profileImageContainer: {
        backgroundColor: '#e9d6e8',
        alignItems: 'center',
        paddingVertical: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    detailsContainer: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#5e0b55',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
