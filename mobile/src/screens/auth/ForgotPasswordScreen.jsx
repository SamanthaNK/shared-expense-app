import {
    View, Text, StyleSheet, TouchableOpacity,
    KeyboardAvoidingView, Platform, StatusBar, ScrollView, Alert,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword } from '../../services/authService';
import PaperBackground from '../../components/PaperBackground';
import PrimaryButton from '../../components/PrimaryButton';
import StyledInput from '../../components/StyledInput';
import StickyNoteCard from '../../components/StickyNoteCard';
import { colors, fonts, radius } from '../../constants/theme';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Please enter your email address.');
            return;
        }
        setLoading(true);
        try {
            await forgotPassword(email.trim().toLowerCase());
        } catch { } finally {
            setLoading(false);
            setSubmitted(true);
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

                    <Text style={styles.title}>
                        {submitted ? 'Check your\ninbox!' : 'Forgot\npassword?'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {submitted
                            ? "If that email's registered, a reset link is on its way."
                            : 'No stress it happens to the best of us.'}
                    </Text>

                    {submitted ? (
                        <StickyNoteCard style={styles.successCard}>
                            <View style={styles.successIconWrap}>
                                <Ionicons name="mail-outline" size={26} color={colors.success} />
                            </View>
                            <Text style={styles.successTitle}>Reset link sent</Text>
                            <Text style={styles.successSub}>
                                We sent a link to{'\n'}
                                <Text style={{ color: colors.accent, fontFamily: fonts.bold }}>{email}</Text>
                            </Text>
                            <Text style={styles.successHint}>
                                Check your spam folder if you don't see it within a minute.
                            </Text>
                            <PrimaryButton
                                label="Back to Sign In"
                                onPress={() => navigation.navigate('Login')}
                                style={{ marginTop: 8 }}
                            />
                        </StickyNoteCard>
                    ) : (
                        <>
                            <StickyNoteCard style={styles.card}>
                                <StyledInput
                                    label="Email address"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </StickyNoteCard>
                            <PrimaryButton
                                label="Send Reset Link"
                                onPress={handleSubmit}
                                loading={loading}
                                style={styles.cta}
                            />
                        </>
                    )}
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
    subtitle: {
        fontFamily: fonts.regular,
        fontSize: 19,
        color: colors.inkMid,
        marginBottom: 24,
    },
    card: {
        marginBottom: 6,
    },
    cta: {
        marginTop: 18,
    },
    successCard: {
        alignItems: 'center',
        gap: 10,
        paddingVertical: 28,
    },
    successIconWrap: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: colors.successBg,
        borderWidth: 1.5,
        borderColor: colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    successTitle: {
        fontFamily: fonts.bold,
        fontSize: 22,
        color: colors.ink,
    },
    successSub: {
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.inkMid,
        textAlign: 'center',
        lineHeight: 24,
    },
    successHint: {
        fontFamily: fonts.regular,
        fontSize: 15,
        color: colors.inkFaint,
        textAlign: 'center',
        lineHeight: 20,
    },
});