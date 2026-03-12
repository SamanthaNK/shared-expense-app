import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '../constants/theme';

export default function StyledInput({
    label,
    error,
    hint,
    style,
    inputStyle,
    ...props
}) {
    return (
        <View style={[styles.wrapper, style]}>
            {label ? (
                <Text style={styles.label}>{label}</Text>
            ) : null}

            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    inputStyle,
                ]}
                placeholderTextColor={colors.inkFaint}
                {...props}
            />

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {hint && !error ? (
                <Text style={styles.hintText}>{hint}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 5,
    },
    label: {
        fontFamily: fonts.bold,
        fontSize: 15,
        color: colors.inkMid,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: colors.porcelain,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: 13,
        paddingVertical: 9,
        fontFamily: fonts.regular,
        fontSize: 18,
        color: colors.ink,
    },
    inputError: {
        borderColor: colors.error,
    },
    errorText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.error,
    },
    hintText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.success,
    },
});