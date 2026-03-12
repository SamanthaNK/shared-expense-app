import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts, radius } from '../constants/theme';

export default function PrimaryButton({
    label,
    onPress,
    loading = false,
    disabled = false,
    variant = 'filled',
    style,
}) {
    const isOutline = variant === 'outline';
    const isDanger = variant === 'danger';

    return (
        <TouchableOpacity
            style={[
                styles.base,
                variant === 'filled' && styles.filled,
                isOutline && styles.outline,
                isDanger && styles.danger,
                (disabled || loading) && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.78}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'filled' ? colors.white : colors.accent} />
            ) : (
                <Text style={[
                    styles.label,
                    isOutline && styles.labelOutline,
                    isDanger && styles.labelDanger,
                ]}>
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: radius.xl,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filled: {
        backgroundColor: colors.accent,
        shadowColor: '#C4826A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.28,
        shadowRadius: 6,
        elevation: 3,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.accent,
    },
    danger: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.error,
    },
    disabled: { opacity: 0.5 },
    label: {
        fontFamily: fonts.bold,
        fontSize: 22,
        color: colors.white,
        letterSpacing: 0.4,
    },
    labelOutline: { color: colors.accent },
    labelDanger: { color: colors.error },
});