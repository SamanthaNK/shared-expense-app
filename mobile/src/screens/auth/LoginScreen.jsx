import {
    View, Text, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import PaperBackground from '../../components/PaperBackground';
import PrimaryButton from '../../components/PrimaryButton';
import StyledInput from '../../components/StyledInput';
import StickyNoteCard from '../../components/StickyNoteCard';
import { colors, fonts } from '../../constants/theme';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const data = await loginUser(email.trim().toLowerCase(), password);
            await login(data.token, { name: data.name, email: data.email });
        } catch (error) {
            Alert.alert(
                'Login failed',
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

                    <Text style={styles.title}>Welcome{'\n'}back!</Text>

                    <StickyNoteCard style={styles.card}>
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

                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </TouchableOpacity>
                    </StickyNoteCard>

                    <PrimaryButton
                        label="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.cta}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <PrimaryButton
                        label="Create an account"
                        variant="outline"
                        onPress={() => navigation.navigate('Register')}
                    />
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
    forgotText: {
        fontFamily: fonts.regular,
        fontSize: 17,
        color: colors.accent,
        textAlign: 'right',
    },
    cta: {
        marginTop: 18,
        marginBottom: 14,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.border,
    },
    dividerText: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.inkFaint,
    },
});