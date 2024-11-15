import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const vitalsData = [
    { id: '1', title: 'Chronic Health Conditions', icon: require('../assets/chronic.png'), screen: 'HealthCondition' },
    { id: '2', title: 'Vaccination', icon: require('../assets/vaccination.png'), screen: 'vaccination' },
    { id: '3', title: 'Allergies', icon: require('../assets/allergies.png'), screen: 'allergies' },
    { id: '4', title: 'Family Medical History', icon: require('../assets/medicalhistory.png'), screen: 'family' },
];

const Vitals = () => {
    const navigation = useNavigation();
    const renderVitalItem = ({ item }) => (
        <TouchableOpacity style={styles.vitalItem} onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.iconContainer}>
                {/* Replace the source with actual icon images */}
                <Image source={item.icon} style={styles.icon} />
            </View>
            <Text style={styles.vitalTitle}>{item.title}</Text>
            <Ionicons name="chevron-forward-circle" size={32} color="#6b1f58" />
        </TouchableOpacity>
    );
    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.container1}>
                {/* <Text style={styles.headerText}>Vitals</Text>
            </View> */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Ionicons name="arrow-back" size={24} color="#692367" />
                </TouchableOpacity>

                <Text style={styles.title}>Health Profile</Text>
            </View>

            {/* Thick line below header */}
            <View style={styles.separatorLine} />

            <FlatList
                data={vitalsData}
                renderItem={renderVitalItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        </View>
        </View>
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
        // justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',

    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6b1f58',
        marginLeft: '20%'
    },
    separatorLine: {
        height: 5, // Thick line
        backgroundColor: '#692367',
        width: '100%',
        marginBottom: 20,
        padding: 0
    },
    headerText: {
        fontSize: 24,
        color: '#6b1f58',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    vitalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        backgroundColor: '#fff',
        marginRight: 15,
    },
    icon: {
        width: wp('15%'),
        height: wp('15%'),
        marginBottom: hp('1%'),
    },
    vitalTitle: {
        flex: 1,
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default Vitals;
