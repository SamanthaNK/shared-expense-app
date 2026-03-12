import { View, Text, StyleSheet } from 'react-native';
import PaperBackground from '../../components/PaperBackground';
import { colors, fonts } from '../../constants/theme';

export default function DashboardScreen() {
    return (
        <PaperBackground>
            <View style={styles.container}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.sub}>Your balances will appear here</Text>
            </View>
        </PaperBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 36,
        color: colors.ink,
        marginBottom: 6
    },
    sub: {
        fontFamily: fonts.regular,
        fontSize: 19,
        color: colors.inkMid,
        textAlign: 'center'
    },
});