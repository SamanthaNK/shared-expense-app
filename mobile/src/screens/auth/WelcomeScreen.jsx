import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PaperBackground from '../../components/PaperBackground';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, fonts, radius, cardShadow } from '../../constants/theme';

export default function WelcomeScreen({ navigation }) {
    return (
        <PaperBackground>
            <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
            <View style={styles.container}>

                <View style={styles.hero}>
                    <View style={styles.accentBar} />
                    <Text style={styles.brand}>PayBuddy</Text>
                    <Text style={styles.tagline}>Split bills with ease</Text>
                </View>

                <View style={styles.featureRow}>
                    {[
                        { icon: 'calculator-outline', label: 'Auto-split' },
                        { icon: 'bar-chart-outline', label: 'Balances' },
                        { icon: 'checkmark-done-outline', label: 'Settle up' },
                    ].map((f) => (
                        <View key={f.label} style={styles.featItem}>
                            <Ionicons name={f.icon} size={20} color={colors.accent} />
                            <Text style={styles.featLabel}>{f.label}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.actions}>
                    <PrimaryButton
                        label="Sign In"
                        onPress={() => navigation.navigate('Login')}
                    />
                    <PrimaryButton
                        label="Create Account"
                        variant="outline"
                        onPress={() => navigation.navigate('Register')}
                        style={{ marginTop: 10 }}
                    />
                </View>
            </View>
        </PaperBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: 72,
        paddingBottom: 44,
        justifyContent: 'space-between',
    },
    hero: {
        flex: 1,
        justifyContent: 'center',
    },
    accentBar: {
        width: 40,
        height: 4,
        backgroundColor: colors.accent,
        borderRadius: 3,
        marginBottom: 14,
    },
    brand: {
        fontFamily: fonts.bold,
        fontSize: 64,
        color: colors.ink,
        letterSpacing: -1.5,
        lineHeight: 66,
        marginBottom: 10,
    },
    tagline: {
        fontFamily: fonts.regular,
        fontSize: 22,
        color: colors.inkMid,
        lineHeight: 26,
    },
    featureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.linen,
        borderRadius: radius.xl,
        borderWidth: 1.5,
        borderColor: colors.border,
        paddingVertical: 16,
        paddingHorizontal: 10,
        marginBottom: 28,
        ...cardShadow,
    },
    featItem: {
        flex: 1,
        alignItems: 'center',
        gap: 5,
    },
    featLabel: {
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.inkMid,
    },
    actions: {
        marginBottom: 16,
    },
});