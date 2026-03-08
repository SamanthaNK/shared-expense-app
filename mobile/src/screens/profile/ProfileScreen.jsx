import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'LOG OUT',
            'Are you sure you want to log out?',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'LOG OUT',
                    style: 'destructive',
                    onPress: async () => await logout(),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PROFILE</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>LOG OUT</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
        paddingHorizontal: 28,
        paddingTop: 70,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: -1,
        marginBottom: 40,
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 4,
        paddingVertical: 18,
        alignItems: 'center',
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '900',
        letterSpacing: 3,
    },
});
