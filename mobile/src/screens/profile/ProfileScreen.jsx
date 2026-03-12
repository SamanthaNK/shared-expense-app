import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';

export default function ProfileScreen() {
    const { logout, user } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'LOG OUT',
            'Are you sure you want to log out?',
            [
                { text: 'CANCEL', style: 'cancel' },
                {
                    text: 'LOG OUT',
                    style: 'destructive',
                    onPress: async () => {
                        await logoutUser();
                        await logout();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>PROFILE</Text>

            {user && (
                <View style={styles.userCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user.name?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
            )}

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
    userCard: {
        alignItems: 'center',
        marginBottom: 48,
        gap: 8,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#F5F500',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    avatarText: {
        color: '#0A0A0A',
        fontSize: 28,
        fontWeight: '900',
    },
    userName: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    userEmail: {
        color: '#555',
        fontSize: 13,
        fontWeight: '400',
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
