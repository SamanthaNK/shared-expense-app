import { View, StyleSheet } from 'react-native';
import { colors, radius, cardShadow } from '../constants/theme';

export default function StickyNoteCard({ children, style }) {
    return (
        <View style={[styles.card, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.linen,
        borderRadius: radius.xl,
        borderWidth: 1.5,
        borderColor: colors.border,
        padding: 18,
        ...cardShadow,
    },
});