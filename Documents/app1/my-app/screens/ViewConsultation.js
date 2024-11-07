import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ViewConsultation = () => {
    const [consultationCompleted, setConsultationCompleted] = useState(false);
    const navigation = useNavigation();

    const downloadDocument = (url) => {
        Linking.openURL(url).catch((err) => console.error("Failed to open URL:", err));
      };

    const handleDownload = (fileName) => {
        Alert.alert('Download', `Downloading ${fileName}`);
    };

    const handleStartConsultation = () => {
        setConsultationCompleted(true);
        Alert.alert('Consultation', 'Consultation started');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress} />
                <Text style={styles.headerTitle}>View Visits</Text>
                {/* <Ionicons name="refresh" size={24} color="#6b1f58" /> */}
            </View>
            <View style={styles.separatorLine} />

            <View style={styles.section}>
                <Text style={styles.label}>Consultation on :</Text>
                <Text style={styles.value}>27-Jul-2021 10:45 am</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Doctor Name :</Text>
                <Text style={styles.value}>Dr. Sulochana Christopher</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Status :</Text>
                <Text style={styles.value}>{consultationCompleted ? 'Completed' : 'Booked'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Visit Type :</Text>
                <Text style={styles.value}>{consultationCompleted ? 'Follow up' : 'Consultation'}</Text>
            </View>

            {consultationCompleted ? (
                <>
                    <Text style={styles.sectionTitle}>Visits Summary</Text>
                    <TouchableOpacity
                        style={styles.documentContainer}
                        onPress={() => downloadDocument('https://pdfobject.com/pdf/sample.pdf')}
                    >
                        <Text style={styles.documentText}>VisitSummary_OHC1122988772_202410281105419111.pdf</Text>
                        <MaterialIcons name="cloud-download" size={24} color="black" />
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Prescription</Text>
                    <TouchableOpacity
                        style={styles.documentContainer}
                        onPress={() => downloadDocument('https://example.com/PrescriptionSummary.pdf')}
                    >
                        <Text style={styles.documentText}>PrescriptionSummary_OHC1122988772_202410281105417946.pdf</Text>
                        <MaterialIcons name="cloud-download" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ratingButton} onPress={()=> navigation.navigate('review')}>
                        <Text style={styles.buttonText}>Rating</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <View style={styles.uploadContainer}>
                        <Text style={styles.uploadLabel}>Select</Text>
                        {/* Insert a dropdown or file picker here */}
                        <TouchableOpacity style={styles.uploadIcon} onPress={() => Alert.alert('Upload', 'Upload file clicked')}>
                            <Text style={styles.uploadText}>⬆️</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.tableContainer}>
                        <Text style={styles.tableHeader}>File Type</Text>
                        <Text style={styles.tableHeader}>File Name</Text>
                        <Text style={styles.tableHeader}>Delete</Text>

                        <Text style={styles.tableCell}>Health Records</Text>
                        <Text style={styles.tableCellLink} onPress={() => Alert.alert('Open File', 'Chronic.jpg')}>Chronic.jpg</Text>
                        <TouchableOpacity onPress={() => Alert.alert('Delete', 'Delete file')}>
                            <Text style={styles.tableCellDelete}>🗑️</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.startButton} onPress={handleStartConsultation}>
                        <Text style={styles.buttonText}>Start Consultation</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginLeft: '30%'
    },
    section: {
        flexDirection: 'row',
        marginBottom: 8,
        marginLeft: 10
    },
    label: {
        fontWeight: 'bold',
        color: '#6d1868',
        marginRight: 8,
    },
    value: {
        color: '#000',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6d1868',
        marginTop: 16,
        marginBottom: 8,
    },
    downloadContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    downloadText: {
        color: '#6d1868',
    },
    ratingButton: {
        backgroundColor: '#6d1868',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    uploadContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    uploadLabel: {
        flex: 1,
        color: '#6d1868',
    },
    uploadIcon: {
        backgroundColor: '#eaeaea',
        padding: 10,
        borderRadius: 50,
    },
    uploadText: {
        color: '#6d1868',
    },
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f4f4f4',
        padding: 10,
        borderRadius: 8,
    },
    tableHeader: {
        width: width * 0.3,
        fontWeight: 'bold',
        color: '#6d1868',
    },
    tableCell: {
        width: width * 0.3,
        color: '#000',
    },
    tableCellLink: {
        width: width * 0.3,
        color: '#6d1868',
        textDecorationLine: 'underline',
    },
    tableCellDelete: {
        width: width * 0.3,
        color: 'red',
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#6d1868',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'center',
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5e0b55',
        marginTop: 20,
        marginBottom: 10,marginLeft: 10
      },
      documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e9d6e8',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
      },
      documentText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
        marginRight: 10,
      },
});

export default ViewConsultation;
