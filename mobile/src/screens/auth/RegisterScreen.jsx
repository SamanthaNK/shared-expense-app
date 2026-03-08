import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar,
    ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password Mismatch', 'Your passwords do not match.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Password Too Short', 'Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            const data = await registerUser(
                name.trim(),
                email.trim().toLowerCase(),
                password
            );
            await login(data.token);
        } catch (error) {
            Alert.alert(
                'Registration Failed',
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
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
                {/* Back */}
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>BACK</Text>
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.brand}>PAYBUDDY</Text>
                    <Text style={styles.title}>CREATE{'\n'}ACCOUNT.</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Your name"
                            placeholderTextColor="#333"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                    </View>

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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.passwordRow}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Min 8 characters"
                                placeholderTextColor="#333"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.showBtn}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.showBtnText}>
                                    {showPassword ? 'HIDE' : 'SHOW'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CONFIRM PASSWORD</Text>
                        <TextInput
                            style={[
                                styles.input,
                                passwordsMatch && styles.inputSuccess,
                                passwordsMismatch && styles.inputError,
                            ]}
                            placeholder="Repeat password"
                            placeholderTextColor="#333"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                        />
                        {passwordsMatch && (
                            <Text style={styles.matchText}>PASSWORDS MATCH</Text>
                        )}
                        {passwordsMismatch && (
                            <Text style={styles.errorText}>PASSWORDS DO NOT MATCH</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#0A0A0A" />
                            : <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                        }
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginLinkText}>
                            ALREADY HAVE AN ACCOUNT?{' '}
                            <Text style={styles.loginLinkAccent}>SIGN IN</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 60,
        paddingBottom: 40,
    },
    backBtn: {
        marginBottom: 32,
    },
    backText: {
        color: '#444',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
    },
    header: {
        marginBottom: 40,
    },
    brand: {
        color: '#F5F500',
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 20,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 52,
        fontWeight: '900',
        lineHeight: 54,
        letterSpacing: -2,
        marginBottom: 12,
    },
    subtitle: {
        color: '#555',
        fontSize: 15,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#444',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
    },
    input: {
        backgroundColor: '#141414',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 4,
        paddingHorizontal: 16,
        paddingVertical: 16,
        color: '#FFFFFF',
        fontSize: 15,
    },
    inputSuccess: {
        borderColor: '#22C55E',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    matchText: {
        color: '#22C55E',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginTop: 4,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginTop: 4,
    },
    passwordRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    showBtn: {
        backgroundColor: '#141414',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 16,
    },
    showBtnText: {
        color: '#555',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    button: {
        backgroundColor: '#F5F500',
        borderRadius: 4,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#0A0A0A',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 3,
    },
    loginLink: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    loginLinkText: {
        color: '#333',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    loginLinkAccent: {
        color: '#F5F500',
    },
});