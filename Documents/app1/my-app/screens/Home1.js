import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, ActivityIndicator, Modal, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons'; 

const HomeScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const emergencyContacts = [
        { name: "Chennai", number: "044400060000" },
        { name: "Trichy", number: "043114077777" },
        { name: "Hosur", number: "04344272727" },
        { name: "Salem", number: "04272677777" },
        { name: "Bangaluru", number: "08068016901" },
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleEmergencyPress = () => {
        setModalVisible(true);
    };

    const handleCall = (number) => {
        Linking.openURL(`tel:${number}`);
    };

    const handleBooking = () => {   
          navigation.navigate('Teleconsultation');        
      };

      const handleVisit = () => {        
        navigation.navigate('viewconsult');        
    };

    const handleHealthTipsPress = () => {
        Linking.openURL('https://kauveryhospital.com/blog/category/lifestyle/amp/');
    };

    const handleWhatsAppPress = () => {
        Linking.openURL('https://wa.me/?text=Hi%20I%20need%20support');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                <View style={styles.header1}>
                    <Text style={styles.greetingText}>Hi,</Text>
                    <Text style={styles.nameText}>Ms. Pushpalakshmi A</Text>
                    </View>
                    <TouchableOpacity style={styles.mainMenuButton} onPress={() => navigation.navigate('Menu')}>
                        <Text style={styles.mainMenuText}>Main Menu<Ionicons name="arrow-forward" size={22} color="white" /></Text>
                        
                    </TouchableOpacity>
                </View>

                {/* Main Cards */}
                <View style={styles.cardContainer}>
                    {/* Health Score Card */}
                    <TouchableOpacity style={styles.card} >
                        <Image source={require('../assets/healthscore.png')} style={styles.icon} />
                        <Text style={styles.cardText}>Check your health score</Text>
                    </TouchableOpacity>

                    {/* Book Appointment Card */}
                    {/* <TouchableOpacity style={styles.card1} onPress={() => handleBooking()}>
                        <Image source={require('../assets/calender.png')} style={styles.icon} />
                        <Text style={styles.cardText}>Book an appointment</Text>
                    </TouchableOpacity> */}
                    <View style={styles.cardContainer1}>
                        {/* Disabled Buttons */}
                        <TouchableOpacity style={styles.Card1} onPress={() => handleVisit()}>
                            <Image source={require('../assets/cloud.png')} style={styles.iconDisabled} />
                            <Text style={styles.disabledText1}>Visit 06-Nov-2024</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.Card2} onPress={() => handleBooking()}>
                            <Image source={require('../assets/calender.png')} style={styles.iconDisabled} />
                            <Text style={styles.disabledText1}>Book an appointment</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.cardContainer1}>
                        {/* Disabled Buttons */}
                        <TouchableOpacity style={styles.disabledCard}>
                            <Image source={require('../assets/bookmedicine.png')} style={styles.iconDisabled} />
                            <Text style={styles.disabledText}>Book medicine</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.disabledCard}>
                            <Image source={require('../assets/bookdiagnostic.png')} style={styles.iconDisabled} />
                            <Text style={styles.disabledText}>Book diagnostic</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Health Tips */}
                <TouchableOpacity style={styles.healthTipsContainer} onPress={handleHealthTipsPress}>
                    <Image source={require('../assets/healthtips.png')} style={styles.icon} />
                    <View style={styles.healthTipsContainer1}>
                        <Text style={styles.healthTipsTitle}>Health Tips</Text>
                        <Text style={styles.healthTipsText}>Eat Healthy Meals</Text>
                        <Text style={styles.healthTipsText}>Stay Hydrated</Text>
                        <Text style={styles.healthTipsText}>Exercise regularly</Text>
                        <Text style={styles.healthTipsText}>Sleep Well</Text>
                    </View>
                </TouchableOpacity>

                {/* Location */}
                <TouchableOpacity style={styles.locationcontainer}>
                    <Image source={require('../assets/location.png')} style={styles.icon} />
                    <View style={styles.locationcontainer1}>
                        <Text style={styles.healthTipsTitle}>Location</Text>
                        <Text style={styles.healthTipsText}>Kauvery Hospital -</Text>
                        <Text style={styles.healthTipsText}>No:8, Murrays Gate Road,</Text>
                        <Text style={styles.healthTipsText}>Alwarpet,</Text>
                        <Text style={styles.healthTipsText}>Chennai, Tamil Nadu</Text>
                        <Text style={styles.healthTipsText}>600 018</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.cardContainer1}>
                    {/* Emergency and WhatsApp Buttons */}
                    <TouchableOpacity style={styles.emergencycard} onPress={handleEmergencyPress}>
                        <Image source={require('../assets/emergency.png')} style={styles.iconDisabled} />
                        <Text style={styles.cardText}>Emergency</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.whatsappcard}>
                        <Image source={require('../assets/whatsapp.png')} style={styles.iconDisabled} onPress={handleWhatsAppPress}/>
                        <Text style={styles.cardText}>WhatsApp Support</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                        <View style={styles.modalContent1}>
                            <Text style={styles.modalTitle}>Kauvery Hospital</Text>
                            <Ionicons name="close-circle" size={30} color="red" onPress={() => setModalVisible(false)}/>
                            </View>
                            {emergencyContacts.map((contact, index) => (
                                <TouchableOpacity key={index} style={styles.contactButton} onPress={() => handleCall(contact.number)}>
                                    <Text style={styles.contactText}>{contact.name} - {contact.number}</Text>
                                    <Ionicons name="call" size={24} color="green" />
                                </TouchableOpacity>
                            ))}
                            {/* <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </Modal>
                {loading && (
                    <BlurView intensity={50} style={StyleSheet.absoluteFill}>
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="38" fontWeight="bold" color="#692367" />
                        </View>
                    </BlurView>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp('5%'),
        backgroundColor: '#fff',
        marginTop: 30
    },
    scrollContent: {
        padding: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    header1: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: hp('2%'),
    },
    greetingText: {
        fontSize: wp('6%'),
        color: '#692367',
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: wp('5%'),
        color: '#692367',
        fontWeight: 'bold',
    },
    mainMenuButton: {
        backgroundColor: '#692367',
        padding: wp('2%'),
        borderRadius: 5,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    mainMenuText: {
        color: '#fff',
        fontSize: wp('5%'),
        fontWeight: 'bold'
    },
    cardContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    cardContainer1: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FDEDED',
        width: wp('90%'),
        padding: wp('6%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 18,
        justifyContent: 'space-between'
    },
    card1: {
        flexDirection: 'row',
        backgroundColor: '#F0F8E7',
        width: wp('90%'),
        padding: wp('6%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'space-between'
    },
    icon: {
        width: wp('20%'),
        height: wp('20%'),
        marginBottom: hp('1%'),
    },
    cardText: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        textAlign: 'center',
    },
    disabledCard: {
        backgroundColor: '#EAEAEA',
        width: wp('42%'),
        padding: wp('8%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 18,
    },
    Card1: {
        backgroundColor: '#fcf0c6',
        width: wp('42%'),
        padding: wp('8%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 18,
    },
    Card2: {
        backgroundColor: '#F0F8E7',
        width: wp('42%'),
        padding: wp('8%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 18,
    },
    emergencycard: {
        backgroundColor: '#e5f2fa',
        width: wp('42%'),
        padding: wp('8%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 18,
    },
    whatsappcard: {
        backgroundColor: '#f5eefb',
        width: wp('42%'),
        padding: wp('8%'),
        marginVertical: hp('1%'),
        alignItems: 'center',
        borderRadius: 18,
    },
    iconDisabled: {
        width: wp('15%'),
        height: wp('15%'),
        marginBottom: hp('1%'),
    },
    disabledText: {
        fontSize: wp('5%'),
        color: 'gray',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    disabledText1: {
        fontSize: wp('5%'),
        color: '#000',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    healthTipsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F8E7',
        padding: wp('5%'),
        borderRadius: 18,
        marginTop: hp('2%'),
        justifyContent: 'space-between'
    },
    healthTipsContainer1: {
        flexDirection: 'column',
    },
    healthTipsTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginBottom: hp('1%'),
    },
    healthTipsText: {
        fontSize: wp('4%'),
        marginBottom: hp('0.5%'),
    },
    locationcontainer: {
        flexDirection: 'row',
        backgroundColor: '#faf3e6',
        padding: wp('5%'),
        borderRadius: 18,
        marginTop: hp('2%'),
        justifyContent: 'space-between'
    },
    locationcontainer1: {
        flexDirection: 'column',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a black shadow-like background
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: wp('80%'),
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: wp('5%'),
    },
    modalContent1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#692367',
    },
    modalTitle: {
        fontSize: wp('5%'),
        fontWeight: 'bold',
        marginBottom: hp('2%'),
        color: '#692367'
    },
    contactButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp('2%'),
       
    },
    contactText: {
        fontSize: wp('4.5%'),
    },
    closeButton: {
        marginTop: hp('2%'),
        padding: wp('2%'),
        backgroundColor: '#692367',
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: wp('4.5%'),
    },
});

export default HomeScreen;
