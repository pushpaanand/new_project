import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Review() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const navigation = useNavigation();

    const handleStarPress = (index) => {
        setRating(index + 1); // Set the rating based on the star selected
    };

    const handleSubmit = () => {
        // Logic to handle submission of review
        if (rating === 0) {
            Alert.alert('Please select a rating');
            return;
        }
        if (feedback.trim() === '') {
            Alert.alert('Please enter your feedback');
            return;
        }
        Alert.alert('Review Submitted', `Rating: ${rating} stars\nFeedback: ${feedback}`);
        // Resetting values after submission
        setRating(0);
        setFeedback('');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="#6b1f58" onPress={handleBackPress} />
                <Text style={styles.headerTitle}>Review</Text>
                <Ionicons name="refresh" size={24} color="#6b1f58" />
            </View>
            <View style={styles.separatorLine} />

            <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                    <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                        <MaterialIcons
                            name={index < rating ? "star" : "star-border"}
                            size={32}
                            color="#6b1f58"
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.feedbackContainer}>
                <Text style={styles.label}>Feedback</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="Write your feedback here"
                    value={feedback}
                    onChangeText={setFeedback}
                    multiline
                />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 20,
    },
    feedbackContainer: {
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        color: '#6b1f58',
        marginBottom: 8,
    },
    textInput: {
        height: 100,
        borderColor: '#6b1f58',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        color: '#000',
    },
    submitButton: {
        backgroundColor: '#5e0b55',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
