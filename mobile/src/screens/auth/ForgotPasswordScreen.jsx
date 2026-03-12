import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar,
    ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useState } from 'react';
import { forgotPassword } from '../../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Missing Field', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            await forgotPassword(email.trim().toLowerCase());
            setSubmitted(true);
        } catch (error) {
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.brand}>PAYBUDDY</Text>
                    {submitted
                        ? <Text style={styles.title}>CHECK YOUR{'\n'}EMAIL.</Text>
                        : <Text style={styles.title}>FORGOT{'\n'}PASSWORD?</Text>
                    }
                </View>

                {submitted ? (
                    <View style={styles.successContainer}>
                        <Text style={styles.successIcon}>✉</Text>
                        <Text style={styles.successText}>
                            If that email is registered, we've sent a password reset link.
                            Check your inbox — it may take a minute.
                        </Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.buttonText}>BACK TO SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <Text style={styles.description}>
                            Enter the email address linked to your account and we'll send you a reset link.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="your@email.com"
                                placeholderTextColor="#333"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color="#0A0A0A" />
                                : <Text style={styles.buttonText}>SEND RESET LINK</Text>
                            }
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A'
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 60,
        paddingBottom: 40
    },
    backBtn: {
        marginBottom: 32
    },
    backText: {
        color: '#444',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2
    },
    header: {
        marginBottom: 40
    },
    brand: {
        color: '#F5F500',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 20
    },
    title: {
        color: '#FFFFFF',
        fontSize: 52,
        fontWeight: '900',
        lineHeight: 54,
        letterSpacing: -2
    },
    form: {
        gap: 24
    },
    description: {
        color: '#555',
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '400'
    },
    inputGroup: {
        gap: 8
    },
    label: {
        color: '#444',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2
    },
    input: {
        backgroundColor: '#141414',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 16,
        color: '#FFFFFF',
        fontSize: 15
    },
    button: {
        backgroundColor: '#F5F500',
        borderRadius: 4,
        paddingVertical: 18,
        alignItems: 'center'
    },
    buttonDisabled: {
        opacity: 0.5
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 3
    },
    successContainer: {
        gap: 24,
        alignItems: 'center',
        paddingTop: 20
    },
    successIcon: {
        fontSize: 48
    },
    successText: {
        color: '#555',
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
        fontWeight: '400'
    },
});