import {
    View, Text, StyleSheet, TouchableOpacity,
    StatusBar, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import PaperBackground from '../../components/PaperBackground';
import StickyNoteCard from '../../components/StickyNoteCard';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, fonts, radius, cardShadow } from '../../constants/theme';

const MENU_ITEMS = [
    { icon: 'lock-closed-outline', label: 'Change Password' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security' },
];

export default function ProfileScreen() {
    const { logout, user } = useAuth();

    const initials = user?.name
        ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    const handleLogout = () => {
        Alert.alert(
            'Log out?',
            "You'll need to sign in again to access your groups.",
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
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
        <PaperBackground>
            <StatusBar barStyle="dark-content" backgroundColor={colors.paper} />
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Profile</Text>

                <StickyNoteCard style={styles.avatarCard}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.userName}>{user?.name ?? 'Unknown User'}</Text>
                    <Text style={styles.userEmail}>{user?.email ?? ''}</Text>

                    <TouchableOpacity style={styles.editBtn} activeOpacity={0.75}>
                        <Ionicons name="pencil-outline" size={15} color={colors.accent} />
                        <Text style={styles.editBtnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </StickyNoteCard>

                <View style={styles.menuCard}>
                    {MENU_ITEMS.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.menuRow,
                                index < MENU_ITEMS.length - 1 && styles.menuRowBorder,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={item.icon} size={18} color={colors.inkMid} />
                            <Text style={styles.menuLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward-outline" size={14} color={colors.inkFaint} />
                        </TouchableOpacity>
                    ))}
                </View>

                <PrimaryButton
                    label="Log Out"
                    variant="danger"
                    onPress={handleLogout}
                    style={styles.logoutBtn}
                />

                <Text style={styles.version}>PayBuddy v1.0.0</Text>
            </ScrollView>
        </PaperBackground>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 64,
        paddingBottom: 40,
    },
    pageTitle: {
        fontFamily: fonts.bold,
        fontSize: 42,
        color: colors.ink,
        letterSpacing: -0.5,
        marginBottom: 22,
    },
    avatarCard: {
        alignItems: 'center',
        paddingVertical: 26,
        marginBottom: 14,
    },
    avatarCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        backgroundColor: colors.almond,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 3,
        borderColor: colors.linen,
        ...cardShadow,
    },
    avatarText: {
        fontFamily: fonts.bold,
        fontSize: 26,
        color: colors.white,
    },
    userName: {
        fontFamily: fonts.bold,
        fontSize: 26,
        color: colors.ink,
        marginBottom: 3,
    },
    userEmail: {
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.inkMid,
        marginBottom: 16,
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.accentSoft,
        borderRadius: radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderWidth: 1.5,
        borderColor: colors.powder,
    },
    editBtnText: {
        fontFamily: fonts.bold,
        fontSize: 17,
        color: colors.accent,
    },
    menuCard: {
        backgroundColor: colors.linen,
        borderRadius: radius.xl,
        borderWidth: 1.5,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: 16,
        ...cardShadow,
    },
    menuRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        gap: 14,
    },
    menuRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#E8E0D8',
    },
    menuLabel: {
        fontFamily: fonts.regular,
        fontSize: 19,
        color: colors.ink,
        flex: 1,
    },
    logoutBtn: {
        marginBottom: 18,
    },
    version: {
        fontFamily: fonts.regular,
        fontSize: 15,
        color: colors.inkFaint,
        textAlign: 'center',
    },
});