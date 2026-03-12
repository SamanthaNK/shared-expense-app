import {
    View, Text, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';
import PaperBackground from '../../components/PaperBackground';
import PrimaryButton from '../../components/PrimaryButton';
import StyledInput from '../../components/StyledInput';
import StickyNoteCard from '../../components/StickyNoteCard';
import { colors, fonts } from '../../constants/theme';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Password mismatch', 'Your passwords do not match.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Password too short', 'Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            const data = await registerUser(name.trim(), email.trim().toLowerCase(), password);
            await login(data.token, { name: data.name, email: data.email });
        } catch (error) {
            Alert.alert(
                'Registration failed',
                error.response?.data?.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaperBackground>
            <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={20} color={colors.inkMid} />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>Create{'\n'}account.</Text>

                    <StickyNoteCard style={styles.card}>
                        <StyledInput
                            label="Full Name"
                            placeholder="Your name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />

                        <StyledInput
                            label="Email"
                            placeholder="your@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <View>
                            <Text style={styles.fieldLabel}>Password</Text>
                            <View style={styles.passwordRow}>
                                <StyledInput
                                    placeholder="Min 8 characters"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    style={{ flex: 1 }}
                                />
                                <TouchableOpacity
                                    style={styles.eyeBtn}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={18}
                                        color={colors.inkMid}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <StyledInput
                            label="Confirm Password"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showPassword}
                            inputStyle={
                                passwordsMatch
                                    ? { borderColor: colors.success }
                                    : passwordsMismatch
                                        ? { borderColor: colors.error }
                                        : {}
                            }
                            hint={passwordsMatch ? 'Passwords match' : undefined}
                            error={passwordsMismatch ? 'Passwords do not match' : undefined}
                        />
                    </StickyNoteCard>

                    <PrimaryButton
                        label="Create Account"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.cta}
                    />

                    <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLinkText}>
                            Already have an account?{' '}
                            <Text style={styles.loginLinkAccent}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </PaperBackground>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 26,
        paddingTop: 56,
        paddingBottom: 40,
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        marginBottom: 28,
    },
    backText: {
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.inkMid,
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 48,
        color: colors.ink,
        lineHeight: 50,
        letterSpacing: -0.5,
        marginBottom: 6,
    },
    card: {
        gap: 14,
        marginBottom: 6,
    },
    fieldLabel: {
        fontFamily: fonts.bold,
        fontSize: 15,
        color: colors.inkMid,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    eyeBtn: {
        padding: 9,
        backgroundColor: colors.porcelain,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    cta: {
        marginTop: 18,
        marginBottom: 14,
    },
    loginLink: {
        alignItems: 'center',
        paddingVertical: 4,
    },
    loginLinkText: {
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.inkMid,
    },
    loginLinkAccent: {
        fontFamily: fonts.bold,
        color: colors.accent,
    },
});