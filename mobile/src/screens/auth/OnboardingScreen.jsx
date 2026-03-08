import {
    View, Text, StyleSheet, TouchableOpacity,
    Dimensions, StatusBar, Animated
} from 'react-native';
import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const slides = [
    {
        tag: '01 / SPLIT',
        title: 'SPLIT EXPENSES.\nSTAY FRIENDS.',
        body: 'Track shared costs between friends, roommates, or travel buddies without the awkward "who owes who" conversations.',
    },
    {
        tag: '02 / TRACK',
        title: 'KEEP EVERY EXPENSE\nIN ONE PLACE',
        body: 'Add bills, split costs instantly, and see balances update in real time for everyone in your group.',
    },
    {
        tag: '03 / SETTLE',
        title: 'SETTLE UP.\nSTRESS FREE.',
        body: 'Pay back friends quickly and keep your finances clear with simple balance tracking.',
    },
];

export default function OnboardingScreen() {
    const [index, setIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const translateAnim = useRef(new Animated.Value(0)).current;
    const { completeOnboarding } = useAuth();

    const slide = slides[index];

    const animateTransition = (callback) => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
            Animated.timing(translateAnim, { toValue: -20, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            callback();
            translateAnim.setValue(20);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
                Animated.timing(translateAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start();
        });
    };

    const goNext = () => {
        if (index < slides.length - 1) {
            animateTransition(() => setIndex(index + 1));
        } else {
            completeOnboarding(); // marks seen, App.js re-renders → AuthNavigator
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />

            {/* Top bar */}
            <View style={styles.topBar}>
                <Text style={styles.brand}>PAYBUDDY</Text>
                <TouchableOpacity onPress={completeOnboarding}>
                    <Text style={styles.skipText}>SKIP</Text>
                </TouchableOpacity>
            </View>

            {/* Slide content */}
            <Animated.View style={[
                styles.content,
                { opacity: fadeAnim, transform: [{ translateY: translateAnim }] }
            ]}>
                <Text style={styles.tag}>{slide.tag}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.body}>{slide.body}</Text>
            </Animated.View>

            {/* Bottom */}
            <View style={styles.bottom}>
                <View style={styles.progressRow}>
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressBar,
                                { backgroundColor: i === index ? '#F5F500' : '#2A2A2A' }
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={goNext} activeOpacity={0.85}>
                    <Text style={styles.buttonText}>
                        {index < slides.length - 1 ? 'NEXT' : 'GET STARTED'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        paddingHorizontal: 28,
        paddingTop: 56,
        paddingBottom: 48,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 64,
    },
    brand: {
        color: '#F5F500',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 4,
    },
    skipText: {
        color: '#444',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    tag: {
        color: '#F5F500',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 3,
        marginBottom: 24,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 52,
        fontWeight: '900',
        lineHeight: 56,
        letterSpacing: -1,
        marginBottom: 28,
    },
    body: {
        color: '#666',
        fontSize: 15,
        lineHeight: 24,
        maxWidth: width * 0.75,
        fontWeight: '400',
    },
    bottom: {
        gap: 20,
    },
    progressRow: {
        flexDirection: 'row',
        gap: 6,
    },
    progressBar: {
        flex: 1,
        height: 3,
    },
    button: {
        backgroundColor: '#F5F500',
        paddingVertical: 18,
        alignItems: 'center',
        borderRadius: 4,
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 3,
    },
});