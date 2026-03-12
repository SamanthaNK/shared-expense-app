import { StyleSheet, View, Dimensions } from 'react-native';
import Svg, { Filter, FeTurbulence, FeColorMatrix, Rect } from 'react-native-svg';
import { colors } from '../constants/theme';

const { width, height } = Dimensions.get('screen');

export default function PaperBackground({ children, style }) {
    return (
        <View style={[styles.root, style]}>
            <Svg
                style={StyleSheet.absoluteFill}
                width={width}
                height={height}
            >
                <Filter id="grain">
                    <FeTurbulence
                        type="fractalNoise"
                        baseFrequency="0.75"
                        numOctaves="4"
                        stitchTiles="stitch"
                    />
                    <FeColorMatrix type="saturate" values="0" />
                </Filter>
                <Rect width={width} height={height} fill={colors.paper} />
                <Rect width={width} height={height} filter="url(#grain)" opacity="0.035" />
            </Svg>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: colors.paper,
    },
});