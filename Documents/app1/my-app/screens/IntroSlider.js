import React, { useRef, useEffect, useState, useContext } from 'react';
import { View, Text, Button, Dimensions, Image, StyleSheet, Animated, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TabNavigator from '../navigation/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { LaunchContext } from '../navigation/LaunchContext';
import { AuthContext } from '../navigation/Authentication';

const { width } = Dimensions.get('window');
const slides = [
    {
        title: 'Health score',
        description: 'Enter and keep track of Critical Health indicators',
        image: require('../assets/slider1.png')
    },
    {
        title: 'BMI Check',
        description: 'Monitor your BMI regularly',
        image: require('../assets/slider2.png')
    },
    {
        title: 'Health wallet',
        description: 'Enter and keep track of Critical Health indicators',
        image: require('../assets/slider3.png')
    },
    {
        title: 'BMI Check',
        description: 'Monitor your BMI regularly',
        image: require('../assets/slider4.png')
    },
    {
        title: 'Health profile',
        description: 'Enter and keep track of Critical Health indicators',
        image: require('../assets/slider5.png')
    },
];

const OnBoarding = () => {
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;

    const { setIsFirstLaunch } = useContext(AuthContext);
//   const navigation = useNavigation();

  const handleContinue = () => {
    setIsFirstLaunch(false); 
  };


    function renderContent() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEnabled
                decelerationRate={0}
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            >
                {slides.map((item, index) => (
                    <View key={`img-${index}`} style={styles.imageAndTextContainer}>
                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={item.image}
                                resizeMode="cover"
                                style={{
                                    width: "70%",
                                    height: "50%",
                                }}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>

                        {/* Show "Continue" button only on the last slide */}
                        {index === slides.length - 1 && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleContinue}
                            >
                                <Text style={styles.buttonText}>Continue</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </Animated.ScrollView>
        );
    }

    function renderDots() {
        const dotPosition = Animated.divide(scrollX, width);

        return (
            <View style={styles.dotsContainer}>
                {slides.map((_, index) => {
                    const opacity = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });
                    const dotSize = dotPosition.interpolate({
                        inputRange: [index - 1, index, index + 1],
                        outputRange: [8, 17, 8],
                        extrapolate: 'clamp'
                    });

                    return (
                        <Animated.View
                            key={`dot-${index}`}
                            style={[styles.dot, { width: dotSize, height: dotSize, opacity }]}
                        />
                    );
                })}
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                {renderContent()}
            </View>
            <View style={styles.dotsRootContainer}>
                {renderDots()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    imageAndTextContainer: {
        width: width,
    },
    textContainer: {
        position: 'absolute',
        bottom: '10%',
        left: 40,
        right: 40,
    },
    title: {
        color: 'gray',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        textAlign: 'center',
        marginTop: 10,
        color: 'gray',
    },
    dotsRootContainer: {
        position: 'absolute',
        bottom: '10%',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
    },
    dot: {
        borderRadius: 5,
        backgroundColor: 'blue',
        marginHorizontal: 5,
    },
    button: {
        backgroundColor: 'pink',
        width: '90%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default OnBoarding;
