import {
    View, Text, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { resetPassword } from '../../services/authService';
import PaperBackground from '../../components/PaperBackground';
import PrimaryButton from '../../components/PrimaryButton';
import StyledInput from '../../components/StyledInput';
import StickyNoteCard from '../../components/StickyNoteCard';
import { colors, fonts } from '../../constants/theme';

export default function ResetPasswordScreen({ navigation, route }) {
    const [token, setToken] = useState(route?.params?.token ?? '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

    const handleReset = async () => {
        if (!token.trim()) {
            Alert.alert('Missing token', 'Please paste your reset token.');
            return;
        }
        if (!newPassword || !confirmPassword) {
            Alert.alert('Please fill in all fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Passwords do not match.');
            return;
        }
        if (newPassword.length < 8) {
            Alert.alert('Password too short', 'Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await resetPassword(token.trim(), newPassword);
            setSuccess(true);
        } catch (error) {
            const msg = error.response?.data?.message ?? 'Something went wrong.';
            Alert.alert('Reset failed', msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <PaperBackground>
                <View style={styles.successContainer}>
                    <View style={styles.successIconWrap}>
                        <Ionicons name="checkmark-outline" size={30} color={colors.success} />
                    </View>
                    <Text style={styles.successTitle}>Password updated!</Text>
                    <Text style={styles.successSub}>
                        You can now log in with your new password.
                    </Text>
                    <PrimaryButton
                        label="Go to Sign In"
                        onPress={() => navigation.navigate('Login')}
                        style={{ marginTop: 24, width: '80%' }}
                    />
                </View>
            </PaperBackground>
        );
    }

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

                    <Text style={styles.title}>Set new{'\n'}password.</Text>
                    <Text style={styles.subtitle}>
                        Paste the reset token from your email, then choose a new password.
                    </Text>

                    <StickyNoteCard style={styles.card}>
                        {!route?.params?.token && (
                            <StyledInput
                                label="Reset Token"
                                placeholder="Paste token from email"
                                value={token}
                                onChangeText={setToken}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        )}

                        <View>
                            <Text style={styles.fieldLabel}>New Password</Text>
                            <View style={styles.passwordRow}>
                                <StyledInput
                                    placeholder="Min 8 characters"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
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
                        label="Update Password"
                        onPress={handleReset}
                        loading={loading}
                        style={styles.cta}
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
        paddingBottom: 40
    },
    backBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        marginBottom: 28
    },
    backText: {
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.inkMid
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 48,
        color: colors.ink,
        lineHeight: 50,
        letterSpacing: -0.5,
        marginBottom: 6
    },
    subtitle: {
        fontFamily: fonts.regular,
        fontSize: 17,
        color: colors.inkMid,
        marginBottom: 24
    },
    card: {
        gap: 14,
        marginBottom: 6
    },
    fieldLabel: {
        fontFamily: fonts.bold,
        fontSize: 15,
        color: colors.inkMid,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 5
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    eyeBtn: {
        padding: 9,
        backgroundColor: colors.porcelain,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.border
    },
    cta: {
        marginTop: 18
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32
    },
    successIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.successBg,
        borderWidth: 2,
        borderColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    successTitle: {
        fontFamily: fonts.bold,
        fontSize: 30,
        color: colors.ink,
        marginBottom: 8
    },
    successSub: {
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.inkMid,
        textAlign: 'center'
    },
});