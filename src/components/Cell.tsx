import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
    value: number | null;
    isSelected: boolean;
    isHighlight: boolean;
    onPress: () => void;
    isFixed: boolean;
    isError: boolean;
};

export default function Cell({ value, isSelected, isHighlight, onPress , isFixed, isError}: Props) {
    return (
        <TouchableOpacity
            style={[
                styles.cell,
                isSelected && styles.selected,
                isHighlight && styles.highlight,
                isFixed && styles.fixed,
                isError && styles.error,
            ]}

            onPress={onPress}
        >
            <Text style={styles.text}>{value ?? ''}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cell: {
        flex: 1,
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    selected: {
        backgroundColor: '#CB997E',
    },
    highlight: {
        backgroundColor: '#F5E6DA',
    },
    text: {
        fontSize: 18,
    },
    fixed: {
        backgroundColor: '#EAEAEA',
    },
    error: {
        backgroundColor: '#FFCDD2',
    },
});