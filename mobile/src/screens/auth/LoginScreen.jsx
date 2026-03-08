import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar,
    ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please fill in all fields before continuing.');
            return;
        }

        setLoading(true);
        try {
            const data = await loginUser(email.trim().toLowerCase(), password);
            await login(data.token);
        } catch (error) {
            Alert.alert(
                'Login Failed',
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

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.brand}>PAYBUDDY</Text>
                    <Text style={styles.title}>SIGN{'\n'}IN.</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
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
                                placeholder="••••••••"
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

                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={styles.forgotText}>FORGOT PASSWORD?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#0A0A0A" />
                            : <Text style={styles.buttonText}>SIGN IN</Text>
                        }
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('Register')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.secondaryButtonText}>CREATE AN ACCOUNT</Text>
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
        paddingTop: 70,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 48,
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
        fontSize: 58,
        fontWeight: '900',
        lineHeight: 60,
        letterSpacing: -2,
        marginBottom: 12,
    },
    subtitle: {
        color: '#555',
        fontSize: 15,
        fontWeight: '400',
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
        fontWeight: '400',
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
    forgotBtn: {
        alignSelf: 'flex-end',
        marginTop: -8,
    },
    forgotText: {
        color: '#F5F500',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    button: {
        backgroundColor: '#F5F500',
        borderRadius: 4,
        paddingVertical: 18,
        alignItems: 'center',
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#1E1E1E',
    },
    dividerText: {
        color: '#333',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
    },
    secondaryButton: {
        borderRadius: 4,
        paddingVertical: 18,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222',
    },
    secondaryButtonText: {
        color: '#555',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 2,
    },
});